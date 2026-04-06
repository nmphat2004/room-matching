'use client';
import AmenityIcon from '@/components/room/amenity-icon';
import { PriceTag } from '@/components/room/price-tag';
import { StarRating } from '@/components/room/star-rating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getReviews } from '@/lib/api/review.api';
import { getRoomById } from '@/lib/api/room.api';
import { useAuthStore } from '@/stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import {
	Car,
	Eye,
	Heart,
	MapPin,
	MessageCircle,
	Phone,
	Share2,
	Shield,
	Wifi,
	Wind,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const amenityIcons: Record<string, any> = {
	wifi: Wifi,
	'điều hòa': Wind,
	'giữ xe': Car,
	'bảo vệ 24/7': Shield,
};

const RoomDetailPage = () => {
	const { id } = useParams();
	const { user } = useAuthStore();
	const [showAllPhotos, setShowAllPhotos] = useState(false);
	const [phoneRevealed, setPhoneRevealed] = useState(false);
	const [saved, setSaved] = useState(false);

	const { data: room, isLoading } = useQuery({
		queryKey: ['room', id],
		queryFn: () => getRoomById(id as string),
	});

	const { data: reviewData } = useQuery({
		queryKey: ['reviews', id],
		queryFn: () => getReviews(id as string),
		enabled: !!id,
	});

	if (isLoading) {
		return (
			<div className='container mx-auto px-4 py-8 max-w-5xl'>
				<Skeleton className='h-96 w-full rounded-xl mb-6' />
				<div className='grid grid-cols-3 gap-6'>
					<div className='col-span-2 gap-6'>
						<Skeleton className='h-8 w-3/4' />
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-full' />
					</div>
					<Skeleton className='h-64 rounded-xl' />
				</div>
			</div>
		);
	}

	if (!room) return null;

	const primaryImage =
		room.images?.find((img) => img.isPrimary) || room.images?.[0];
	const otherImages =
		room.images?.filter((img) => !img.isPrimary).slice(0, 4) || [];

	const reviews = reviewData?.data || [];
	const scores = reviewData?.avgScores || {
		cleanRating: 0,
		securityRating: 0,
		locationRating: 0,
		landlordRating: 0,
		rating: 0,
	};

	return (
		<div className='bg-background'>
			<div className='max-w-7xl mx-auto px-4 py-6'>
				{/* Photo Gallery */}
				<div className='grid grid-cols-4 gap-2 h-[400px] rounded-xl overflow-hidden'>
					<div className='col-span-2 row-span-2 relative'>
						{primaryImage && (
							<Image
								src={primaryImage.url}
								alt={room.title}
								className='w-full h-full object-cover'
							/>
						)}
					</div>
					{otherImages.map((image, index) => (
						<div key={index} className='relative'>
							<Image
								src={image.url}
								alt={`${room.title} ${index + 2}`}
								className='w-full h-full object-cover'
							/>
						</div>
					))}
					<Button
						variant='ghost'
						onClick={() => setShowAllPhotos(true)}
						className='absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors'>
						Xem tất cả {room.images.length} ảnh
					</Button>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8'>
					{/* Main Content */}
					<div className='lg:col-span-2'>
						{/* Tittle */}
						<div>
							<h1 className='mb-3'>{room.title}</h1>
							<div className='flex items-center gap-4 text-sm text-muted-foreground mb-4'>
								<div className='flex items-center gap-1.5'>
									<MapPin className='w-4 h-4' />
									<span>{room.address}</span>
								</div>
								<a href='#' className='text-primary hover:underline'>
									Xem bản đồ
								</a>
							</div>

							<div className='flex items-center gap-4 mb-6'>
								{room.area && (
									<span className='text-sm text-gray-600'>{room.area}m²</span>
								)}
								{room.floor && (
									<span className='text-sm text-gray-600'>
										Tầng {room.floor}
									</span>
								)}
								{room.avgRating > 0 && (
									<div className='flex items-center gap-1'>
										<StarRating
											rating={room.avgRating}
											totalReviews={room.reviewCount}
										/>
									</div>
								)}
								<div className='flex items-center gap-1 text-gray-400 text-sm'>
									<Eye className='w-4 h-4' />
									<span>{room.viewCount} lượt xem</span>
								</div>
							</div>
						</div>

						<div className='mb-6'>
							<PriceTag amount={room.price} size='lg' />
							<p className='text-sm text-muted-foreground mt-1'>
								Điện: {room.electricityCost} • Nước: {room.waterCost}
							</p>
						</div>
					</div>

					<Separator />

					{/* Description */}
					<div>
						<h2 className='mb-3'>Mô tả</h2>
						<p className='text-foreground whitespace-pre-line'>
							{room.description}
						</p>
					</div>

					<Separator />

					{/* Amenities */}
					{room.amenities && room.amenities.length > 0 && (
						<>
							<div>
								<h2 className='mb-4'>Tiện nghi</h2>
								<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
									{room.amenities.map(({ amenity }) => (
										<>
											<AmenityIcon
												key={amenity.id}
												type={amenity.icon}
												size='md'
											/>
											<span className='text-foreground'>{amenity.name}</span>
										</>
									))}
								</div>
							</div>
							<Separator />
						</>
					)}

					{/* House Rules */}
					<div>
						<h2 className='mb-4'>Quy định</h2>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<p className='text-sm text-muted-foreground'>Tiền đặt cọc</p>
								<p>{room.deposit}</p>
							</div>
							<div>
								<p className='text-sm text-muted-foreground'>
									Thời gian ở tối thiểu
								</p>
								<p>{room.minStay}</p>
							</div>
						</div>
					</div>

					<Separator />

					{/* Reviews */}
					<div>
						<div className='flex items-center gap-4 mb-6'>
							<div className='text-center'>
								<div className='text-4xl mb-1'>{room.avgRating}</div>
								<StarRating rating={room.avgRating} size='md' />
								<p className='text-sm text-muted-foreground mt-1'>
									{reviewData?.meta?.total || 0} đánh giá
								</p>
							</div>
							<div className='flex-1 space-y-2'>
								{Object.entries(scores).map(([key, value]) => (
									<div key={key} className='flex items-center gap-3'>
										<span className='text-sm w-32 text-gray-500'>
											{key === 'cleanRating' && 'Sạch sẽ'}
											{key === 'securityRating' && 'An ninh'}
											{key === 'locationRating' && 'Vị trí'}
											{key === 'landlordRating' && 'Chủ nhà'}
											{key === 'rating' && 'Tổng quan'}
										</span>
										<div className='flex-1 bg-secondary rounded-full h-1.5'>
											<div
												className='bg-primary rounded-full h-1.5'
												style={{
													width: `${((value as number) / 5) * 100}%`,
												}}
											/>
										</div>
										<span className='text-sm w-8 text-right'>
											{(value as number)?.toFixed(1)}
										</span>
									</div>
								))}
							</div>
						</div>

						<div className='space-y-6'>
							{reviews.map((review) => (
								<div
									key={review.id}
									className='border-b border-border pb-6 last:border-0'>
									<div className='flex items-start gap-4'>
										<Avatar />
										<div className='flex-1'>
											<div className='flex items-center justify-between mb-1'>
												<div>
													<p className='font-medium'>
														{review.reviewer.fullName}
													</p>
													<p className='text-xs text-muted-foreground'>
														{new Date(review.createdAt).toLocaleDateString(
															'vi-VN',
														)}
													</p>
												</div>
												<StarRating rating={review.rating} size='sm' />
											</div>
											<p className='text-foreground text-sm leading-relaxed'>
												{review.comment}
											</p>
											{review.sentiment && (
												<Badge
													variant='outline'
													className={`mt-2 text-xs ${
														review.sentiment === 'positive' ?
															'text-green-600 border-green-300 '
														: review.sentiment === 'negative' ?
															'text-red-600 border-red-300'
														:	'text-gray-600'
													}`}>
													{review.sentiment === 'positive' ?
														'😊 Tích cực'
													: review.sentiment === 'negative' ?
														'😞 Tiêu cực'
													:	'😐 Trung lập'}
												</Badge>
											)}
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Review Form */}
						{user && user.id !== room.owner.id && (
							<div className='mt-6'>
								{/* <ReviewForm roomId={room.id} /> */}
							</div>
						)}
					</div>

					<Separator />

					{/* Similar Rooms */}
					{/* <div>
							<h2 className='mb-4'>Phòng tương tự</h2>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								{similarRooms.map((room) => (
									<RoomCard key={room.id} room={room} layout='grid' />
								))}
							</div>
						</div> */}
				</div>

				{/* Sidebar */}
				<div className='lg:col-span-1'>
					<div className='sticky top-24 space-y-4'>
						{/* Landlord Card */}
						<div className='bg-card border border-border rounded-xl p-6'>
							<div className='flex items-center gap-3 mb-4'>
								<Avatar className='w-12 h-12'>
									<AvatarImage src={room.owner.avatarUrl} />
									<AvatarFallback className='bg-blue-100 text-primary'>
										{room.owner.fullName?.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className='font-semibold'>{room.owner.fullName}</p>
									<p className='text-xs text-foreground'>Chủ trọ</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>
										Thành viên từ {room.owner.createdAt}
									</p>
								</div>
							</div>

							<div className='space-y-3'>
								<div className='text-center p-3 bg-secondary rounded-lg'>
									{phoneRevealed ?
										<p className='text-lg'>{room.owner.phone}</p>
									:	<button
											onClick={() => setPhoneRevealed(true)}
											className='text-primary hover:underline'>
											Hiện số điện thoại
										</button>
									}
								</div>

								<Link href='/messages' className='block'>
									<Button variant='default' className='w-full'>
										<MessageCircle className='w-4 h-4 mr-2' />
										Nhắn tin ngay
									</Button>
								</Link>

								<Button variant='secondary' className='w-full'>
									<Phone className='w-4 h-4 mr-2' />
									Gọi điện
								</Button>

								<Button
									variant='ghost'
									className='w-full'
									onClick={() => setSaved(!saved)}>
									<Heart
										className={`w-4 h-4 mr-2 ${saved ? 'fill-red-500 text-red-500' : ''}`}
									/>
									{saved ? 'Đã lưu' : 'Lưu phòng'}
								</Button>

								<Button variant='ghost' className='w-full'>
									<Share2 className='w-4 h-4 mr-2' />
									Chia sẻ
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RoomDetailPage;
