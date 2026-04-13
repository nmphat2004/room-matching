'use client';
import FilterChip from '@/components/room/filter-chip';
import RoomCard from '@/components/room/room-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { getRooms } from '@/lib/api/room.api';
import { useQuery } from '@tanstack/react-query';
import { Grid, List, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const RoomsPage = () => {
	const searchParams = useSearchParams();

	const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
	const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
	const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
	const [minArea, setMinArea] = useState(searchParams.get('minArea') || 0);
	const [maxArea, setMaxArea] = useState(searchParams.get('maxArea') || 100);
	const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
	const [selectedDistrict, setSelectedDistrict] = useState('all');
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
	const [minRating, setMinRating] = useState(searchParams.get('rating') || '');
	const [layout, setLayout] = useState<'grid' | 'list'>('list');
	const [page, setPage] = useState(1);

	const districts = [
		'Quận 1',
		'Quận 3',
		'Quận 5',
		'Quận 7',
		'Quận 10',
		'Bình Thạnh',
		'Phú Nhuận',
		'Tân Bình',
	];

	const areaRanges = [
		{ label: 'Dưới 20m²', min: 0, max: 20 },
		{ label: '20-30m²', min: 20, max: 30 },
		{ label: '30-50m²', min: 30, max: 50 },
		{ label: 'Trên 50m²', min: 50, max: 1000 },
	];

	const amenitiesList = [
		{ value: 'wifi', name: 'WiFi' },
		{ value: 'ac', name: 'Điều hòa' },
		{ value: 'parking', name: 'Giữ xe' },
		{ value: 'elevator', name: 'Thang máy' },
		{ value: 'bathroom', name: 'WC riêng' },
		{ value: 'kitchen', name: 'Bếp' },
		{ value: 'security', name: 'An ninh' },
		{ value: 'washing', name: 'Máy giặt' },
	];

	const { data, isLoading } = useQuery({
		queryKey: [
			'rooms',
			keyword,
			minPrice,
			maxPrice,
			sortBy,
			selectedDistrict,
			selectedAmenities,
			minRating,
			minArea,
			maxArea,
			page,
		],
		queryFn: () =>
			getRooms({
				keyword: keyword || undefined,
				minPrice: minPrice ? Number(minPrice) : undefined,
				maxPrice: maxPrice ? Number(maxPrice) : undefined,
				minRating: minRating ? Number(minRating) : undefined,
				selectedDistrict: selectedDistrict || undefined,
				selectedAmenities,
				minArea: minArea ? Number(minArea) : undefined,
				maxArea: maxArea ? Number(maxArea) : undefined,
				sortBy,
				page,
				limit: 12,
			}),
	});

	const toggleAmenity = (amenity: string) => {
		setSelectedAmenities((prev) =>
			prev.includes(amenity) ?
				prev.filter((a) => a !== amenity)
			:	[...prev, amenity],
		);
	};

	const handleReset = () => {
		setKeyword('');
		setMinPrice('');
		setMaxPrice('');
		setMinArea(0);
		setMaxArea(100);
		setSelectedDistrict('all');
		setSelectedAmenities([]);
		setMinRating('');
		setPage(1); // Nên reset cả trang về 1
	};

	return (
		<div className='bg-background min-h-screen'>
			<div className='max-w-7xl mx-auto px-4 py-6'>
				<div className='flex gap-6'>
					{/* Left Sidebar - Filters */}
					<div className='w-72 shrink-0'>
						<div className='sticky top-24 bg-card border border-border rounded-xl p-6'>
							<div className='flex items-center justify-between mb-6'>
								<h3>Bộ lọc</h3>
								<Button
									onClick={handleReset}
									variant='default'
									className='text-sm text-white hover:underline'>
									Đặt lại
								</Button>
							</div>

							{/* Price Range */}
							<div className='mb-6'>
								<Label className='block mb-3'>Khoảng giá (đ/tháng)</Label>
								<div className='space-y-3'>
									<Input
										type='number'
										placeholder='Từ'
										value={minPrice}
										onChange={(e) => setMinPrice(e.target.value)}
										className='border-border'
									/>
									<Input
										type='number'
										placeholder='Đến'
										value={maxPrice}
										onChange={(e) => setMaxPrice(e.target.value)}
										className='border-border'
									/>
								</div>
							</div>

							{/* Area */}
							<div className='mb-6'>
								<Label className='block mb-3'>Diện tích</Label>
								<div className='space-y-2'>
									{areaRanges.map((range) => (
										<Label
											key={range.label}
											className='flex items-center gap-2 cursor-pointer'>
											<input
												type='checkbox'
												className='w-4 h-4 rounded border-border'
												checked={minArea === range.min && maxArea === range.max}
												onChange={() => {
													if (minArea === range.min && maxArea === range.max) {
														// Nếu đang chọn rồi mà click lại thì bỏ lọc
														setMinArea(0);
														setMaxArea(100);
													} else {
														setMinArea(range.min);
														setMaxArea(range.max);
													}
												}}
											/>
											<span className='text-sm'>{range.label}</span>
										</Label>
									))}
								</div>
							</div>

							{/* District */}
							<div className='mb-6'>
								<label className='block mb-3'>Quận/Huyện</label>
								<select
									value={selectedDistrict}
									onChange={(e) => setSelectedDistrict(e.target.value)}
									className='w-full px-4 py-2.5 rounded-lg border border-border bg-input-background'>
									<option value='all'>Tất cả</option>
									{districts.map((district) => (
										<option key={district} value={district}>
											{district}
										</option>
									))}
								</select>
							</div>

							{/* Amenities */}
							<div className='mb-6'>
								<Label className='block mb-3'>Tiện nghi</Label>
								<div className='grid grid-cols-2 gap-2'>
									{amenitiesList.map((amenity) => (
										<Label
											key={amenity.value}
											className='flex items-center gap-2 cursor-pointer'>
											<Input
												type='checkbox'
												className='w-4 h-4 rounded border-border'
												checked={selectedAmenities.includes(amenity.value)}
												onChange={() => toggleAmenity(amenity.value)}
											/>
											<span className='text-sm'>{amenity.name}</span>
										</Label>
									))}
								</div>
							</div>

							{/* Minimum Rating */}
							<div className='mb-6'>
								<Label className='block mb-3'>Đánh giá tối thiểu</Label>
								<div className='space-y-2'>
									{[5, 4, 3, 2, 1].map((rating) => (
										<Label
											key={rating}
											className='flex items-center gap-2 cursor-pointer'>
											<Input
												value={minRating}
												onChange={(e) => setMinRating(e.target.value)}
												type='radio'
												name='rating'
												className='w-4 h-4'
											/>
											<span className='text-sm'>{rating}+ sao</span>
										</Label>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className='flex-1'>
						{/* Top bar */}
						<div className='flex items-center justify-between mb-6'>
							<div>
								<h2 className='mb-1'>
									{!isLoading &&
										selectedDistrict !== 'all' &&
										`${data?.data.length} phòng tìm thấy tại ${selectedDistrict}`}
								</h2>
								<div className='flex items-center gap-2 flex-wrap'>
									{selectedAmenities.map((amenity) => (
										<FilterChip
											key={amenity}
											label={
												amenitiesList.find((a) => a.value === amenity)?.name ||
												amenity
											}
											active
											onRemove={() => toggleAmenity(amenity)}
										/>
									))}
								</div>
							</div>

							<div className='flex items-center gap-3'>
								<select
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
									className='px-4 py-2 rounded-lg border border-border bg-background'>
									<option value='newest'>Mới nhất</option>
									<option value='price_asc'>Giá: Thấp đến cao</option>
									<option value='price_desc'>Giá: Cao đến thấp</option>
									<option value='rating'>Đánh giá cao nhất</option>
								</select>

								<div className='flex items-center gap-1 border border-border rounded-lg p-1'>
									<Button
										variant='ghost'
										onClick={() => setLayout('list')}
										className={`p-2 rounded ${layout === 'list' ? 'bg-primary text-white' : 'text-muted-foreground'}`}>
										<List className='w-4 h-4' />
									</Button>
									<Button
										variant='ghost'
										onClick={() => setLayout('grid')}
										className={`p-2 rounded ${layout === 'grid' ? 'bg-primary text-white' : 'text-muted-foreground'}`}>
										<Grid className='w-4 h-4' />
									</Button>
								</div>
							</div>
						</div>

						{/* Room list */}
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
						:	<div
								className={
									layout === 'grid' ?
										'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
									:	'space-y-4'
								}>
								{data?.data.map((room) => (
									<RoomCard room={room} key={room.id} layout={layout} />
								))}
							</div>
						}

						{/* Pagination */}
						{data && data?.meta.totalPage > 1 && (
							<div className='flex justify-center gap-2 mt-8'>
								<Button
									variant='outline'
									disabled={page === 1}
									onClick={() => setPage((prev) => prev - 1)}>
									Trước
								</Button>
								<span className='flex items-center px-4 text-sm text-gray-600'>
									Trang {page} / {data?.meta.totalPage}
								</span>
								<Button
									variant='outline'
									disabled={page === data?.meta.totalPage}
									onClick={() => setPage((prev) => prev + 1)}>
									Tiếp
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RoomsPage;
