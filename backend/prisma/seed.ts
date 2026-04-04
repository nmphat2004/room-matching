import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const amenities = [
    { name: 'WiFi', icon: 'Wifi' },
    { name: 'Điều hòa', icon: 'AirVent' },
    { name: 'Bãi đỗ xe', icon: 'Car' },
    { name: 'Thang máy', icon: 'Building2' },
    { name: 'Bảo vệ 24/7', icon: 'Shield' },
    { name: 'WC riêng', icon: 'DropLet' },
    { name: 'Nhà bếp', icon: 'ChefHat' },
    { name: 'Máy giặt', icon: 'WashingMachine' },
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
