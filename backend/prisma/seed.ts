import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const amenities = [
    { name: 'WiFi', icon: 'wifi' },
    { name: 'Điều hòa', icon: 'air-conditioner' },
    { name: 'Máy nước nóng', icon: 'water-heater' },
    { name: 'Giữ xe', icon: 'parking' },
    { name: 'Thang máy', icon: 'elevator' },
    { name: 'Bảo vệ 24/7', icon: 'security' },
    { name: 'Nhà bếp', icon: 'kitchen' },
    { name: 'Ban công', icon: 'balcony' },
    { name: 'Tủ lạnh', icon: 'fridge' },
    { name: 'Máy giặt', icon: 'washing-machine' },
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
