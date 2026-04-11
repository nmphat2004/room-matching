import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const amenities = [
    { name: 'WiFi', value: 'wifi' },
    { name: 'Điều hòa', value: 'ac' },
    { name: 'Giữ xe', value: 'parking' },
    { name: 'Thang máy', value: 'elevator' },
    { name: 'An ninh', value: 'security' },
    { name: 'WC riêng', value: 'bathroom' },
    { name: 'Nhà bếp', value: 'kitchen' },
    { name: 'Máy giặt', value: 'washing' },
  ];

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { name: amenity.name },
      update: {},
      create: amenity,
    });
  }

  console.log('✅ Seeded amenities successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
