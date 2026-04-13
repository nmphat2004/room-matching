/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaClient, Role, RoomStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Amenities
  const amenitiesData = [
    { name: 'WiFi', value: 'wifi', icon: 'Wifi' },
    { name: 'Điều hòa', value: 'ac', icon: 'AirVent' },
    { name: 'Giữ xe', value: 'parking', icon: 'Car' },
    { name: 'Thang máy', value: 'elevator', icon: 'Building2' },
    { name: 'An ninh', value: 'security', icon: 'Shield' },
    { name: 'WC riêng', value: 'bathroom', icon: 'Droplet' },
    { name: 'Nhà bếp', value: 'kitchen', icon: 'ChefHat' },
    { name: 'Máy giặt', value: 'washing', icon: 'WashingMachine' },
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
  const passwordHash = await bcrypt.hash('123456', 10);
  const landlord = await prisma.user.upsert({
    where: { email: 'landlord@example.com' },
    update: {},
    create: {
      email: 'landlord@example.com',
      fullName: 'Chủ nhà mẫu',
      passwordHash,
      role: Role.LANDLORD,
      phone: '0123456789',
      isVerified: true,
    },
  });

  // 3. Seed Rooms
  console.log('🌱 Seeding 20 rooms...');
  const districts = [
    'Quận 1',
    'Quận 3',
    'Quận 7',
    'Quận 10',
    'Bình Thạnh',
    'Thủ Đức',
    'Phú Nhuận',
    'Tân Bình',
  ];
  const roomTypes = [
    'Phòng trọ',
    'Chung cư mini',
    'Căn hộ dịch vụ',
    'Nhà nguyên căn',
  ];

  for (let i = 1; i <= 20; i++) {
    const district = districts[Math.floor(Math.random() * districts.length)];
    const type = roomTypes[Math.floor(Math.random() * roomTypes.length)];
    const priceValue = Math.floor(
      Math.random() * (15000000 - 2000000) + 2000000,
    );

    await prisma.room.create({
      data: {
        ownerId: landlord.id,
        title: `${type} cao cấp tại ${district} - Phòng mẫu ${i}`,
        type: type,
        description: `Đây là mô tả chi tiết cho phòng số ${i}. Phòng sạch sẽ, thoáng mát, đầy đủ tiện nghi, an ninh đảm bảo. Gần trường học, bệnh viện và siêu thị.`,
        price: priceValue.toString(),
        electricityCost: '3500',
        waterCost: '100000',
        deposit: priceValue.toString(),
        minStay: '6 tháng',
        address: `${Math.floor(Math.random() * 500) + 1} Đường CMT8, ${district}, TP.HCM`,
        area: Math.floor(Math.random() * (50 - 15) + 15),
        floor: Math.floor(Math.random() * 10) + 1,
        status: RoomStatus.AVAILABLE,
        amenities: {
          create: amenities
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 5) + 3)
            .map((a) => ({
              amenityId: a.id,
            })),
        },
        images: {
          create: [
            {
              url: `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800`,
              isPrimary: true,
            },
            {
              url: `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800`,
              isPrimary: false,
            },
          ],
        },
      },
    });
  }

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
