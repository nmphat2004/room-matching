import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Amenities
  const amenitiesData = [
    { name: 'Điều hòa', value: 'ac', icon: 'AirVent' },
    { name: 'Giữ xe', value: 'parking', icon: 'Car' },
    { name: 'Thang máy', value: 'elevator', icon: 'Building2' },
    { name: 'An ninh', value: 'security', icon: 'Shield' },
    { name: 'Kệ bếp', value: 'kitchen', icon: 'ChefHat' },
    { name: 'Máy giặt', value: 'washing', icon: 'WashingMachine' },
    { name: 'Đầy đủ nội thất', value: 'furnished', icon: 'Sofa' },
    { name: 'Có gác', value: 'loft', icon: 'ArrowUp' },
    { name: 'Tủ lạnh', value: 'fridge', icon: 'Refrigerator' },
    { name: 'Không chung chủ', value: 'no_shared', icon: 'UserX' },
    { name: 'Giờ giấc tự do', value: 'flexible_hours', icon: 'Clock' },
  ];

  console.log('🌱 Seeding amenities...');
  const amenities: any[] = [];
  for (const item of amenitiesData) {
    const a = await prisma.amenity.upsert({
      where: { name: item.name },
      update: {},
      create: item,
    });
    amenities.push(a);
  }

  // 2. Seed Landlord
  console.log('🌱 Seeding landlord...');
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD as string,
    10,
  );
  await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL as string,
      fullName: 'Admin',
      passwordHash,
      role: Role.ADMIN,
      phone: '0123456789',
      isVerified: true,
    },
  });

  console.log('✅ Seed successful!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
