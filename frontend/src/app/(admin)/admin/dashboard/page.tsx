'use client';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats, getAdminReports, updateReportStatus } from '@/lib/api/admin.api';
import { Skeleton } from '@/components/ui/skeleton';
import { Home, Users, AlertTriangle, Star, TrendingUp } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatRelativeTime } from '@/lib/time-format';

export default function AdminDashboardPage() {
	const queryClient = useQueryClient();
	const { data: stats, isLoading: statsLoading } = useQuery({
		queryKey: ['admin-stats'],
		queryFn: getAdminStats,
	});

	const { data: reportsData, isLoading: reportsLoading } = useQuery({
		queryKey: ['admin-reports-recent'],
		queryFn: () => getAdminReports(1, 5),
	});

	const { mutate: handleReportStatus } = useMutation({
		mutationFn: ({ id, status }: { id: string; status: string }) => updateReportStatus(id, status),
		onSuccess: () => {
			toast.success('Cập nhật trạng thái báo cáo thành công');
			queryClient.invalidateQueries({ queryKey: ['admin-reports-recent'] });
			queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
		},
	});

	const statCards = [
		{
			label: 'Total Listings',
			value: stats?.totalRooms || 0,
			icon: Home,
			color: 'text-blue-500',
			bg: 'bg-blue-50',
			subtitle: `↗ ${stats?.totalRooms || 0} total`,
			subtitleColor: 'text-blue-600',
		},
		{
			label: 'Total Users',
			value: stats?.totalUsers?.toLocaleString() || 0,
			icon: Users,
			color: 'text-indigo-500',
			bg: 'bg-indigo-50',
			subtitle: `↗ ${stats?.totalUsers || 0} registered`,
			subtitleColor: 'text-indigo-600',
		},
		{
			label: 'Pending Reports',
			value: stats?.pendingReports || 0,
			icon: AlertTriangle,
			color: 'text-orange-500',
			bg: 'bg-orange-50',
			subtitle: 'Needs attention',
			subtitleColor: 'text-orange-600',
		},
		{
			label: 'Flagged Reviews',
			value: stats?.flaggedReviews || 0,
			icon: Star,
			color: 'text-amber-500',
			bg: 'bg-amber-50',
			subtitle: 'Awaiting review',
			subtitleColor: 'text-amber-600',
		},
	];

	return (
		<div>
			<h1 className='text-3xl font-bold text-gray-900 mb-8'>Overview</h1>

			{/* Stats Cards */}
			{statsLoading ? (
				<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
					{[...Array(4)].map((_, i) => (
						<Skeleton key={i} className='h-32 rounded-2xl' />
					))}
				</div>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
					{statCards.map((card) => {
						const Icon = card.icon;
						return (
							<div
								key={card.label}
								className='bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300'>
								<div className='flex items-center justify-between mb-4'>
									<p className='text-sm font-medium text-gray-500'>{card.label}</p>
									<div className={`p-2.5 rounded-xl ${card.bg}`}>
										<Icon className={`w-5 h-5 ${card.color}`} />
									</div>
								</div>
								<p className='text-3xl font-bold text-gray-900 mb-1'>{card.value}</p>
								<p className={`text-xs font-medium ${card.subtitleColor} flex items-center gap-1`}>
									<TrendingUp className='w-3 h-3' />
									{card.subtitle}
								</p>
							</div>
						);
					})}
				</div>
			)}

			{/* Recent Reports */}
			<div className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
				<div className='px-6 py-5 border-b border-gray-100'>
					<h2 className='text-lg font-bold text-gray-900'>Recent Reports</h2>
				</div>
				{reportsLoading ? (
					<div className='p-6 space-y-4'>
						{[...Array(3)].map((_, i) => (
							<Skeleton key={i} className='w-full h-14' />
						))}
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full'>
							<thead>
								<tr className='border-b border-gray-100'>
									<th className='text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Room</th>
									<th className='text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Reporter</th>
									<th className='text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Reason</th>
									<th className='text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Date</th>
									<th className='text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Status</th>
									<th className='text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Action</th>
								</tr>
							</thead>
							<tbody>
								{reportsData?.data?.length === 0 && (
									<tr>
										<td colSpan={6} className='text-center py-12 text-gray-400 text-sm'>
											Không có báo cáo nào
										</td>
									</tr>
								)}
								{reportsData?.data?.map((report: any) => (
									<tr key={report.id} className='border-b border-gray-50 hover:bg-gray-50/50 transition-colors'>
										<td className='px-6 py-4'>
											<span className='text-sm font-medium text-gray-900'>{report.room?.title || 'Phòng đã xóa'}</span>
										</td>
										<td className='px-6 py-4'>
											<span className='text-sm text-gray-600'>{report.reporter?.fullName}</span>
										</td>
										<td className='px-6 py-4'>
											<span className='text-sm text-gray-600'>{report.reason}</span>
										</td>
										<td className='px-6 py-4'>
											<span className='text-sm text-gray-500'>{formatRelativeTime(report.createdAt)}</span>
										</td>
										<td className='px-6 py-4'>
											<span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
												${report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
												report.status === 'resolved' ? 'bg-green-100 text-green-700' :
												'bg-gray-100 text-gray-600'}`}>
												{report.status === 'pending' ? 'Pending' :
												report.status === 'resolved' ? 'Resolved' : 'Dismissed'}
											</span>
										</td>
										<td className='px-6 py-4'>
											<div className='flex gap-2'>
												{report.status === 'pending' && (
													<>
														<button
															onClick={() => handleReportStatus({ id: report.id, status: 'resolved' })}
															className='px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors'>
															Review
														</button>
														<button
															onClick={() => handleReportStatus({ id: report.id, status: 'dismissed' })}
															className='px-3 py-1.5 bg-white text-gray-600 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors'>
															Dismiss
														</button>
													</>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
