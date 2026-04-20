'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Personal from '@/components/profiles/personal';
import Security from '@/components/profiles/security';
import Notification from '@/components/profiles/notification';
import SavedRooms from '@/components/profiles/saved-rooms';
import { useSearchParams } from 'next/navigation';

type Tab = 'personal' | 'security' | 'notifications' | 'saved';

const ProfilePage = () => {
	const searchParams = useSearchParams();
	const defaultTab = (searchParams.get('tab') as Tab) || 'personal';
	const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

	const tabs = [
		{ id: 'personal' as Tab, label: 'Thông tin cá nhân' },
		{ id: 'security' as Tab, label: 'Bảo mật' },
		{ id: 'notifications' as Tab, label: 'Thông báo' },
		{ id: 'saved' as Tab, label: 'Phòng đã lưu' },
	];

	return (
		<div className='min-h-screen bg-secondary'>
			<div className='max-w-6xl mx-auto px-6 py-8'>
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
						{activeTab === 'personal' && <Personal />}

						{/* Security Tab */}
						{activeTab === 'security' && <Security />}

						{/* Notifications Tab */}
						{activeTab === 'notifications' && <Notification />}

						{/* Saved Rooms Tab */}
						{activeTab === 'saved' && <SavedRooms />}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
