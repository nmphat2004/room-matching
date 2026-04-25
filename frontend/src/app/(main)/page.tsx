'use client';
import RoomCard from '@/components/room/room-card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { districts, priceRanges, roomTypesList } from '@/data/data';
import { getRooms } from '@/lib/api/room.api';
import { useAuthStore } from '@/stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import {
	Building,
	Building2,
	ChevronRight,
	Home,
	School,
	Search,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const HomePage = () => {
	const [searchDistrict, setSearchDistrict] = useState('');
	const [priceRange, setPriceRange] = useState('');
	const [roomType, setRoomType] = useState('');
	const { user } = useAuthStore();
	const router = useRouter();

	const handlePostClick = (e: React.MouseEvent) => {
		if (user?.role !== 'LANDLORD') {
			e.preventDefault();
			toast.error('Bạn cần có tài khoản Chủ trọ để đăng tin!', {
				description: 'Vui lòng đăng nhập với vai trò Chủ trọ.',
				action: {
					label: 'Đăng nhập',
					onClick: () => router.push('/login'),
				},
			});
		}
	};

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

	// Fetch newest rooms
	const { data: latestRooms, isLoading: newestLoading } = useQuery({
		queryKey: ['rooms', 'newest'],
		queryFn: () =>
			getRooms({
				sortBy: 'newest',
				page: 1,
				limit: 3,
			}),
	});

	// Fetch top rated rooms
	const { data: topRatedRooms, isLoading: ratingLoading } = useQuery({
		queryKey: ['rooms', 'top-rated'],
		queryFn: () =>
			getRooms({
				sortBy: 'rating',
				page: 1,
				limit: 4,
			}),
	});

	const isLoading = newestLoading || ratingLoading;

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
								<Label className='block mb-2 text-sm'>Quận</Label>
								<select
									value={searchDistrict}
									onChange={(e) => setSearchDistrict(e.target.value)}
									className='w-full px-4 py-2.5 rounded-lg border border-border bg-input-background'>
									{districts.map((district) => (
										<option key={district} value={district}>
											{district}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className='block mb-2 text-sm'>Khoảng giá</label>
								<select
									value={priceRange}
									onChange={(e) => setPriceRange(e.target.value)}
									className='w-full px-4 py-2.5 rounded-lg border border-border bg-input-background'>
									{priceRanges.map((priceRange) => (
										<option key={priceRange.label}>{priceRange.label}</option>
									))}
								</select>
							</div>

							<div>
								<label className='block mb-2 text-sm'>Loại phòng</label>
								<select
									value={roomType}
									onChange={(e) => setRoomType(e.target.value)}
									className='w-full px-4 py-2.5 rounded-lg border border-border bg-input-background'>
									{roomTypesList.map((roomType) => (
										<option key={roomType.label} value={roomType.value}>
											{roomType.label}
										</option>
									))}
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
							href={`/rooms?roomType=${category.title.replace(/\s+/g, '+')}`}
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
							href='/rooms?sortBy=newest'
							className='flex items-center gap-1 text-primary hover:underline'>
							Xem tất cả
							<ChevronRight className='w-4 h-4' />
						</Link>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						{isLoading ?
							Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className='space-y-4'>
									<Skeleton className='h-48 w-full rounded-xl' />
									<Skeleton className='h-4 w-3/4' />
									<Skeleton className='h-4 w-1/2' />
								</div>
							))
						:	latestRooms?.data.map((room) => (
								<RoomCard room={room} key={room.id} layout='grid' />
							))
						}
					</div>
				</div>
			</div>

			{/* Top Rated Rooms */}
			<div className='max-w-7xl mx-auto px-4 py-12'>
				<div className='flex items-center justify-between mb-6'>
					<h2>Phòng đánh giá cao</h2>
					<Link
						href='/rooms?sortBy=rating'
						className='flex items-center gap-1 text-primary hover:underline'>
						Xem tất cả
						<ChevronRight className='w-4 h-4' />
					</Link>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
					{isLoading ?
						Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className='space-y-4'>
								<Skeleton className='h-48 w-full rounded-xl' />
								<Skeleton className='h-4 w-3/4' />
								<Skeleton className='h-4 w-1/2' />
							</div>
						))
					:	topRatedRooms?.data.map((room) => (
							<RoomCard room={room} key={room.id} layout='grid' />
						))
					}
				</div>
			</div>

			{/* CTA Banner for Landlords */}
			<div className='bg-linear-to-r from-primary to-blue-200 text-white py-16'>
				<div className='max-w-4xl mx-auto px-4 text-center'>
					<h2 className='mb-4 text-white text-3xl'>Bạn là chủ nhà?</h2>
					<p className='mb-6 text-lg text-white'>
						Đăng tin cho thuê phòng miễn phí và tiếp cận hàng nghìn người thuê
					</p>
					<Link href='/post' onClick={handlePostClick}>
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
