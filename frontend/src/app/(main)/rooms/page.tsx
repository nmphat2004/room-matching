'use client';
import RoomCard from '@/components/room/room-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { getRooms } from '@/lib/api/room.api';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const RoomsPage = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathName = usePathname();

	const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
	const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
	const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
	const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
	const [page, setPage] = useState(1);

	const { data, isLoading } = useQuery({
		queryKey: ['rooms', keyword, minPrice, maxPrice, sortBy, page],
		queryFn: () =>
			getRooms({
				keyword: keyword || undefined,
				minPrice: minPrice ? Number(minPrice) : undefined,
				maxPrice: maxPrice ? Number(maxPrice) : undefined,
				sortBy,
				page,
				limit: 12,
				minRating: 1,
			}),
	});

	const handleSearch = () => {
		const params = new URLSearchParams(searchParams);
		if (keyword) params.set('keyword', keyword);
		else params.delete('keyword');
		if (minPrice) params.set('minPrice', minPrice);
		else params.delete('minPrice');
		if (maxPrice) params.set('maxPrice', maxPrice);
		else params.delete('maxPrice');
		if (sortBy) params.set('sortBy', sortBy);
		else params.delete('sortBy');

		console.log(pathName + `?${params.toString()}`);

		router.push(pathName + `?${params.toString()}`);
		setPage(1);
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			{/* Search bar */}
			<div className='bg-white rounded-xl border p-4 mb-6 shadow-sm'>
				<div className='flex flex-col md:flex-row gap-3'>
					<div className='relative flex-1'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
						<Input
							placeholder='Tìm kiếm theo tên, địa chỉ...'
							className='pl-9'
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
						/>
					</div>
					<Input
						placeholder='Giá từ (VNĐ)'
						type='number'
						className='md:w-36'
						value={minPrice}
						onChange={(e) => setMinPrice(e.target.value)}
					/>
					<Input
						placeholder='Giá đến (VNĐ)'
						type='number'
						className='md:w-36'
						value={maxPrice}
						onChange={(e) => setMaxPrice(e.target.value)}
					/>
					<Select
						value={sortBy}
						onValueChange={(value) => value && setSortBy(value)}>
						<SelectTrigger className='md:w-44'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='newest'>Mới nhất</SelectItem>
							<SelectItem value='price_asc'>Giá tăng dần</SelectItem>
							<SelectItem value='price_desc'>Giá giảm dần</SelectItem>
							<SelectItem value='rating'>Đánh giá cao</SelectItem>
						</SelectContent>
					</Select>
					<Button
						onClick={handleSearch}
						className='bg-blue-600 hover:bg-blue-700'>
						<Search className='w-4 h-4 mr-2' /> Tìm kiếm
					</Button>
				</div>
			</div>

			{/* Results */}
			<div className='flex items-center justify-between mb-4'>
				<p className='text-sm text-gray-500'>
					{isLoading ?
						'Đang tìm...'
					:	`Tìm thấy ${data?.meta.total || 0} phòng`}
				</p>
			</div>

			{/* Grid */}
			{isLoading ?
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className='rounded-xl border overflow-hidden'>
							<Skeleton className='h-48 w-full' />
							<div className='p-4 space-y-2'>
								<Skeleton className='h-4 w-3/4' />
								<Skeleton className='h-3 w-full' />
								<Skeleton className='h-5 w-1/2' />
							</div>
						</div>
					))}
				</div>
			: data?.data.length === 0 ?
				<div className='text-center py-20 text-gray-400'>
					<Search className='w-12 h-12 mx-auto mb-3 opacity-30' />
					<p className='text-lg'>Không tìm thấy phòng phù hợp</p>
					<p className='text-sm mt-1'>Thử thay đổi bộ lọc tìm kiếm</p>
				</div>
			:	<>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
						{data?.data.map((room) => (
							<RoomCard key={room.id} room={room} />
						))}
					</div>

					{/* Pagination */}
					{data && data?.meta.totalPages > 1 && (
						<div className='flex justify-center gap-2 mt-8'>
							<Button
								variant='outline'
								disabled={page === 1}
								onClick={() => setPage((prev) => prev - 1)}>
								Trước
							</Button>

							<span className='flex items-center px-4 text-sm to-gray-600'>
								Trang {page} / {data?.meta.totalPages}
							</span>

							<Button
								variant='outline'
								disabled={page === data?.meta.totalPages}
								onClick={() => setPage((prev) => prev + 1)}>
								Tiếp
							</Button>
						</div>
					)}
				</>
			}
		</div>
	);
};

export default RoomsPage;
