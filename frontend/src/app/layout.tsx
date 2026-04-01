import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PropsWithChildren } from 'react';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Room Matching - Tìm phòng trọ uy tín',
	description: 'Nền tảng tìm kiếm và đánh giá phòng trọ minh bạch tại Việt Nam',
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang='vi'>
			<body className={inter.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
