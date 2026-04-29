'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminUsers, toggleUserBan } from '@/lib/api/admin.api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function AdminUsersPage() {
	const queryClient = useQueryClient();
	const { data: users, isLoading } = useQuery({
		queryKey: ['admin-users'],
		queryFn: getAdminUsers,
	});

	const { mutate: handleToggleBan } = useMutation({
		mutationFn: toggleUserBan,
		onSuccess: () => {
			toast.success('Cập nhật trạng thái người dùng thành công');
			queryClient.invalidateQueries({ queryKey: ['admin-users'] });
		},
		onError: () => {
			toast.error('Lỗi khi cập nhật trạng thái');
		},
	});

	return (
		<div>
			<h2 className='text-2xl font-bold mb-6 text-gray-800'>Quản lý người dùng</h2>
			<div className='bg-white rounded-xl shadow-sm border border-border overflow-hidden'>
				{isLoading ? (
					<div className='p-8 space-y-4'>
						<Skeleton className='w-full h-12' />
						<Skeleton className='w-full h-12' />
						<Skeleton className='w-full h-12' />
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full text-sm text-left'>
							<thead className='text-xs text-gray-600 uppercase bg-gray-50 border-b border-border'>
								<tr>
									<th className='px-6 py-4'>Họ tên</th>
									<th className='px-6 py-4'>Email</th>
									<th className='px-6 py-4'>Vai trò</th>
									<th className='px-6 py-4'>Trạng thái</th>
									<th className='px-6 py-4'>Thao tác</th>
								</tr>
							</thead>
							<tbody>
								{users?.map((user: any) => (
									<tr key={user.id} className='bg-white border-b border-border hover:bg-gray-50'>
										<td className='px-6 py-4 font-medium'>{user.fullName}</td>
										<td className='px-6 py-4'>{user.email}</td>
										<td className='px-6 py-4'>
											<span className={`px-2 py-1 rounded-full text-xs font-medium ${
												user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
												user.role === 'LANDLORD' ? 'bg-blue-100 text-blue-700' :
												'bg-green-100 text-green-700'
											}`}>
												{user.role}
											</span>
										</td>
										<td className='px-6 py-4'>
											{user.isDeleted ? (
												<span className='text-red-500 font-medium font-sm'>Đã khóa</span>
											) : (
												<span className='text-green-500 font-medium font-sm'>Hoạt động</span>
											)}
										</td>
										<td className='px-6 py-4'>
											<Button
												variant={user.isDeleted ? "outline" : "destructive"}
												size="sm"
												disabled={user.role === 'ADMIN'}
												onClick={() => handleToggleBan(user.id)}
											>
												{user.isDeleted ? 'Mở khóa' : 'Khóa'}
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
