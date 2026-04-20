import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuario admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@ceramicaconecta.com' },
    update: {},
    create: {
      email: 'admin@ceramicaconecta.com',
      password: adminPassword,
      name: 'Admin Cerámica Conecta',
      role: 'admin'
    }
  });

  console.log('✅ Usuario creado:', user);

  // Crear formatos
  const formats = [
    { name: '10g', grams: 10, kgFraction: 0.01, description: 'Formato pequeño' },
    { name: '100g', grams: 100, kgFraction: 0.1, description: 'Formato estándar' },
    { name: '500g', grams: 500, kgFraction: 0.5, description: 'Formato mediano' },
    { name: '1kg', grams: 1000, kgFraction: 1.0, description: 'Formato grande' }
  ];

  for (const fmt of formats) {
    await prisma.format.upsert({
      where: { name: fmt.name },
      update: {},
      create: fmt
    });
  }

  console.log('✅ Formatos creados');

  // Crear competidores
  const competitors = [
    { name: 'DP', region: 'CABA', isMayorista: true, priorityRank: 1 },
    { name: 'Pagés 1', region: 'Mendoza', isMayorista: false, priorityRank: 2 },
    { name: 'Pagés 2', region: 'Mendoza', isMayorista: false, priorityRank: 2 },
    { name: 'Thibeju', region: 'Mendoza', isMayorista: false, priorityRank: 3 },
    { name: 'Pellizer', region: 'BS AS', isMayorista: true, priorityRank: 3 },
    { name: 'Terra', region: 'BS AS', isMayorista: true, priorityRank: 3 },
    { name: 'Arcillas del Sur', region: 'CABA', isMayorista: true, priorityRank: 1 }
  ];

  for (const comp of competitors) {
    await prisma.competitor.upsert({
      where: { name: comp.name },
      update: {},
      create: comp
    });
  }

  console.log('✅ Competidores creados');

  // Crear descuentos por volumen
  const discounts = [
    { formatId: (await prisma.format.findUnique({ where: { name: '1kg' } })).id, minQuantity: 1, discountPercentage: 5.0 },
    { formatId: (await prisma.format.findUnique({ where: { name: '500g' } })).id, minQuantity: 1, discountPercentage: 10.0 },
    { formatId: (await prisma.format.findUnique({ where: { name: '100g' } })).id, minQuantity: 1, discountPercentage: 10.0 },
    { formatId: (await prisma.format.findUnique({ where: { name: '10g' } })).id, minQuantity: 1, discountPercentage: 11.0 }
  ];

  for (const disc of discounts) {
    await prisma.volumeDiscount.create({ data: disc }).catch(() => {});
  }

  console.log('✅ Descuentos por volumen creados');

  console.log('✅ ¡Seed completado!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
