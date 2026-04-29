'use client';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '@/lib/api/admin.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Home, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
	const { data: stats, isLoading } = useQuery({
		queryKey: ['admin-stats'],
		queryFn: getAdminStats,
	});

	if (isLoading) {
		return (
			<div className='flex gap-4'>
				<Skeleton className='h-32 w-full max-w-sm rounded-xl' />
				<Skeleton className='h-32 w-full max-w-sm rounded-xl' />
				<Skeleton className='h-32 w-full max-w-sm rounded-xl' />
			</div>
		);
	}

	return (
		<div>
			<h2 className='text-3xl font-bold mb-6 text-gray-800'>Dashboard</h2>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Users</CardTitle>
						<Users className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-3xl font-bold'>{stats?.totalUsers || 0}</div>
						<p className='text-xs text-muted-foreground mt-1'>
							Active and inactive users
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Rooms</CardTitle>
						<Home className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-3xl font-bold'>{stats?.totalRooms || 0}</div>
						<p className='text-xs text-muted-foreground mt-1'>
							Available and hidden rooms
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-medium'>Total Reviews</CardTitle>
						<Star className='h-4 w-4 text-muted-foreground' />
					</CardHeader>
					<CardContent>
						<div className='text-3xl font-bold'>{stats?.totalReviews || 0}</div>
						<p className='text-xs text-muted-foreground mt-1'>
							All reviews submitted
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
