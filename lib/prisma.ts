import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { withAccelerate } from '@prisma/extension-accelerate'

function createClient() {
  const url = process.env.DATABASE_URL ?? ''
  const base = url.startsWith('prisma+postgres://')
    ? new PrismaClient({ accelerateUrl: url })
    : new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) })
  return base.$extends(withAccelerate())
}

type PrismaInstance = ReturnType<typeof createClient>

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaInstance | undefined
}

export const prisma: PrismaInstance = global.prismaGlobal ?? createClient()

if (process.env.NODE_ENV !== 'production') global.prismaGlobal = prisma
