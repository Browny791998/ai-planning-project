import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export interface ProjectData {
  id: string
  name: string
  owned: boolean
}

export async function getProjectsForUser(): Promise<{
  myProjects: ProjectData[]
  sharedProjects: ProjectData[]
}> {
  const { userId } = await auth()
  if (!userId) return { myProjects: [], sharedProjects: [] }

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress ?? null

  const owned = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true },
  })

  let sharedProjects: ProjectData[] = []
  if (email) {
    const collaborations = await prisma.projectCollaborator.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
      select: { projectId: true },
    })
    if (collaborations.length > 0) {
      const projectIds = collaborations.map((c) => c.projectId)
      const projects = await prisma.project.findMany({
        where: { id: { in: projectIds } },
        select: { id: true, name: true },
      })
      sharedProjects = projects.map((p) => ({ id: p.id, name: p.name, owned: false }))
    }
  }

  return {
    myProjects: owned.map((p) => ({ id: p.id, name: p.name, owned: true })),
    sharedProjects,
  }
}
