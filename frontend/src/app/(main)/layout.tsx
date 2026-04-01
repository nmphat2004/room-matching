import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import { PropsWithChildren } from 'react';

const MainLayout = ({ children }: PropsWithChildren) => {
	return (
		<div className='min-h-screen flex flex-col'>
			<Header />
			<main className='flex-1'>{children}</main>
			<Footer />
		</div>
	);
};

export default MainLayout;
