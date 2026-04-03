/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@base-ui/react/button';
import { Input } from '@base-ui/react/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Home, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { register as registerApi } from '@/lib/api/auth.api';
import { toast } from 'sonner';

const schema = z.object({
	fullName: z.string().min(2, 'Họ và tên ít nhất 2 kí tự'),
	email: z.string().email('Email không hợp lệ'),
	password: z.string().min(6, 'Mật khẩu ít nhất 6 kí tự'),
	role: z.enum(['RENTER', 'LANDLORD']),
});

type FormData = z.infer<typeof schema>;

const RegisterPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { setAuth } = useAuthStore();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { role: 'RENTER' },
	});

	const selectedRole = watch('role');

	const onSubmit = async (data: FormData) => {
		setIsLoading(true);
		try {
			const res = await registerApi(data);
			setAuth(res.user, res.accessToken);
			toast.success('Đăng kí thành công!');
			router.push('/');
		} catch (error: any) {
			toast.error(error.response?.data?.message || 'Đăng kí thất bại');
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
					<CardTitle className='text-xl'>Tạo tài khoản</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						{/* Chọn role */}
						<div className='grid grid-cols-2 gap-3'>
							{(['RENTER', 'LANDLORD'] as const).map((role) => (
								<button
									key={role}
									type='button'
									onClick={() => setValue('role', role)}
									className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
										selectedRole === role ?
											'border-blue-500 bg-blue-500 text-blue-600'
										:	'border-gray-200 text-gray-600 hover:border-gray-300'
									}`}>
									{role === 'RENTER' ? '🏠 Tìm phòng' : '🏘️ Cho thuê'}
								</button>
							))}
						</div>

						<div className='space-y-1'>
							<Label>Họ và tên</Label>
							<Input placeholder='Nguyễn Văn A' {...register('fullName')} />
							{errors.fullName && (
								<p className='text-xs text-red-500'>
									{errors.fullName.message}
								</p>
							)}
						</div>

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
									<Loader2 className='w-4 h-4 mr-2 animate-spin' /> Đang đăng kí
								</>
							:	'Đăng kí'}
						</Button>
					</form>

					<p className='text-center text-sm to-gray-500 mt-4'>
						Đã có tài khoản?
						<Link
							href='/login'
							className='text-blue-600 hover:underline font-medium'>
							Đăng nhập
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default RegisterPage;
