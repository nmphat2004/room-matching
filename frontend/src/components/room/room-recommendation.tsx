'use client';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '../ui/skeleton';
import { Sparkle } from 'lucide-react';
import RoomCard from './room-card';

const RoomRecommendations = () => {
	const { user } = useAuthStore();
	const { data, isLoading } = useQuery({
		queryKey: ['recommendations', user?.id],
		queryFn: () =>
			user ?
				api.get('/recommendations').then((r) => r.data)
			:	api.get('/recommendations/popular').then((r) => r.data),
		staleTime: 1000 * 60 * 10,
	});

	if (isLoading) {
		return (
			<section className='py-10'>
				<div className='flex items-center gap-2 mb-5'>
					<Skeleton className='h-7 w-56' />
				</div>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className='rounded-xl border overflow-hidden'>
							<Skeleton className='h-40 w-full' />
							<div className='p-3 space-y-2'>
								<Skeleton className='h-4 w-3/4' />
								<Skeleton className='h-4 w-full' />
								<Skeleton className='h-4 w-1/2' />
							</div>
						</div>
					))}
				</div>
			</section>
		);
	}

	if (!data?.rooms?.length) return null;

	return (
		<section className='py-10'>
			<div className='flex items-center justify-between mb-5'>
				<div>
					<h2 className='text-xl font-bold items-center gap-2'>
						<Sparkle className='w-5 h-5 text-primary' />
						{data.type === 'personalize' ? 'Gợi ý cho bạn' : 'Phòng nổi bật'}
					</h2>
					<p className='text-sm text-muted-foreground'>{data.basedOn}</p>
				</div>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				{data.rooms.map((room: any) => (
					<div key={room.id} className='relative'>
						{/* Match score badge */}
						{room.matchScore && (
							<div className='absolute top-3 left-3 z-10'>
								<span className='bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full'>
									{room.matchScore}% phù hợp
								</span>
							</div>
						)}
						<RoomCard room={room} />
						{/* Match reason */}
						{room.matchReason && (
							<p className='text-xs text-primary mt-1.5 px-1 line-clamp-1'>
								✦ {room.matchReason}
							</p>
						)}
					</div>
				))}
			</div>
		</section>
	);
};

export default RoomRecommendations;
