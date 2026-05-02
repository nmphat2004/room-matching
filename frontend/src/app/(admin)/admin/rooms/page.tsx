'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminRooms, changeRoomStatus, removeRoom, analyzeRoomFraud } from '@/lib/api/admin.api';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Eye, Pencil, Trash2, AlertTriangle, Shield, Download } from 'lucide-react';
import { useState } from 'react';

export default function AdminRoomsPage() {
	const queryClient = useQueryClient();
	const [statusFilter, setStatusFilter] = useState('all');
	const [fraudScores, setFraudScores] = useState<Record<string, any>>({});
	const [scanningId, setScanningId] = useState<string | null>(null);

	const { data: response, isLoading } = useQuery({
		queryKey: ['admin-rooms'],
		queryFn: () => getAdminRooms(1, 50),
	});

	const { mutate: handleStatusChange } = useMutation({
		mutationFn: ({ id, status }: { id: string; status: 'AVAILABLE' | 'HIDDEN' }) => changeRoomStatus(id, status),
		onSuccess: () => {
			toast.success('Cập nhật trạng thái phòng thành công');
			queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
		},
	});

	const { mutate: handleDelete } = useMutation({
		mutationFn: removeRoom,
		onSuccess: () => {
			toast.success('Đã xóa phòng khỏi hệ thống');
			queryClient.invalidateQueries({ queryKey: ['admin-rooms'] });
		},
	});

	const handleScanFraud = async (roomId: string) => {
		setScanningId(roomId);
		try {
			const result = await analyzeRoomFraud(roomId);
			setFraudScores((prev) => ({ ...prev, [roomId]: result }));
			if (result.isSuspicious) {
				toast.warning(`Phòng bị đánh dấu nghi ngờ! Score: ${result.score}`);
			} else {
				toast.success(`Phòng sạch. Score: ${result.score}`);
			}
		} catch {
			toast.error('Lỗi khi phân tích phòng');
		} finally {
			setScanningId(null);
		}
	};

	const rooms = response?.data || [];
	const filteredRooms = statusFilter === 'all'
		? rooms
		: rooms.filter((room: any) => {
			if (statusFilter === 'flagged') return fraudScores[room.id]?.isSuspicious;
			return room.status === statusFilter;
		});

	return (
		<div>
			{/* Header */}
			<div className='flex items-center justify-between mb-8'>
				<h1 className='text-3xl font-bold text-gray-900'>Listings Management</h1>
				<div className='flex items-center gap-3'>
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className='px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
						<option value='all'>All Status</option>
						<option value='AVAILABLE'>Active</option>
						<option value='HIDDEN'>Hidden</option>
						<option value='flagged'>Flagged</option>
					</select>
					<button className='px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2'>
						<Download className='w-4 h-4' />
						Export CSV
					</button>
				</div>
			</div>

			{/* Table */}
			<div className='bg-white rounded-2xl border border-gray-100 overflow-hidden'>
				{isLoading ? (
					<div className='p-6 space-y-4'>
						{[...Array(5)].map((_, i) => (
							<Skeleton key={i} className='w-full h-16' />
						))}
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full'>
							<thead>
								<tr className='border-b border-gray-100'>
									<th className='w-12 px-6 py-4'>
										<input type='checkbox' className='rounded border-gray-300' />
									</th>
									<th className='text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Thumbnail</th>
									<th className='text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Title</th>
									<th className='text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Landlord</th>
									<th className='text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Price</th>
									<th className='text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Status</th>
									<th className='text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Views</th>
									<th className='text-center px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider'>Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredRooms.map((room: any) => {
									const fraud = fraudScores[room.id];
									const isFlagged = fraud?.isSuspicious;
									return (
										<tr key={room.id} className='border-b border-gray-50 hover:bg-gray-50/50 transition-colors'>
											<td className='px-6 py-4'>
												<input type='checkbox' className='rounded border-gray-300' />
											</td>
											<td className='px-4 py-4'>
												<div className='w-16 h-12 bg-gray-100 rounded-lg overflow-hidden'>
													{room.images?.[0]?.url ? (
														<img src={room.images[0].url} alt='' className='w-full h-full object-cover' />
													) : (
														<div className='w-full h-full flex items-center justify-center text-gray-400 text-xs'>No img</div>
													)}
												</div>
											</td>
											<td className='px-4 py-4'>
												<span className='text-sm font-medium text-gray-900 line-clamp-1'>{room.title}</span>
											</td>
											<td className='px-4 py-4'>
												<span className='text-sm text-gray-600'>{room.owner?.fullName}</span>
											</td>
											<td className='px-4 py-4'>
												<span className='text-sm font-semibold text-blue-600'>{formatCurrency(Number(room.price))}</span>
											</td>
											<td className='px-4 py-4'>
												{isFlagged ? (
													<span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700'>
														<AlertTriangle className='w-3 h-3' />
														Flagged by AI
													</span>
												) : (
													<span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
														${room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
														{room.status === 'AVAILABLE' ? 'Active' : 'Hidden'}
													</span>
												)}
											</td>
											<td className='px-4 py-4'>
												<span className='text-sm font-medium text-gray-700'>{room.viewCount}</span>
											</td>
											<td className='px-4 py-4'>
												<div className='flex items-center justify-center gap-1'>
													<button
														onClick={() => handleScanFraud(room.id)}
														disabled={scanningId === room.id}
														title='Scan fraud'
														className='p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors disabled:opacity-50'>
														<Shield className={`w-4 h-4 ${scanningId === room.id ? 'animate-spin' : ''}`} />
													</button>
													<button
														onClick={() => handleStatusChange({
															id: room.id,
															status: room.status === 'AVAILABLE' ? 'HIDDEN' : 'AVAILABLE'
														})}
														title={room.status === 'AVAILABLE' ? 'Hide' : 'Show'}
														className='p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors'>
														<Eye className='w-4 h-4' />
													</button>
													<button
														title='Edit'
														className='p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors'>
														<Pencil className='w-4 h-4' />
													</button>
													<button
														onClick={() => {
															if (confirm('Bạn có chắc chắn muốn xóa tin đăng này?')) {
																handleDelete(room.id);
															}
														}}
														title='Delete'
														className='p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors'>
														<Trash2 className='w-4 h-4' />
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
