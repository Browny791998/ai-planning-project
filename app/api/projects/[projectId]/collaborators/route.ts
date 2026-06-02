import { clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getCurrentIdentity, getProjectWithAccess } from '@/lib/project-access'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await getCurrentIdentity()
  if (!identity) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await params
  const project = await getProjectWithAccess(projectId, identity)
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 })

  const dbCollaborators = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
  })

  const emails = dbCollaborators.map((c) => c.email)
  const enriched = new Map<string, { displayName: string | null; avatarUrl: string | null }>()

  if (emails.length > 0) {
    const client = await clerkClient()
    const { data: users } = await client.users.getUserList({ emailAddress: emails })
    for (const user of users) {
      const primaryEmail = user.emailAddresses.find(
        (e) => e.id === user.primaryEmailAddressId
      )?.emailAddress
      if (primaryEmail) {
        const displayName =
          [user.firstName, user.lastName].filter(Boolean).join(' ') || null
        enriched.set(primaryEmail.toLowerCase(), { displayName, avatarUrl: user.imageUrl ?? null })
      }
    }
  }

  const collaborators = dbCollaborators.map((c) => ({
    email: c.email,
    displayName: enriched.get(c.email)?.displayName ?? null,
    avatarUrl: enriched.get(c.email)?.avatarUrl ?? null,
  }))

  return Response.json({
    collaborators,
    isOwner: project.ownerId === identity.userId,
  })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await getCurrentIdentity()
  if (!identity) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await params
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
  if (project.ownerId !== identity.userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({})) as { email?: unknown }
  const email: string =
    typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email) return Response.json({ error: 'Email required' }, { status: 400 })

  if (identity.email?.toLowerCase() === email) {
    return Response.json({ error: 'Cannot invite yourself' }, { status: 400 })
  }

  const collaborator = await prisma.projectCollaborator.upsert({
    where: { projectId_email: { projectId, email } },
    update: {},
    create: { projectId, email },
  })

  return Response.json({ collaborator }, { status: 201 })
}
