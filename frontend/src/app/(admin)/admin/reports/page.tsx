'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminReports, updateReportStatus, changeRoomStatus, removeRoom } from '@/lib/api/admin.api';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { formatRelativeTime } from '@/lib/time-format';
import { useState } from 'react';
import { EyeOff, Trash2, Check, X } from 'lucide-react';

const STATUS_TABS = [
	{ key: 'all', label: 'All' },
	{ key: 'pending', label: 'Pending' },
	{ key: 'resolved', label: 'Resolved' },
	{ key: 'dismissed', label: 'Dismissed' },
];

export default function AdminReportsPage() {
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState('all');

	const { data: response, isLoading } = useQuery({
		queryKey: ['admin-reports'],
		queryFn: () => getAdminReports(1, 100),
	});

	const invalidateAll = () => {
		queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
		queryClient.invalidateQueries({ queryKey: ['admin-reports-recent'] });
		queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
		queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
	};

	const { mutate: handleStatusUpdate } = useMutation({
		mutationFn: ({ id, status }: { id: string; status: string }) => updateReportStatus(id, status),
		onSuccess: () => {
			toast.success('Cập nhật trạng thái báo cáo thành công');
			invalidateAll();
		},
	});

	const { mutate: handleHideRoom } = useMutation({
		mutationFn: (roomId: string) => changeRoomStatus(roomId, 'HIDDEN'),
		onSuccess: () => {
			toast.success('Đã ẩn phòng khỏi hệ thống');
			invalidateAll();
		},
	});

	const { mutate: handleDeleteRoom } = useMutation({
		mutationFn: (roomId: string) => removeRoom(roomId),
		onSuccess: () => {
			toast.success('Đã xóa phòng khỏi hệ thống');
			invalidateAll();
		},
	});

	const handleResolveAndHide = (reportId: string, roomId: string) => {
		handleStatusUpdate({ id: reportId, status: 'resolved' });
		handleHideRoom(roomId);
	};

	const handleResolveAndDelete = (reportId: string, roomId: string) => {
		if (confirm('Bạn có chắc muốn XÓA VĨNH VIỄN phòng này? Hành động không thể hoàn tác.')) {
			handleStatusUpdate({ id: reportId, status: 'resolved' });
			handleDeleteRoom(roomId);
		}
	};

	const reports = response?.data || [];
	const filteredReports = activeTab === 'all'
		? reports
		: reports.filter((report: any) => report.status === activeTab);

	return (
		<div>
			<h1 className='text-3xl font-bold text-gray-900 mb-8'>Reports Management</h1>

			{/* Status Tabs */}
			<div className='border-b border-gray-200 mb-8'>
				<div className='flex gap-0'>
					{STATUS_TABS.map((tab) => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`px-6 py-3 text-sm font-semibold transition-colors relative
								${activeTab === tab.key
									? 'text-blue-600'
									: 'text-gray-500 hover:text-gray-700'
								}`}>
							{tab.label}
							{activeTab === tab.key && (
								<div className='absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full' />
							)}
						</button>
					))}
				</div>
			</div>

			<div className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
				{isLoading ? (
					<div className='p-6 space-y-4'>
						{[...Array(3)].map((_, i) => (
							<Skeleton key={i} className='w-full h-14' />
						))}
					</div>
				) : filteredReports.length === 0 ? (
					<div className='py-16 text-center text-gray-400 text-sm'>
						Không có báo cáo nào trong danh mục này
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
								{filteredReports.map((report: any) => (
									<tr key={report.id} className='border-b border-gray-50 hover:bg-gray-50/50 transition-colors'>
										<td className='px-6 py-4'>
											<span className='text-sm font-medium text-gray-900'>{report.room?.title || 'Phòng đã xóa'}</span>
										</td>
										<td className='px-6 py-4'>
											<div>
												<span className='text-sm text-gray-900'>{report.reporter?.fullName}</span>
												<p className='text-xs text-gray-400'>{report.reporter?.email}</p>
											</div>
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
											<div className='flex gap-2 flex-wrap'>
												{report.status === 'pending' ? (
													<>
														{/* Ẩn phòng + resolve report */}
														{report.room && (
															<button
																onClick={() => handleResolveAndHide(report.id, report.room.id)}
																title='Ẩn phòng & đánh dấu đã xử lý'
																className='px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1'>
																<EyeOff className='w-3 h-3' />
																Ẩn phòng
															</button>
														)}
														{/* Xóa phòng + resolve report */}
														{report.room && (
															<button
																onClick={() => handleResolveAndDelete(report.id, report.room.id)}
																title='Xóa vĩnh viễn phòng'
																className='px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1'>
																<Trash2 className='w-3 h-3' />
																Xóa phòng
															</button>
														)}
														{/* Dismiss (bỏ qua) */}
														<button
															onClick={() => handleStatusUpdate({ id: report.id, status: 'dismissed' })}
															title='Bỏ qua báo cáo'
															className='px-3 py-1.5 bg-white text-gray-600 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-1'>
															<X className='w-3 h-3' />
															Dismiss
														</button>
													</>
												) : (
													<button
														onClick={() => handleStatusUpdate({ id: report.id, status: 'pending' })}
														className='px-3 py-1.5 bg-white text-gray-600 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors'>
														Reopen
													</button>
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
