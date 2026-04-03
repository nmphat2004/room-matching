import { Room } from '@/types';
import { MapPin, Maximize2, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '../ui/badge';

interface Props {
	room: Room;
}

const RoomCard = ({ room }: Props) => {
	const primaryImage =
		room.images?.find((img) => img.isPrimary) || room.images?.[0];
	const formatPrice = (price: number) =>
		new Intl.NumberFormat('vi-VN').format(price) + 'đ/tháng';

	return (
		<Link href={`/rooms/${room.id}`}>
			<div className='group rounded-xl border bg-white overflow-hidden hover:shadow-lg transition-all duration-200'>
				{/* Ảnh */}
				<div className='relative h-48 bg-gray-100 overflow-hidden'>
					{primaryImage ?
						<Image
							src={primaryImage.url}
							alt={room.title}
							fill
							className='object-cover group-hover:scale-105 transition-transform duration-300'
						/>
					:	<div className='w-full h-full flex items-center justify-center text-gray-300'>
							<Maximize2 className='w-12 h-12' />
						</div>
					}
					<Badge
						className={`absolute top-3 left-3 ${
							room.status === 'AVAILABLE' ?
								'bg-green-500 hover:bg-green-500'
							:	'bg-gray-500 hover:bg-gray-500'
						}`}>
						{room.status === 'AVAILABLE' ? 'Còn phòng' : 'Đã thuê'}
					</Badge>
				</div>

				{/* Thông tin */}
				<div className='p-4'>
					<h3 className='font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors'>
						{room.title}
					</h3>

					<div className='flex items-center gap-1 text-sm text-gray-500 mt-1'>
						<MapPin className='w-3.5 h-3.5 shrink-0' />
						<span className='line-clamp-1'>{room.address}</span>
					</div>

					<div className='flex items-center justify-between mt-3'>
						<span className='text-lg font-bold text-orange-500'>
							{formatPrice(room.price)}
						</span>
					</div>

					<div className='flex items-center gap-3 text-sm text-gray-500'>
						{room.area && <span>{room.area}m²</span>}
						{room.avgRating > 0 && (
							<div className='flex items-center gap-1'>
								<Star className='w-3.5 h-3.5 fill-yellow-400 text-yellow-400' />
								<span className='font-medium'>{room.avgRating.toFixed(1)}</span>
								<span className='text-gray-400'>({room.reviewCount})</span>
							</div>
						)}
					</div>
				</div>

				{/* Amenities */}
				{room.amenities && room.amenities.length > 0 && (
					<div className='flex gap-1 flex-wrap mt-3'>
						{room.amenities.map(({ amenity }) => (
							<Badge key={amenity.id} variant='secondary' className='text-xs'>
								{amenity.name}
							</Badge>
						))}
						{room.amenities.length > 3 && (
							<Badge variant='secondary' className='text-xs'>
								+{room.amenities.length - 3}
							</Badge>
						)}
					</div>
				)}
			</div>
		</Link>
	);
};

export default RoomCard;
