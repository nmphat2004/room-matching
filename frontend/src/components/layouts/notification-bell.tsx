'use client';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotificationStore } from '@/stores/notification.store';

export default function NotificationBell() {
	const { notificationUnreadCount } = useNotificationStore();

	return (
		<Link href='/profile?tab=notifications'>
			<Button variant='ghost' size='icon' className='relative'>
				<Bell className='w-5 h-5' />
				{notificationUnreadCount > 0 && (
					<span className='absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center'>
						{notificationUnreadCount > 9 ? '9+' : notificationUnreadCount}
					</span>
				)}
			</Button>
		</Link>
	);
}
