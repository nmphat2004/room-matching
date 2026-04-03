/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/api/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import { Home, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
	const { setAuth } = useAuthStore();

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
			setAuth(res.user, res.accessToken);
			toast.success(`Xin chào, ${res.user.fullName}!`);
			router.push('/');
		} catch (error: any) {
			toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
			<Card className='w-full max-w-md'>
				<CardHeader className='text-center'>
					<div className='flex justify-center mb-2'>
						<div className='flex items-center gap-2 text-blue-600 font-bold text-2xl'>
							<Home className='w-7 h-7' /> Room Matching
						</div>
					</div>
					<CardTitle className='text-xl'>Đăng nhập</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						<div className='space-y-1'>
							<Label>Email</Label>
							<Input
								type='email'
								placeholder='your@email.com'
								{...register('email')}
							/>
							{errors.email && (
								<p className='text-xs text-red-500'>{errors.email.message}</p>
							)}
						</div>

						<div className='space-y-1'>
							<Label>Mật khẩu</Label>
							<Input
								type='password'
								placeholder='*******'
								{...register('password')}
							/>
						</div>

						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading ?
								<>
									<Loader2 className='w-4 h-4 mr-2 animate-spin' /> Đang đăng
									nhập
								</>
							:	'Đăng nhập'}
						</Button>
					</form>

					<p className='text-center text-sm to-gray-500 mt-4'>
						Chưa có tài khoản?
						<Link
							href='/register'
							className='text-blue-600 hover:underline font-medium'>
							Đăng kí ngay
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default LoginPage;
