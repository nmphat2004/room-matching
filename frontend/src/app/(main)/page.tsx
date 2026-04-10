'use client';
import RoomCard from '@/components/room/room-card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
	Building,
	Building2,
	ChevronRight,
	Home,
	School,
	Search,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const HomePage = () => {
	const [searchCity, setSearchCity] = useState('');
	const [priceRange, setPriceRange] = useState('');
	const [roomType, setRoomType] = useState('');

	const categories = [
		{
			icon: Home,
			title: 'Phòng trọ',
			description: 'Phòng đơn, tiện nghi cơ bản',
			color: 'bg-blue-50 text-blue-600',
		},
		{
			icon: Building,
			title: 'Nhà nguyên căn',
			description: 'Nguyên căn riêng tư',
			color: 'bg-green-50 text-green-600',
		},
		{
			icon: Building2,
			title: 'Chung cư mini',
			description: 'Căn hộ, đầy đủ tiện nghi',
			color: 'bg-purple-50 text-purple-600',
		},
		{
			icon: School,
			title: 'Ký túc xá',
			description: 'Dành cho sinh viên',
			color: 'bg-orange-50 text-orange-600',
		},
	];

	const latestRooms = [
		{
			id: '1',
			title: 'Phòng trọ cao cấp gần ĐH Bách Khoa',
			address: 'Quận 10, TP. Hồ Chí Minh',
			price: 4500000,
			area: 25,
			avgRating: 4.5,
			reviewCount: 28,
			images: [
				{
					id: '1',
					url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
				},
			],
			amenities: ['wifi', 'ac', 'parking'] as const,
			status: 'AVAILABLE',
		},
		{
			id: '2',
			title: 'Studio hiện đại Quận 1',
			address: 'Quận 1, TP. Hồ Chí Minh',
			price: 6500000,
			area: 35,
			avgRating: 4.8,
			reviewCount: 42,
			images: [
				{
					id: '2',
					url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
				},
			],
			amenities: ['wifi', 'ac', 'elevator'] as const,
			featured: true,
		},
		{
			id: '3',
			title: 'Phòng đẹp giá rẻ gần chợ',
			address: 'Quận 5, TP. Hồ Chí Minh',
			price: 3200000,
			area: 20,
			avgRating: 4.2,
			reviewCount: 18,
			images: [
				{
					id: '3',
					url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
				},
			],
			amenities: ['wifi', 'bathroom'] as const,
		},
	];

	const topRatedRooms = [
		{
			id: '4',
			title: 'Căn hộ cao cấp view đẹp',
			address: 'Quận 7, TP. Hồ Chí Minh',
			price: 7500000,
			area: 40,
			avgRating: 4.9,
			reviewCount: 56,
			images: [
				{
					id: '1',
					url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
				},
			],
			amenities: ['wifi', 'ac', 'parking', 'elevator'] as const,
			featured: true,
		},
		{
			id: '5',
			title: 'Phòng VIP full nội thất',
			address: 'Bình Thạnh, TP. Hồ Chí Minh',
			price: 5200000,
			area: 28,
			avgRating: 4.7,
			reviewCount: 38,
			images: [
				{
					id: '2',
					url: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800',
				},
			],
			amenities: ['wifi', 'ac', 'washing'] as const,
		},
		{
			id: '6',
			title: 'Studio sang trọng Quận 3',
			address: 'Quận 3, TP. Hồ Chí Minh',
			price: 6200000,
			area: 32,
			avgRating: 4.8,
			reviewCount: 45,
			images: [
				{
					id: '3',
					url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
				},
			],
			amenities: ['wifi', 'ac', 'kitchen'] as const,
		},
		{
			id: '7',
			title: 'Phòng mới xây có gác lửng',
			address: 'Phú Nhuận, TP. Hồ Chí Minh',
			price: 4800000,
			area: 26,
			avgRating: 4.6,
			reviewCount: 32,
			images: [
				{
					id: '4',
					url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
				},
			],
			amenities: ['wifi', 'ac', 'bathroom'] as const,
		},
	];

	return (
		<div className='bg-background'>
			{/* Hero Section */}
			<div
				className='relative bg-linear-to-br from-primary/10 to-accent/10 py-16'
				style={{
					backgroundImage:
						'url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&blur=40)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundBlendMode: 'overlay',
				}}>
				<div className='absolute inset-0 bg-white/80 backdrop-blur-sm'></div>
				<div className='relative max-w-4xl mx-auto px-4 text-center'>
					<h1 className='mb-3 text-4xl'>Tìm phòng trọ hoàn hảo của bạn</h1>
					<p className='mb-8 text-lg text-muted-foreground'>
						Đánh giá thật từ người thuê - Minh bạch, tin cậy
					</p>

					{/* Search bar */}
					<div className='bg-white rounded-xl shadow-lg p-6'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<div>
								<Label className='block mb-2 text-sm'>Thành phố / Quận</Label>
								<select
									value={searchCity}
									onChange={(e) => setSearchCity(e.target.value)}
									className='w-full px-4 py-2.5 rounded-lg border border-border bg-input-background'>
									<option>TP. Hồ Chí Minh</option>
									<option>Hà Nội</option>
									<option>Đà Nẵng</option>
								</select>
							</div>

							<div>
								<label className='block mb-2 text-sm'>Khoảng giá</label>
								<select
									value={priceRange}
									onChange={(e) => setPriceRange(e.target.value)}
									className='w-full px-4 py-2.5 rounded-lg border border-border bg-input-background'>
									<option value='all'>Tất cả</option>
									<option>Dưới 3 triệu</option>
									<option>3-5 triệu</option>
									<option>5-7 triệu</option>
									<option>Trên 7 triệu</option>
								</select>
							</div>

							<div>
								<label className='block mb-2 text-sm'>Loại phòng</label>
								<select
									value={roomType}
									onChange={(e) => setRoomType(e.target.value)}
									className='w-full px-4 py-2.5 rounded-lg border border-border bg-input-background'>
									<option value='all'>Tất cả</option>
									<option>Phòng trọ</option>
									<option>Nhà nguyên căn</option>
									<option>Chung cư mini</option>
								</select>
							</div>
						</div>

						<Link href='/rooms'>
							<Button
								variant='default'
								className='w-full h-10 mt-4 bg-primary hover:bg-primary/90'
								size='lg'>
								<Search className='w-5 h-5 mr-2' />
								Tìm kiếm
							</Button>
						</Link>
					</div>
				</div>
			</div>

			{/* Quick categories */}
			<div className='max-w-7xl mx-auto px-4 py-12'>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
					{categories.map((category) => (
						<Link
							href='/rooms'
							key={category.title}
							className='bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 text-center'>
							<div
								className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
								<category.icon className='w-8 h-8' />
							</div>
							<h3 className='mb-1'>{category.title}</h3>
							<p className='text-sm text-muted-foreground'>
								{category.description}
							</p>
						</Link>
					))}
				</div>
			</div>

			{/* Latest Listings */}
			<div className='bg-secondary py-12'>
				<div className='max-w-7xl mx-auto px-4'>
					<div className='flex items-center justify-between mb-6'>
						<h2>Tin đăng mới nhất</h2>
						<Link
							href='/rooms'
							className='flex items-center gap-1 text-primary hover:underline'>
							Xem tất cả
							<ChevronRight className='w-4 h-4' />
						</Link>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						{latestRooms.map((room) => (
							<RoomCard room={room} key={room.id} layout='grid' />
						))}
					</div>
				</div>
			</div>

			{/* Top Rated Rooms */}
			<div className='max-w-7xl mx-auto px-4 py-12'>
				<div className='flex items-center justify-between mb-6'>
					<h2>Phòng đánh giá cao</h2>
					<Link
						href='/rooms'
						className='flex items-center gap-1 text-primary hover:underline'>
						Xem tất cả
						<ChevronRight className='w-4 h-4' />
					</Link>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
					{topRatedRooms.map((room) => (
						<RoomCard room={room} key={room.id} layout='grid' />
					))}
				</div>
			</div>

			{/* CTA Banner for Landlords */}
			<div className='bg-linear-to-r from-primary to-blue-200 text-white py-16'>
				<div className='max-w-4xl mx-auto px-4 text-center'>
					<h2 className='mb-4 text-white text-3xl'>Bạn là chủ nhà?</h2>
					<p className='mb-6 text-lg text-white'>
						Đăng tin cho thuê phòng miễn phí và tiếp cận hàng nghìn người thuê
					</p>
					<Link href='/post'>
						<Button
							variant='default'
							size='lg'
							className='bg-white h-10 w-40 text-primary hover:bg-white/90'>
							Đăng tin ngay
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
