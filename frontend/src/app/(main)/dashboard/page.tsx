'use client';
import { useEffect, useState } from 'react';
import { ListPlus, MessageSquare, Eye, Star, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getMyRoom } from '@/lib/api/room.api';
import { getConversations } from '@/lib/api/chat.api';
import { PriceTag } from '@/components/room/price-tag';

const DashboardPage = () => {
	const { user, isLoading } = useAuthStore();
	const router = useRouter();
	const [filterStatus, setFilterStatus] = useState('all');

	useEffect(() => {
		if (!isLoading && (!user || user.role !== 'LANDLORD')) {
			router.replace('/');
		}
	}, [isLoading, user, router]);

	const { data: myRooms = [], isLoading: isLoadingRooms } = useQuery({
		queryKey: ['dashboard-my-rooms'],
		queryFn: () => getMyRoom(),
		enabled: Boolean(user?.id && user.role === 'LANDLORD'),
	});

	const { data: conversations = [], isLoading: isLoadingConversations } =
		useQuery({
			queryKey: ['dashboard-conversations'],
			queryFn: getConversations,
			enabled: Boolean(user?.id && user.role === 'LANDLORD'),
		});

	if (isLoading || !user || user.role !== 'LANDLORD') {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
			</div>
		);
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'AVAILABLE':
				return <Badge>Đang hiển thị</Badge>;
			case 'RENTED':
				return <Badge variant='secondary'>Đã cho thuê</Badge>;
			case 'HIDDEN':
				return <Badge variant='default'>Đã ẩn</Badge>;
			default:
				return <Badge variant='default'>Chờ duyệt</Badge>;
		}
	};

	const filteredListings = myRooms.filter((listing) =>
		filterStatus === 'all' ? true : listing.status === filterStatus,
	);

	const totalViews = myRooms.reduce((sum, room) => sum + room.viewCount, 0);
	const totalReviews = myRooms.reduce(
		(sum, room) => sum + (room._count?.reviews || room.reviewCount || 0),
		0,
	);
	const unreadMessages = conversations.filter(
		(item) => item.messages?.[0] && item.messages[0].senderId !== user.id,
	).length;

	const stats = [
		{
			label: 'Tin đăng',
			value: myRooms.length.toString(),
			icon: ListPlus,
			color: 'text-blue-600',
		},
		{
			label: 'Tổng lượt xem',
			value: totalViews.toString(),
			icon: Eye,
			color: 'text-green-600',
		},
		{
			label: 'Tin nhắn mới',
			value: unreadMessages.toString(),
			icon: MessageSquare,
			color: 'text-orange-600',
		},
		{
			label: 'Tổng đánh giá',
			value: totalReviews.toString(),
			icon: Star,
			color: 'text-amber-600',
		},
	];

	return (
		<div className='bg-background min-h-screen'>
			<div className='max-w-7xl mx-auto px-4 py-6'>
				<div className='space-y-6'>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
						{stats.map((stat) => (
							<div
								key={stat.label}
								className='bg-card border border-border rounded-xl p-6'>
								<div className='flex items-center justify-between mb-2'>
									<stat.icon className={`w-6 h-6 ${stat.color}`} />
									<span className='text-2xl'>{stat.value}</span>
								</div>
								<p className='text-sm text-muted-foreground'>{stat.label}</p>
							</div>
						))}
					</div>

					<div className='bg-card border border-border rounded-xl'>
						<div className='p-6 border-b border-border'>
							<div className='flex flex-wrap items-center justify-between gap-3'>
								<h2>Tin đăng của tôi</h2>
								<div className='flex gap-2'>
									<Link href='/chat'>
										<Button variant='outline'>Tin nhắn</Button>
									</Link>
									<Link href='/post'>
										<Button
											variant='default'
											className='bg-accent hover:bg-accent/90'>
											<ListPlus className='w-4 h-4 mr-2' />
											Đăng tin mới
										</Button>
									</Link>
								</div>
							</div>

							<div className='flex items-center gap-2 mt-4'>
								{[
									{ value: 'all', label: 'Tất cả' },
									{ value: 'AVAILABLE', label: 'Đang hiển thị' },
									{ value: 'RENTED', label: 'Đã cho thuê' },
									{ value: 'HIDDEN', label: 'Đã ẩn' },
								].map((status) => (
									<button
										key={status.value}
										onClick={() => setFilterStatus(status.value)}
										className={`px-4 py-2 rounded-lg transition-colors ${
											filterStatus === status.value ?
												'bg-primary text-white'
											:	'bg-secondary text-foreground hover:bg-secondary/80'
										}`}>
										{status.label}
									</button>
								))}
							</div>
						</div>

						{isLoadingRooms || isLoadingConversations ?
							<div className='py-16 flex justify-center'>
								<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
							</div>
						: filteredListings.length === 0 ?
							<div className='py-16 text-center text-muted-foreground'>
								Không có tin đăng phù hợp bộ lọc
							</div>
						:	<div className='divide-y'>
								{filteredListings.map((listing) => (
									<div
										key={listing.id}
										className='p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4'>
										<Image
											src={
												listing.images?.[0]?.url ||
												'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200'
											}
											alt={listing.title}
											width={200}
											height={200}
											className='w-full md:w-28 h-28 rounded-lg object-cover'
										/>
										<div className='flex-1'>
											<Link
												href={`/rooms/${listing.id}`}
												className='hover:text-primary'>
												{listing.title}
											</Link>
											<div className='mt-1'>
												<PriceTag amount={listing.price} size='sm' />
											</div>
											<div className='mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground'>
												<span>{listing.address}</span>
												<span>{listing.viewCount} lượt xem</span>
												<span>
													{listing._count?.reviews || listing.reviewCount || 0}{' '}
													đánh giá
												</span>
											</div>
										</div>
										<div className='flex items-center gap-3'>
											{getStatusBadge(listing.status)}
											<Link href={`/rooms/${listing.id}`}>
												<Button variant='outline'>Xem tin</Button>
											</Link>
										</div>
									</div>
								))}
							</div>
						}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
