import { PrismaClient } from '@prisma/client';

// Singleton: una sola instancia de PrismaClient para toda la app.
// Crear múltiples instancias abre múltiples conexiones a la BD y agota el pool.
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export default prisma;
