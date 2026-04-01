import { Home } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
	return (
		<footer className='border-t bg-gray-50 py-10'>
			<div className='container mx-auto px-4'>
				<div className='flex flex-col md:flex-row justify-between gap-8'>
					<div>
						<div className='flex items-center gap-2 font-bold text-lg text-blue-600'>
							<Home className='w-5 h-5' /> Room Matching
						</div>
						<p className='text-sm text-gray-500 max-w-xs'>
							Nền tảng tìm kiếm và đánh giá phòng trọ minh bạch tại Việt Nam
						</p>
					</div>
					<div className='flex gap-12 text-gray-600 text-sm'>
						<div className='flex flex-col gap-2'>
							<p className='font-medium text-gray-800'>Khám phá</p>
							<Link href='#' className='hover:text-blue-600'>
								Liên hệ
							</Link>
							<Link href='#' className='hover:text-blue-600'>
								Điều khoản
							</Link>
						</div>
					</div>
				</div>
				<div className='mt-8 pt-6 border-t text-center text-xs text-gray-400'>
					© 2026 Room Matching. All rights reserved.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
