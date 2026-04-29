'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminRooms, changeRoomStatus, removeRoom } from '@/lib/api/admin.api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminRoomsPage() {
	const queryClient = useQueryClient();
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

	return (
		<div>
			<h2 className='text-2xl font-bold mb-6 text-gray-800'>Quản lý Tin đăng</h2>
			<div className='bg-white rounded-xl shadow-sm border border-border overflow-hidden'>
				{isLoading ? (
					<div className='p-8 space-y-4'>
						<Skeleton className='w-full h-12' />
						<Skeleton className='w-full h-12' />
						<Skeleton className='w-full h-12' />
						<Skeleton className='w-full h-12' />
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full text-sm text-left'>
							<thead className='text-xs text-gray-600 uppercase bg-gray-50 border-b border-border'>
								<tr>
									<th className='px-6 py-4'>Tin đăng</th>
									<th className='px-6 py-4'>Chủ trọ</th>
									<th className='px-6 py-4'>Giá</th>
									<th className='px-6 py-4'>Trạng thái</th>
									<th className='px-6 py-4 text-center'>Thao tác</th>
								</tr>
							</thead>
							<tbody>
								{response?.data?.map((room: any) => (
									<tr key={room.id} className='bg-white border-b border-border hover:bg-gray-50'>
										<td className='px-6 py-4 font-medium max-w-[250px] truncate' title={room.title}>
											{room.title}
										</td>
										<td className='px-6 py-4'>
											<div className='flex flex-col'>
												<span>{room.owner?.fullName}</span>
												<span className='text-xs text-muted-foreground'>{room.owner?.email}</span>
											</div>
										</td>
										<td className='px-6 py-4 font-medium text-primary'>
											{formatCurrency(Number(room.price))}
										</td>
										<td className='px-6 py-4'>
											<span className={`px-2 py-1 rounded-full text-xs font-medium ${
												room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
												'bg-gray-100 text-gray-700'
											}`}>
												{room.status === 'AVAILABLE' ? 'Đang hiện' : 'Đang ẩn'}
											</span>
										</td>
										<td className='px-6 py-4 flex gap-2 justify-center'>
											<Button
												variant='outline'
												size='sm'
												onClick={() => handleStatusChange({ 
													id: room.id, 
													status: room.status === 'AVAILABLE' ? 'HIDDEN' : 'AVAILABLE' 
												})}
											>
												{room.status === 'AVAILABLE' ? 'Ẩn' : 'Hiện'}
											</Button>
											<Button
												variant='destructive'
												size='sm'
												onClick={() => {
													if(confirm('Bạn có chắc chắn muốn xóa tin đăng này?')) {
														handleDelete(room.id);
													}
												}}
											>
												Xóa
											</Button>
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
