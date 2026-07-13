import { PrismaClient } from '@prisma/client'

// Singleton Prisma client. Next.js clears the module registry on every hot
// reload in dev, which would otherwise create a new PrismaClient — and a new
// pool of connections to Neon — on each save, quickly exhausting the limit.
// Stashing the instance on globalThis keeps a single client across reloads.
// In production the module is evaluated once, so the guard is a no-op.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
