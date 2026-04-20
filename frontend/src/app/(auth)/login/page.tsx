/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/api/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import { Eye, EyeOff, Home, Loader2, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
	email: z.string().email('Email không hợp lệ'),
	password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
});

type FormData = z.infer<typeof schema>;

const LoginPage = () => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const { user, setAuth, isLoading: isAuthLoading } = useAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	const onSubmit = async (data: FormData) => {
		setIsLoading(true);
		try {
			const res = await login(data);
			setAuth(res.user, res.accessToken, res.refreshToken);
			toast.success(`Xin chào, ${res.user.fullName}!`);
			router.push('/');
		} catch (error: any) {
			toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (user) router.push('/');
	}, [user, router]);

	if (isAuthLoading || user) return null;

	return (
		<div className='min-h-screen flex items-center justify-center bg-primary-foreground p-4'>
			<Card className='w-full max-w-[440px] bg-white rounded-2xl shadow-lg p-8'>
				<CardHeader className='text-center mb-5'>
					<div className='flex items-center justify-center gap-2 font-semibold text-primary text-2xl '>
						<Home className='w-8 h-8 text-primary text-xl rounded-lg flex items-center justify-center' />{' '}
						Room Matching
					</div>
					<CardTitle className='text-xl mb-2'>Đăng nhập</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						<div>
							<Label className='block text-sm font-medium mb-2'>Email</Label>
							<div className='relative'>
								<Mail
									className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
									size={18}
								/>
								<Input
									type='email'
									placeholder='your@email.com'
									{...register('email')}
									className='w-full h-11 pl-10 pr-3 bg-input-foreground border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all'
								/>
							</div>
							{errors.email && (
								<p className='text-xs text-red-500 mt-2'>
									{errors.email.message}
								</p>
							)}
						</div>

						<div>
							<Label className='block text-sm font-medium mb-2'>Mật khẩu</Label>
							<div className='relative'>
								<Lock
									className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
									size={18}
								/>
								<Input
									type={showPassword ? 'text' : 'password'}
									placeholder='*******'
									{...register('password')}
									className='w-full h-11 pl-10 pr-3 bg-input-foreground border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all'
								/>

								<Button
									type='button'
									variant='ghost'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'>
									{showPassword ?
										<EyeOff size={18} />
									:	<Eye size={18} />}
								</Button>
							</div>
							{errors.password && (
								<p className='text-xs text-red-500 mt-2'>
									{errors.password.message}
								</p>
							)}
							<div className='text-right mt-2'>
								<Link href='/' className='text-sm text-primary hover:underline'>
									Quên mật khẩu?
								</Link>
							</div>
						</div>

						<Button
							type='submit'
							className='w-full h-11 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center'
							disabled={isLoading}>
							{isLoading ?
								<>
									<Loader2 className='mr-2 animate-spin' /> Đang đăng nhập
								</>
							:	'Đăng nhập'}
						</Button>
					</form>

					{/* Divider */}
					<div className='flex items-center gap-3 my-6'>
						<div className='flex-1 h-px bg-secondary'></div>
						<span className='text-sm text-muted-foreground'>HOẶC</span>
						<div className='flex-1 h-px bg-secondary'></div>
					</div>

					{/* Social Login */}
					<Button className='w-full h-11 border border-border rounded-lg flex items-center justify-center gap-2 bg-white hover:bg-secondary transition-colors'>
						<svg width='18' height='18' viewBox='0 0 18 18'>
							<path
								fill='#4285F4'
								d='M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z'
							/>
							<path
								fill='#34A853'
								d='M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z'
							/>
							<path
								fill='#FBBC05'
								d='M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z'
							/>
							<path
								fill='#EA4335'
								d='M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z'
							/>
						</svg>
						<span className='text-sm text-foreground	'>Tiếp tục với Google</span>
					</Button>

					<div className='mt-8 text-center space-y-2'>
						<p className='text-sm text-muted-foreground'>
							Chưa có tài khoản?{' '}
							<Link href='/register' className='text-primary hover:underline'>
								Đăng kí ngay
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default LoginPage;
