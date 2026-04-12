import { useState } from 'react';
import { Camera, Lock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RoomCard from '@/components/room/room-card';

type Tab = 'personal' | 'security' | 'notifications' | 'saved';

export function ProfileSettingsPage() {
	const [activeTab, setActiveTab] = useState<Tab>('personal');
	const [fullName, setFullName] = useState('Nguyen Van Hung');
	const [phone, setPhone] = useState('912345678');
	const [bio, setBio] = useState('');
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');

	const [notifications, setNotifications] = useState({
		newMessage: true,
		savedListing: true,
		newReview: true,
		priceAlert: true,
		weeklyDigest: false,
		promotional: false,
	});

	const savedRooms = [
		{
			id: '1',
			image:
				'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
			title: 'Phòng trọ Quận 1 full nội thất',
			price: 3500000,
			rating: 4.8,
			reviewCount: 24,
			address: 'Quận 1, TP. HCM',
			area: 25,
			status: 'available' as const,
			amenities: ['wifi' as const, 'ac' as const, 'parking' as const],
		},
		{
			id: '2',
			image:
				'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
			title: 'Studio mini gần ĐH Khoa học Tự nhiên',
			price: 4200000,
			rating: 4.6,
			reviewCount: 18,
			address: 'Quận 3, TP. HCM',
			area: 30,
			status: 'available' as const,
			amenities: ['wifi' as const, 'kitchen' as const],
		},
	];

	const tabs = [
		{ id: 'personal' as Tab, label: 'Personal Information' },
		{ id: 'security' as Tab, label: 'Security' },
		{ id: 'notifications' as Tab, label: 'Notifications' },
		{ id: 'saved' as Tab, label: 'Saved Rooms' },
	];

	const handleSaveProfile = () => {
		console.log('Saving profile...', { fullName, phone, bio });
	};

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
			{/* Simplified header for this standalone page */}
			<div className='bg-white border-b border-border'>
				<div className='max-w-6xl mx-auto px-6 py-4'>
					<h1 className='text-2xl font-semibold'>Profile & Settings</h1>
				</div>
			</div>

			<div className='max-w-6xl mx-auto px-6 py-8'>
				{/* Tabs */}
				<div className='bg-white rounded-xl shadow-sm mb-6'>
					<div className='border-b border-border flex overflow-x-auto'>
						{tabs.map((tab) => (
							<Button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
									activeTab === tab.id ?
										'border-primary text-primary'
									:	'border-transparent text-muted-foreground hover:text-secondary-foreground'
								}`}>
								{tab.label}
							</Button>
						))}
					</div>

					<div className='p-6'>
						{/* Personal Information Tab */}
						{activeTab === 'personal' && (
							<div className='space-y-6'>
								{/* Profile Section */}
								<div className='flex items-start gap-6 pb-6 border-b border-border'>
									<div className='relative'>
										<div className='w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-semibold'>
											NH
										</div>
										<Button className='absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border-2 border-border flex items-center justify-center hover:bg-secondary'>
											<Camera size={14} className='text-muted-foreground' />
										</Button>
									</div>
									<div>
										<h2 className='text-xl mb-1'>Nguyen Van Hung</h2>
										<div className='flex items-center gap-2 mb-2'>
											<Badge variant='default'>Tenant</Badge>
											<span className='text-sm text-muted-foreground'>
												Member since Jan 2024
											</span>
										</div>
										<Button className='text-sm text-primary hover:underline'>
											Change Avatar
										</Button>
									</div>
								</div>

								{/* Information Form */}
								<div className='space-y-4'>
									<div>
										<label className='block text-sm font-medium mb-2'>
											Full name
										</label>
										<input
											type='text'
											value={fullName}
											onChange={(e) => setFullName(e.target.value)}
											className='w-full h-11 px-3 bg-input-background border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-prtext-primary'
										/>
									</div>

									<div>
										<label className='block text-sm font-medium mb-2'>
											Email
										</label>
										<div className='relative'>
											<input
												type='email'
												value='hung.nguyen@email.com'
												disabled
												className='w-full h-11 px-3 pr-8 bg-borborder-border border border-transparent rounded-lg text-muted-foreground cursor-not-allowed'
											/>
											<Lock
												className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'
												size={16}
											/>
										</div>
										<p className='text-xs text-muted-foreground mt-1'>
											Email cannot be changed
										</p>
									</div>

									<div>
										<label className='block text-sm font-medium mb-2'>
											Phone number
										</label>
										<div className='flex gap-2'>
											<div className='w-16 h-11 bg-input-background rounded-lg flex items-center justify-center text-sm'>
												+84
											</div>
											<input
												type='tel'
												value={phone}
												onChange={(e) => setPhone(e.target.value)}
												className='flex-1 h-11 px-3 bg-input-background border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-prtext-primary'
											/>
										</div>
									</div>

									<div>
										<label className='block text-sm font-medium mb-2'>
											Bio / About
										</label>
										<textarea
											value={bio}
											onChange={(e) => setBio(e.target.value)}
											placeholder='Tell others about yourself...'
											rows={4}
											className='w-full px-3 py-2 bg-input-background border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-prtext-primary resize-none'
										/>
									</div>

									<div className='flex justify-end'>
										<Button
											onClick={handleSaveProfile}
											className='bg-prtext-primary text-white px-6 h-10 rounded-lg hover:bg-prtext-primary/90'>
											Save Changes
										</Button>
									</div>
								</div>
							</div>
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
											<Button className='px-4 h-9 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 text-sm'>
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
												<RoomCard {...room} />
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
}
