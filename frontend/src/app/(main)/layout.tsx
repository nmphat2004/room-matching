'use client';
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

const MainLayout = ({ children }: PropsWithChildren) => {
	const pathname = usePathname();
	const isChatPage = pathname === '/chat';

	return (
		<div className='min-h-screen flex flex-col'>
			<Header />
			<main className='flex-1'>{children}</main>
			{!isChatPage && <Footer />}
		</div>
	);
};

export default MainLayout;
