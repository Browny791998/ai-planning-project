import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export interface CurrentIdentity {
  userId: string
  email: string | null
}

export async function getCurrentIdentity(): Promise<CurrentIdentity | null> {
  const { userId } = await auth()
  if (!userId) return null
  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null
  return { userId, email }
}

export async function getProjectWithAccess(
  projectId: string,
  identity: CurrentIdentity
): Promise<{ id: string; name: string; ownerId: string } | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  })
  if (!project) return null
  if (project.ownerId === identity.userId) return project
  if (identity.email) {
    const collab = await prisma.projectCollaborator.findUnique({
      where: { projectId_email: { projectId, email: identity.email } },
    })
    if (collab) return project
  }
  return null
}
