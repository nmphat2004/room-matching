'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/auth.store';
import { Home, LayoutDashboard, LogOut, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
	const { user, logout } = useAuthStore();
	const router = useRouter();

	const handleLogout = () => {
		logout();
		router.push('/login');
	};

	return (
		<header className='sticky top-0 z-50 w-full border-b bg-white shadow-sm'>
			<div className='container mx-auto flex h-16 items-center justify-between px-4'>
				{/* Logo */}
				<Link
					href='/'
					className='flex items-center gap-2 font-bold text-xl text-blue-600'>
					<Home className='w-6 h-6' />
					Room Matching
				</Link>

				{/* Nav */}
				<nav className='hidden md:flex items-center gap-6 text-sm'>
					<Link
						href='/rooms'
						className='text-gray-600 hover:text-blue-600 transition-colors'>
						Tìm phòng
					</Link>
					<Link
						href='/roooms?sortBy=rating'
						className='text-gray-600 hover:text-blue-600 transition-colors'>
						Đánh giá cao
					</Link>
				</nav>

				{/* Auth buttons */}
				<div className='flex items-center gap-3'>
					{user ?
						<>
							<Link href='/chat'>
								<Button variant='ghost' size='icon'>
									<MessageCircle className='w-5 h-5' />
								</Button>
							</Link>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Avatar className='w-9 h-9 cursor-pointer'>
										<AvatarImage src={user.avatarUrl} />
										<AvatarFallback className='bg-blue-100 text-blue-600'>
											{user.fullName?.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end' className='w-48'>
									<div className='px-3 py-2 border-b'>
										<p className='font-medium text-sm'>{user.fullName}</p>
										<p className='text-gray-500 text-xs'>{user.email}</p>
									</div>
									<DropdownMenuItem onClick={() => router.push('/dashboard')}>
										<LayoutDashboard className='w-4 h-4 mr-2' />
										Dashboard
									</DropdownMenuItem>
									<DropdownMenuItem onClick={handleLogout}>
										<LogOut className='w-4 h-4 mr-2' />
										Đăng xuất
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					:	<>
							<Link href='/login'>
								<Button variant='outline'>Đăng nhập</Button>
							</Link>
							<Link href='/register'>
								<Button className='bg-orange-500 hover:bg-orange-600'>
									Đăng tin miễn phí
								</Button>
							</Link>
						</>
					}
				</div>
			</div>
		</header>
	);
};

export default Header;
