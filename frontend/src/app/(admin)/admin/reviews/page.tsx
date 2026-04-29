'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminReviews, changeReviewStatus, removeReview } from '@/lib/api/admin.api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function AdminReviewsPage() {
	const queryClient = useQueryClient();
	const { data: response, isLoading } = useQuery({
		queryKey: ['admin-reviews'],
		queryFn: () => getAdminReviews(1, 50),
	});

	const { mutate: handleStatusChange } = useMutation({
		mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) => changeReviewStatus(id, isVerified),
		onSuccess: () => {
			toast.success('Cập nhật trạng thái đánh giá thành công');
			queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
		},
	});

	const { mutate: handleDelete } = useMutation({
		mutationFn: removeReview,
		onSuccess: () => {
			toast.success('Đã xóa đánh giá');
			queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
		},
	});

	return (
		<div>
			<h2 className='text-2xl font-bold mb-6 text-gray-800'>Quản lý Đánh giá & Report Fake</h2>
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
									<th className='px-6 py-4'>Phòng</th>
									<th className='px-6 py-4'>Người đánh giá</th>
									<th className='px-6 py-4'>Nội dung</th>
									<th className='px-6 py-4'>Xác thực (Hệ thống duyệt)</th>
									<th className='px-6 py-4 text-center'>Thao tác</th>
								</tr>
							</thead>
							<tbody>
								{response?.data?.map((review: any) => (
									<tr key={review.id} className={`border-b border-border hover:bg-gray-50 ${!review.isVerified ? 'bg-orange-50/30' : 'bg-white'}`}>
										<td className='px-6 py-4 font-medium max-w-[150px] truncate' title={review.room?.title}>
											{review.room?.title || 'Phòng đã xóa'}
										</td>
										<td className='px-6 py-4'>
											<div className='flex flex-col'>
												<span>{review.reviewer?.fullName}</span>
												<span className='text-xs text-muted-foreground'>{review.reviewer?.email}</span>
											</div>
										</td>
										<td className='px-6 py-4'>
											<div className='flex items-center gap-1 mb-1 font-bold text-yellow-500'>
												{review.rating} ⭐
											</div>
											<p className='text-xs text-gray-600 max-w-[250px] line-clamp-3'>{review.comment}</p>
										</td>
										<td className='px-6 py-4'>
											<span className={`px-2 py-1 rounded-full text-xs font-medium ${
												review.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
											}`}>
												{review.isVerified ? 'Hợp lệ' : ' Bị Cảnh báo / Pending'}
											</span>
										</td>
										<td className='px-6 py-4 flex gap-2 justify-center items-center h-full'>
											<Button
												variant={review.isVerified ? 'outline' : 'default'}
												size='sm'
												onClick={() => handleStatusChange({ 
													id: review.id, 
													isVerified: !review.isVerified 
												})}
											>
												{review.isVerified ? 'Đánh dấu Fake' : 'Duyệt'}
											</Button>
											<Button
												variant='destructive'
												size='sm'
												onClick={() => {
													if(confirm('Xóa vĩnh viễn đánh giá này?')) {
														handleDelete(review.id);
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
