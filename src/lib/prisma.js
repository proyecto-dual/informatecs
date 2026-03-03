import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
  })
}

// Crear una única instancia global
const globalForPrisma = globalThis

if (!globalForPrisma.prismaGlobal) {
  globalForPrisma.prismaGlobal = prismaClientSingleton()
}

export const prisma = globalForPrisma.prismaGlobal

// Desconectar al cerrar en desarrollo
if (process.env.NODE_ENV !== 'production') {
  const cleanup = async () => {
    await prisma.$disconnect()
  }
  
  process.on('beforeExit', cleanup)
  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
}