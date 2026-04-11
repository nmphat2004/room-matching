'use client';
import { useState } from 'react';
import {
	ListPlus,
	MessageSquare,
	BarChart3,
	Settings,
	Eye,
	Star,
	Edit,
	EyeOff,
	Trash2,
	RefreshCw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function DashboardPage() {
	const [activeTab, setActiveTab] = useState('listings');
	const [filterStatus, setFilterStatus] = useState('all');

	const stats = [
		{ label: 'Tin đăng', value: '12', icon: ListPlus, color: 'text-blue-600' },
		{
			label: 'Lượt xem hôm nay',
			value: '234',
			icon: Eye,
			color: 'text-green-600',
		},
		{
			label: 'Tin nhắn chưa đọc',
			value: '8',
			icon: MessageSquare,
			color: 'text-orange-600',
		},
		{ label: 'Đánh giá mới', value: '3', icon: Star, color: 'text-amber-600' },
	];

	const listings = [
		{
			id: '1',
			title: 'Phòng trọ cao cấp gần ĐH Bách Khoa',
			status: 'active',
			views: 342,
			contacts: 28,
			rating: 4.5,
			postedDate: '15/02/2026',
			image:
				'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200',
		},
		{
			id: '2',
			title: 'Studio hiện đại Quận 1',
			status: 'active',
			views: 567,
			contacts: 45,
			rating: 4.8,
			postedDate: '10/02/2026',
			image:
				'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200',
		},
		{
			id: '3',
			title: 'Phòng đẹp giá rẻ gần chợ',
			status: 'expired',
			views: 189,
			contacts: 12,
			rating: 4.2,
			postedDate: '01/01/2026',
			image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200',
		},
		{
			id: '4',
			title: 'Căn hộ mini đầy đủ tiện nghi',
			status: 'hidden',
			views: 423,
			contacts: 34,
			rating: 4.6,
			postedDate: '05/02/2026',
			image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200',
		},
	];

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'active':
				return <Badge>Đang hiển thị</Badge>;
			case 'expired':
				return <Badge>Hết hạn</Badge>;
			case 'hidden':
				return <Badge variant='default'>Đã ẩn</Badge>;
			default:
				return <Badge variant='default'>Chờ duyệt</Badge>;
		}
	};

	const filteredListings = listings.filter((listing) =>
		filterStatus === 'all' ? true : listing.status === filterStatus,
	);

	return (
		<div className='bg-background min-h-screen'>
			<div className='max-w-7xl mx-auto px-4 py-6'>
				<div className='flex gap-6'>
					{/* Left Sidebar */}
					<div className='w-64 shrink-0'>
						<div className='sticky top-24 bg-card border border-border rounded-xl p-6'>
							<div className='flex flex-col items-center mb-6'>
								<Avatar />
								<p className='mt-3'>Nguyễn Văn An</p>
							</div>

							<nav className='space-y-2'>
								<button
									onClick={() => setActiveTab('listings')}
									className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
										activeTab === 'listings' ?
											'bg-primary text-white'
										:	'text-foreground hover:bg-secondary'
									}`}>
									<ListPlus className='w-5 h-5' />
									<span>Tin đăng</span>
								</button>

								<Link
									href='/messages'
									className='w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-foreground hover:bg-secondary transition-colors'>
									<MessageSquare className='w-5 h-5' />
									<span>Tin nhắn</span>
								</Link>

								<button
									onClick={() => setActiveTab('analytics')}
									className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
										activeTab === 'analytics' ?
											'bg-primary text-white'
										:	'text-foreground hover:bg-secondary'
									}`}>
									<BarChart3 className='w-5 h-5' />
									<span>Thống kê</span>
								</button>

								<button
									onClick={() => setActiveTab('settings')}
									className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
										activeTab === 'settings' ?
											'bg-primary text-white'
										:	'text-foreground hover:bg-secondary'
									}`}>
									<Settings className='w-5 h-5' />
									<span>Cài đặt</span>
								</button>
							</nav>

							<div className='mt-6 p-4 bg-linear-to-br from-primary/10 to-accent/10 rounded-lg'>
								<p className='text-sm mb-2'>Nâng cấp tài khoản</p>
								<p className='text-xs text-muted-foreground mb-3'>
									Tăng độ ưu tiên tin đăng
								</p>
								<Button variant='default' className='w-full text-sm py-2'>
									Nâng cấp
								</Button>
							</div>
						</div>
					</div>

					{/* Main Content */}
					<div className='flex-1'>
						{activeTab === 'listings' && (
							<>
								{/* Stats Row */}
								<div className='grid grid-cols-4 gap-4 mb-6'>
									{stats.map((stat) => (
										<div
											key={stat.label}
											className='bg-card border border-border rounded-xl p-6'>
											<div className='flex items-center justify-between mb-2'>
												<stat.icon className={`w-6 h-6 ${stat.color}`} />
												<span className='text-2xl'>{stat.value}</span>
											</div>
											<p className='text-sm text-muted-foreground'>
												{stat.label}
											</p>
										</div>
									))}
								</div>

								{/* Listings Table */}
								<div className='bg-card border border-border rounded-xl'>
									<div className='p-6 border-b border-border'>
										<div className='flex items-center justify-between'>
											<h2>Tin đăng của tôi</h2>
											<Link href='/post-listing'>
												<Button
													variant='default'
													className='bg-accent hover:bg-accent/90'>
													<ListPlus className='w-4 h-4 mr-2' />
													Đăng tin mới
												</Button>
											</Link>
										</div>

										<div className='flex items-center gap-2 mt-4'>
											{['all', 'active', 'expired', 'hidden'].map((status) => (
												<button
													key={status}
													onClick={() => setFilterStatus(status)}
													className={`px-4 py-2 rounded-lg transition-colors ${
														filterStatus === status ?
															'bg-primary text-white'
														:	'bg-secondary text-foreground hover:bg-secondary/80'
													}`}>
													{status === 'all' && 'Tất cả'}
													{status === 'active' && 'Đang hiển thị'}
													{status === 'expired' && 'Hết hạn'}
													{status === 'hidden' && 'Đã ẩn'}
												</button>
											))}
										</div>
									</div>

									<div className='overflow-x-auto'>
										<table className='w-full'>
											<thead className='bg-secondary'>
												<tr>
													<th className='px-6 py-3 text-left text-sm'>
														Tin đăng
													</th>
													<th className='px-6 py-3 text-left text-sm'>
														Trạng thái
													</th>
													<th className='px-6 py-3 text-center text-sm'>
														Lượt xem
													</th>
													<th className='px-6 py-3 text-center text-sm'>
														Liên hệ
													</th>
													<th className='px-6 py-3 text-center text-sm'>
														Đánh giá
													</th>
													<th className='px-6 py-3 text-center text-sm'>
														Ngày đăng
													</th>
													<th className='px-6 py-3 text-right text-sm'>
														Thao tác
													</th>
												</tr>
											</thead>
											<tbody>
												{filteredListings.map((listing) => (
													<tr
														key={listing.id}
														className='border-b border-border last:border-0'>
														<td className='px-6 py-4'>
															<div className='flex items-center gap-3'>
																<Image
																	src={listing.image}
																	alt={listing.title}
																	className='w-16 h-16 rounded-lg object-cover'
																/>
																<div>
																	<Link
																		href={`/room/${listing.id}`}
																		className='hover:text-primary'>
																		{listing.title}
																	</Link>
																</div>
															</div>
														</td>
														<td className='px-6 py-4'>
															{getStatusBadge(listing.status)}
														</td>
														<td className='px-6 py-4 text-center'>
															{listing.views}
														</td>
														<td className='px-6 py-4 text-center'>
															{listing.contacts}
														</td>
														<td className='px-6 py-4 text-center'>
															<div className='flex items-center justify-center gap-1'>
																<Star className='w-4 h-4 fill-amber-400 text-amber-400' />
																<span>{listing.rating}</span>
															</div>
														</td>
														<td className='px-6 py-4 text-center text-sm text-muted-foreground'>
															{listing.postedDate}
														</td>
														<td className='px-6 py-4'>
															<div className='flex items-center justify-end gap-2'>
																<button
																	className='p-2 hover:bg-secondary rounded-lg transition-colors'
																	title='Chỉnh sửa'>
																	<Edit className='w-4 h-4' />
																</button>
																<button
																	className='p-2 hover:bg-secondary rounded-lg transition-colors'
																	title={
																		listing.status === 'hidden' ? 'Hiện' : 'Ẩn'
																	}>
																	{listing.status === 'hidden' ?
																		<Eye className='w-4 h-4' />
																	:	<EyeOff className='w-4 h-4' />}
																</button>
																<button
																	className='p-2 hover:bg-secondary rounded-lg transition-colors'
																	title='Gia hạn'>
																	<RefreshCw className='w-4 h-4' />
																</button>
																<button
																	className='p-2 hover:bg-destructive/10 rounded-lg transition-colors'
																	title='Xóa'>
																	<Trash2 className='w-4 h-4 text-destructive' />
																</button>
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</>
						)}

						{activeTab === 'analytics' && (
							<div className='bg-card border border-border rounded-xl p-6'>
								<h2 className='mb-6'>Thống kê</h2>
								<div className='space-y-6'>
									<div>
										<h3 className='mb-4'>Lượt xem 30 ngày qua</h3>
										<div className='h-64 bg-secondary rounded-lg flex items-center justify-center'>
											<p className='text-muted-foreground'>Biểu đồ lượt xem</p>
										</div>
									</div>

									<div>
										<h3 className='mb-4'>Liên hệ theo tin đăng</h3>
										<div className='h-64 bg-secondary rounded-lg flex items-center justify-center'>
											<p className='text-muted-foreground'>Biểu đồ liên hệ</p>
										</div>
									</div>

									<div>
										<h3 className='mb-4'>Xu hướng đánh giá</h3>
										<div className='h-64 bg-secondary rounded-lg flex items-center justify-center'>
											<p className='text-muted-foreground'>Biểu đồ đánh giá</p>
										</div>
									</div>
								</div>
							</div>
						)}

						{activeTab === 'settings' && (
							<div className='bg-card border border-border rounded-xl p-6'>
								<h2 className='mb-6'>Cài đặt tài khoản</h2>
								<div className='space-y-4'>
									<p className='text-muted-foreground'>
										Tính năng cài đặt đang được phát triển...
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
