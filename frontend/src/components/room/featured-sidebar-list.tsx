import { Room } from '@/types';
import RelatedRoomCard from './related-room-card';

interface FeaturedSidebarListProps {
	rooms: Room[];
}

const FeaturedSidebarList = ({ rooms }: FeaturedSidebarListProps) => {
	if (!rooms.length) return null;

	return (
		<div className='rounded-2xl border border-border bg-card p-4 space-y-4'>
			<h3 className='font-bold text-lg'>Tin đăng nổi bật</h3>
			<div className='space-y-4'>
				{rooms.map((room) => (
					<RelatedRoomCard key={room.id} room={room} compact />
				))}
			</div>
		</div>
	);
};

export default FeaturedSidebarList;
