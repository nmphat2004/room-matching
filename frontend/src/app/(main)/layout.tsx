'use client';
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter, usePathname } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';

const MainLayout = ({ children }: PropsWithChildren) => {
	const pathname = usePathname();
	const router = useRouter();
	const { user } = useAuthStore();
	const isChatPage = pathname === '/chat';

	useEffect(() => {
		if (user?.role === 'ADMIN') {
			router.replace('/admin/dashboard');
		}
	}, [user, router]);

	// Trả về null nếu là Admin để không render các thành phần giao diện người dùng
	if (user?.role === 'ADMIN') return null;

	return (
		<div className='min-h-screen flex flex-col'>
			<Header />
			<main className='flex-1'>{children}</main>
			{!isChatPage && <Footer />}
		</div>
	);
};

export default MainLayout;
