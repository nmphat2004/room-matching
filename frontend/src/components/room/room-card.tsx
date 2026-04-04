import { Room } from '@/types';
import { MapPin, Maximize, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import AmenityIcon from './amenity-icon';

interface Props {
	room: Room;
	layout?: 'grid' | 'list';
}

const RoomCard = ({ room, layout = 'grid' }: Props) => {
	const primaryImage =
		room.images?.find((img) => img.isPrimary) || room.images?.[0];
	const formatPrice = (price: number) =>
		new Intl.NumberFormat('vi-VN').format(price);

	if (layout === 'list') {
		return (
			<Link href={`/rooms/${room.id}`}>
				<div className='bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow duration-200 flex gap-4'>
					{/* Ảnh */}
					<div className='relative shrink-0'>
						{primaryImage ?
							<Image
								src={primaryImage.url}
								alt={room.title}
								fill
								className='w-[200px] h-[140px] rounded-lg object-cover'
							/>
						:	<div className='w-full h-full flex items-center justify-center text-gray-300'>
								<Maximize2 className='w-12 h-12' />
							</div>
						}
					</div>

					{/* Thông tin */}
					<div className='flex-1 flex flex-col justify-between'>
						<div>
							<h3 className='mb-2 line-clamp-1'>{room.title}</h3>

							<div className='flex items-center gap-1.5 text-sm text-muted-foreground mb-2'>
								<MapPin className='w-4 h-4' />
								<span className='line-clamp-1'>{room.address}</span>
							</div>

							<div className='inline-flex items-baseline gap-1'>
								<span className='text-lg text-accent'>
									{formatPrice(room.price)}
								</span>
								<span className='text-lg text-muted-foreground'>
									{'đ/tháng'}
								</span>
							</div>

							<div className='flex items-center gap-3 mt-2 text-sm text-muted-foreground'>
								<div className='flex items-center gap-1'>
									<Maximize className='w-4 h-4' />
									<span>{room.area}m²</span>
								</div>
							</div>

							<div className='flex items-center justify-between mt-3'>
								<div className='flex items-center gap-2 flex-wrap'>
									{room.amenities.map((amenity) => (
										<AmenityIcon
											key={amenity.amenity.id}
											type={amenity.amenity.icon}
											label={amenity.amenity.name}
											size='sm'
										/>
									))}
								</div>
								{/* <div className='flex items-center gap-2'>
									<StarRating
										rating={rating}
										totalReviews={reviewCount}
										size='sm'
									/>
									<Badge variant={status}>
										{status === 'available' ? 'Còn phòng' : 'Đã cho thuê'}
									</Badge>
								</div> */}
							</div>
						</div>
					</div>
				</div>
			</Link>
		);
	}
};

export default RoomCard;
