'use client';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Home, Star, LogOut } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const { user, isLoading, logout } = useAuthStore();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (!isLoading) {
			if (!user) {
				router.push('/login');
			} else if (user.role !== 'ADMIN') {
				router.push('/');
			}
		}
	}, [user, isLoading, router]);

	if (isLoading || !user || user.role !== 'ADMIN') {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50'>
				<Skeleton className='w-48 h-12' />
			</div>
		);
	}

	const navItems = [
		{ label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
		{ label: 'Users', href: '/admin/users', icon: Users },
		{ label: 'Rooms', href: '/admin/rooms', icon: Home },
		{ label: 'Reviews', href: '/admin/reviews', icon: Star },
	];

	return (
		<div className='min-h-screen flex bg-gray-50'>
			{/* Sidebar */}
			<div className='w-64 bg-white border-r border-border flex flex-col fixed h-full'>
				<div className='p-6 py-8 flex items-center justify-center border-b border-border'>
					<h1 className='text-2xl font-bold text-primary'>Admin Panel</h1>
				</div>
				<div className='flex-1 py-6 flex flex-col gap-2 px-4'>
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						const Icon = item.icon;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
								<Icon className='w-5 h-5' />
								<span className='font-medium'>{item.label}</span>
							</Link>
						);
					})}
				</div>
				<div className='p-4 border-t border-border'>
					<button
						onClick={() => {
							logout();
							router.push('/login');
						}}
						className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium'>
						<LogOut className='w-5 h-5' />
						Log out
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className='flex-1 ml-64 p-8 overflow-auto'>
				{children}
			</div>
		</div>
	);
}
