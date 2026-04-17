/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useRef } from 'react';
import { Camera, Lock, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RoomCard from '@/components/room/room-card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMe, updateMe } from '@/lib/api/user.api';
import { uploadImage } from '@/lib/api/upload.api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

type Tab = 'personal' | 'security' | 'notifications' | 'saved';

const schema = z.object({
	fullName: z.string().min(2, 'Họ và tên ít nhất 2 kí tự'),
	role: z.enum(['RENTER', 'LANDLORD']),
	phone: z.string().min(10, 'Số điện thoại phải có 10 số'),
});

type FormData = z.infer<typeof schema>;

const ProfilePage = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const queryClient = useQueryClient();

	const [activeTab, setActiveTab] = useState<Tab>('personal');
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

	const [notifications, setNotifications] = useState({
		newMessage: true,
		savedListing: true,
		newReview: true,
		priceAlert: true,
		weeklyDigest: false,
		promotional: false,
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			fullName: '',
			role: 'RENTER',
			phone: '',
		},
	});

	const { data, isLoading: isLoadingUser } = useQuery({
		queryKey: ['me'],
		queryFn: getMe,
	});

	// Reset form khi data được load
	useEffect(() => {
		if (data) {
			reset({
				fullName: data.fullName || '',
				role: (data.role as 'RENTER' | 'LANDLORD') || 'RENTER',
				phone: data.phone || '',
			});
		}
	}, [data, reset]);

	const onSubmit = async (formData: FormData) => {
		setIsLoading(true);
		try {
			await updateMe(formData);
			queryClient.invalidateQueries({ queryKey: ['me'] });
			toast.success('Cập nhật thành công');
		} catch (error: any) {
			toast.error(error.response?.data?.message || 'Cập nhật thất bại');
		} finally {
			setIsLoading(false);
		}
	};

	const handleAvatarUpload = async (file: File) => {
		if (!file) return;

		// Validate file type
		if (!file.type.match(/^image\/(jpg|jpeg|png|webp)$/)) {
			toast.error('Chỉ hỗ trợ file ảnh (jpg, jpeg, png, webp)');
			return;
		}

		// Validate file size (5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error('Kích thước file không được vượt quá 5MB');
			return;
		}

		try {
			setIsUploadingAvatar(true);

			// Create preview
			const reader = new FileReader();
			reader.onload = (e) => {
				setPreviewAvatar(e.target?.result as string);
			};
			reader.readAsDataURL(file);

			// Upload to server
			const imageUrl = await uploadImage(file);

			// Update user with new avatar URL
			await updateMe({ avatarUrl: imageUrl });

			// Reset preview and refetch user data
			setPreviewAvatar(null);
			queryClient.invalidateQueries({ queryKey: ['me'] });
			toast.success('Cập nhật ảnh đại diện thành công');
		} catch (error: any) {
			setPreviewAvatar(null);
			toast.error(error.response?.data?.message || 'Cập nhật ảnh đại diện thất bại');
		} finally {
			setIsUploadingAvatar(false);
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleAvatarUpload(file);
		}
	};

	const handleAvatarButtonClick = () => {
		fileInputRef.current?.click();
	};

	const savedRooms = [
		{
			id: '1',
			title: 'Phòng trọ cao cấp gần ĐH Bách Khoa',
			address: 'Quận 10, TP. Hồ Chí Minh',
			price: 4500000,
			area: 25,
			avgRating: 4.5,
			reviewCount: 28,
			images: [
				{
					id: '1',
					url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
				},
			],
			amenities: ['wifi', 'ac', 'parking'] as const,
			status: 'AVAILABLE',
		},
		{
			id: '2',
			title: 'Studio hiện đại Quận 1',
			address: 'Quận 1, TP. Hồ Chí Minh',
			price: 6500000,
			area: 35,
			avgRating: 4.8,
			reviewCount: 42,
			images: [
				{
					id: '2',
					url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
				},
			],
			amenities: ['wifi', 'ac', 'elevator'] as const,
			featured: true,
		},
		{
			id: '3',
			title: 'Phòng đẹp giá rẻ gần chợ',
			address: 'Quận 5, TP. Hồ Chí Minh',
			price: 3200000,
			area: 20,
			avgRating: 4.2,
			reviewCount: 18,
			images: [
				{
					id: '3',
					url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
				},
			],
			amenities: ['wifi', 'bathroom'] as const,
		},
	];

	const tabs = [
		{ id: 'personal' as Tab, label: 'Thông tin cá nhân' },
		{ id: 'security' as Tab, label: 'Bảo mật' },
		{ id: 'notifications' as Tab, label: 'Thông báo' },
		{ id: 'saved' as Tab, label: 'Phòng đã lưu' },
	];

	const handleUpdatePassword = () => {
		if (newPassword !== confirmNewPassword) {
			alert("Passwords don't match!");
			return;
		}
		console.log('Updating password...');
	};

	const handleSaveNotifications = () => {
		console.log('Saving notification preferences...', notifications);
	};

	return (
		<div className='min-h-screen bg-secondary'>
			<div className='max-w-6xl mx-auto px-6 py-8'>
				{/* Hidden File Upload Input */}
				<input
					type='file'
					ref={fileInputRef}
					accept='image/jpg,image/jpeg,image/png,image/webp'
					onChange={handleFileChange}
					className='hidden'
				/>

				{/* Tabs */}
				<div className='bg-white rounded-xl shadow-sm mb-6'>
					<div>
						{tabs.map((tab) => (
							<Button
								variant='default'
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`px-8 py-5 text-sm font-medium whitespace-nowrap transition-colors ${
									activeTab === tab.id ?
										' text-white'
									:	'border-transparent bg-white text-muted-foreground hover:text-secondary-foreground hover:bg-secondary'
								}`}>
								{tab.label}
							</Button>
						))}
					</div>

					<div className='p-6'>
						{/* Personal Information Tab */}
						{activeTab === 'personal' && (
							<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
								{/* Profile Section */}
								<div className='flex items-start gap-6 pb-6 border-b border-border'>
									<div className='relative'>
										<Avatar className='w-20 h-20 cursor-pointer'>
											<AvatarImage src={previewAvatar || data?.avatarUrl} />
											<AvatarFallback className='bg-primary/90 text-white text-xl'>
												{data?.fullName?.charAt(0).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<Button
											onClick={handleAvatarButtonClick}
											disabled={isUploadingAvatar}
											className='absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border-2 border-border flex items-center justify-center hover:bg-secondary disabled:opacity-50'>
											{isUploadingAvatar ?
												<Loader2 size={14} className='text-muted-foreground animate-spin' />
											:	<Camera size={14} className='text-muted-foreground' />
											}
										</Button>
									</div>
									<div>
										<h2 className='text-xl mb-1'>{data?.fullName}</h2>
										<div className='flex items-center gap-2 mb-2'>
											<Badge variant='outline' className='text-primary'>
												{data?.role === 'RENTER' ? 'Người thuê' : 'Chủ trọ'}
											</Badge>
											<span className='text-sm text-muted-foreground'>
												Thành viên từ{' '}
												{data?.createdAt &&
													new Date(data.createdAt).toLocaleDateString()}
											</span>
										</div>
										<Button
											variant='outline'
											className='text-sm text-primary'
											onClick={handleAvatarButtonClick}
											disabled={isUploadingAvatar}>
											{isUploadingAvatar ? 'Đang tải lên...' : 'Đổi ảnh đại diện'}
										</Button>
									</div>
								</div>

								{/* Information Form */}
								<div className='space-y-4'>
									<div>
										<label className='block text-sm font-medium mb-2'>
											Họ và tên
										</label>
										<Input
											type='text'
											{...register('fullName')}
											className='w-full h-11 px-3 bg-input-background border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-prtext-primary'
										/>
										{errors.fullName && (
											<p className='text-xs text-red-500 mt-1'>
												{errors.fullName.message}
											</p>
										)}
									</div>

									<div>
										<Label className='block text-sm font-medium mb-2'>
											Loại tài khoản
										</Label>
										<select
											{...register('role')}
											className='w-full h-11 px-3 bg-input-background border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-prtext-primary'>
											<option value='RENTER'>Người thuê</option>
											<option value='LANDLORD'>Chủ trọ</option>
										</select>
										{errors.role && (
											<p className='text-xs text-red-500 mt-1'>
												{errors.role.message}
											</p>
										)}
									</div>

									<div>
										<Label className='block text-sm font-medium mb-2'>
											Email
										</Label>
										<div className='relative'>
											<Input
												type='email'
												value={data?.email ?? ''}
												disabled
												className='w-full h-11 px-3 pr-8 bg-secondary border border-border rounded-lg text-muted-foreground cursor-not-allowed'
											/>
											<Lock
												className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'
												size={16}
											/>
										</div>
										<p className='text-xs text-red-500 mt-1'>
											Email không thể thay đổi
										</p>
									</div>

									<div>
										<label className='block text-sm font-medium mb-2'>
											Số điện thoại
										</label>
										<Input
											type='tel'
											{...register('phone')}
											className='w-full h-11 px-3 bg-input-background border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-prtext-primary'
										/>
										{errors.phone && (
											<p className='text-xs text-red-500 mt-1'>
												{errors.phone.message}
											</p>
										)}
									</div>

									<Button
										type='submit'
										className='w-full h-11 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center'
										disabled={isLoading || isLoadingUser}>
										{isLoading ?
											<>
												<Loader2 className='mr-2 animate-spin' size={18} /> Đang
												cập nhật
											</>
										:	'Cập nhật'}
									</Button>
								</div>
							</form>
						)}

						{/* Security Tab */}
						{activeTab === 'security' && (
							<div className='space-y-6'>
								{/* Change Password */}
								<div>
									<h3 className='text-lg font-medium mb-4'>Change Password</h3>
									<div className='space-y-4 max-w-md'>
										<div>
											<label className='block text-sm font-medium mb-2'>
												Current password
											</label>
											<input
												type='password'
												value={currentPassword}
												onChange={(e) => setCurrentPassword(e.target.value)}
												placeholder='••••••••'
												className='w-full h-11 px-3 bg-input-background border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-prtext-primary'
											/>
										</div>

										<div>
											<label className='block text-sm font-medium mb-2'>
												New password
											</label>
											<input
												type='password'
												value={newPassword}
												onChange={(e) => setNewPassword(e.target.value)}
												placeholder='••••••••'
												className='w-full h-11 px-3 bg-input-background border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-prtext-primary'
											/>
										</div>

										<div>
											<label className='block text-sm font-medium mb-2'>
												Confirm new password
											</label>
											<input
												type='password'
												value={confirmNewPassword}
												onChange={(e) => setConfirmNewPassword(e.target.value)}
												placeholder='••••••••'
												className='w-full h-11 px-3 bg-input-background border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-prtext-primary'
											/>
										</div>

										<Button
											onClick={handleUpdatePassword}
											className='bg-prtext-primary text-white px-6 h-10 rounded-lg hover:bg-prtext-primary/90'>
											Update Password
										</Button>
									</div>
								</div>

								{/* Danger Zone */}
								<div className='border-2 border-red-500 rounded-xl p-6 mt-8'>
									<h3 className='text-lg font-medium text-red-600 mb-4'>
										Danger Zone
									</h3>
									<div className='space-y-3'>
										<div className='flex items-start justify-between'>
											<div>
												<p className='font-medium'>Deactivate Account</p>
												<p className='text-sm text-muted-foreground'>
													Temporarily disable your account
												</p>
											</div>
											<Button className='px-4 h-9 border-2 border-red-500 text-red-600 rounded-lg bg-white hover:bg-red-50 text-sm'>
												Deactivate
											</Button>
										</div>
										<div className='flex items-start justify-between pt-3 border-t border-red-200'>
											<div>
												<p className='font-medium'>Delete Account</p>
												<p className='text-sm text-red-600'>
													This action cannot be undone
												</p>
											</div>
											<Button className='px-4 h-9 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm'>
												Delete
											</Button>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Notifications Tab */}
						{activeTab === 'notifications' && (
							<div className='space-y-6'>
								<h3 className='text-lg font-medium mb-4'>
									Notification Preferences
								</h3>
								<div className='space-y-4'>
									{[
										{
											key: 'newMessage',
											label: 'New message received',
											desc: 'Get notified when someone sends you a message',
										},
										{
											key: 'savedListing',
											label: 'Someone saved my listing',
											desc: 'Know when your room gets saved by potential tenants',
										},
										{
											key: 'newReview',
											label: 'New review on my room',
											desc: 'Be alerted when someone reviews your listing',
										},
										{
											key: 'priceAlert',
											label: 'Price drop alerts for saved rooms',
											desc: 'Get notified about price changes on saved rooms',
										},
										{
											key: 'weeklyDigest',
											label: 'Rental market weekly digest',
											desc: 'Weekly summary of market trends and new listings',
										},
										{
											key: 'promotional',
											label: 'Promotional emails',
											desc: 'Receive special offers and promotional content',
										},
									].map((item) => (
										<div
											key={item.key}
											className='flex items-start justify-between py-4 border-b border-border last:border-0'>
											<div className='flex-1'>
												<p className='font-medium mb-1'>{item.label}</p>
												<p className='text-sm text-muted-foreground'>
													{item.desc}
												</p>
											</div>
											<label className='relative inline-flex items-center cursor-pointer ml-4'>
												<input
													type='checkbox'
													checked={
														notifications[
															item.key as keyof typeof notifications
														]
													}
													onChange={(e) =>
														setNotifications({
															...notifications,
															[item.key]: e.target.checked,
														})
													}
													className='sr-only peer'
												/>
												<div className="w-11 h-6 bg-[#cbced4] rounded-full peer peer-checked:bg-prtext-primary peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
											</label>
										</div>
									))}
								</div>

								<div className='flex justify-end pt-4'>
									<Button
										onClick={handleSaveNotifications}
										className='bg-prtext-primary text-white px-6 h-10 rounded-lg hover:bg-prtext-primary/90'>
										Save Preferences
									</Button>
								</div>
							</div>
						)}

						{/* Saved Rooms Tab */}
						{activeTab === 'saved' && (
							<div>
								{savedRooms.length > 0 ?
									<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
										{savedRooms.map((room) => (
											<div key={room.id} className='relative'>
												<Button className='absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform'>
													<Heart
														className='text-red-500 fill-red-500'
														size={18}
													/>
												</Button>
												<RoomCard room={room} />
											</div>
										))}
									</div>
								:	<div className='text-center py-16'>
										<Heart
											className='mx-auto mb-4 text-borborder-border'
											size={64}
										/>
										<h3 className='text-xl mb-2'>No saved rooms yet</h3>
										<p className='text-muted-foreground mb-6'>
											Start exploring to save your favorite rooms
										</p>
										<Button className='bg-prtext-primary text-white px-6 h-10 rounded-lg hover:bg-prtext-primary/90'>
											Start exploring
										</Button>
									</div>
								}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
