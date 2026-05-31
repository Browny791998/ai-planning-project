import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { withAccelerate } from '@prisma/extension-accelerate'

function createClient() {
  const url = process.env.DATABASE_URL ?? ''
  if (url.startsWith('prisma+postgres://')) {
    return new PrismaClient({ accelerateUrl: url }).$extends(withAccelerate())
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) })
}

type PrismaInstance = ReturnType<typeof createClient>

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaInstance | undefined
}

export const prisma: PrismaInstance = global.prismaGlobal ?? createClient()

if (process.env.NODE_ENV !== 'production') global.prismaGlobal = prisma
