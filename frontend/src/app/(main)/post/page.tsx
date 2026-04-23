'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Check, GripVertical, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { createRoom } from '@/lib/api/room.api';
import { uploadImage } from '@/lib/api/upload.api';
import { toast } from 'sonner';

const roomSchema = z.object({
	title: z.string().min(5, 'Tiêu đề phải từ 5 ký tự trở lên'),
	roomType: z.string().min(1, 'Vui lòng chọn loại phòng'),
	address: z.string().min(5, 'Vui lòng nhập địa chỉ chi tiết'),
	price: z.coerce.number().min(100000, 'Giá thuê phải lớn hơn 100,000đ'),
	area: z.coerce.number().min(5, 'Diện tích phải từ 5m² trở lên'),
	floor: z.coerce.number().default(0),
	description: z.string().min(10, 'Mô tả phải từ 10 ký tự trở lên'),
	amenities: z.array(z.string()).default([]),
	rules: z.string().default(''),
	electricityCost: z.coerce.number().default(0),
	waterCost: z.coerce.number().default(0),
	deposit: z.coerce.number().default(0),
	minStay: z.string().default('1 tháng'),
});

type RoomFormData = z.infer<typeof roomSchema>;

const PostRoomPage = () => {
	const router = useRouter();
	const [currentStep, setCurrentStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [uploadedImages, setUploadedImages] = useState<
		{ file: File; preview: string }[]
	>([]);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		setValue,
		getValues,
	} = useForm<RoomFormData>({
		resolver: zodResolver(roomSchema),
		mode: 'onBlur',
	});

	const formData = watch();

	const steps = [
		{ number: 1, title: 'Thông tin cơ bản' },
		{ number: 2, title: 'Mô tả & Tiện nghi' },
		{ number: 3, title: 'Hình ảnh' },
		{ number: 4, title: 'Xem trước & Đăng' },
	];

	const roomTypes = [
		{ value: 'room', label: 'Phòng trọ', icon: '🏠' },
		{ value: 'house', label: 'Nhà nguyên căn', icon: '🏡' },
		{ value: 'apartment', label: 'Chung cư mini', icon: '🏢' },
		{ value: 'dorm', label: 'Ký túc xá', icon: '🎓' },
	];

	const amenitiesList = [
		{ value: 'wifi', label: 'WiFi' },
		{ value: 'ac', label: 'Điều hòa' },
		{ value: 'parking', label: 'Bãi đỗ xe' },
		{ value: 'elevator', label: 'Thang máy' },
		{ value: 'bathroom', label: 'WC riêng' },
		{ value: 'kitchen', label: 'Bếp' },
		{ value: 'security', label: 'An ninh' },
		{ value: 'washing', label: 'Máy giặt' },
	];

	const toggleAmenity = (amenity: string) => {
		const current = getValues('amenities') || [];
		if (current.includes(amenity)) {
			setValue(
				'amenities',
				current.filter((a) => a !== amenity),
			);
		} else {
			setValue('amenities', [...current, amenity]);
		}
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const newImages = Array.from(files).map((file) => ({
				file,
				preview: URL.createObjectURL(file),
			}));
			setUploadedImages([...uploadedImages, ...newImages]);
		}
	};

	const removeImage = (index: number) => {
		setUploadedImages(uploadedImages.filter((_, i) => i !== index));
	};

	const onSubmit = async (data: RoomFormData) => {
		try {
			setIsLoading(true);

			if (uploadedImages.length < 3) {
				toast.error('Vui lòng tải lên ít nhất 3 hình ảnh');
				setCurrentStep(3);
				return;
			}

			const imageUrls: string[] = [];
			for (const image of uploadedImages) {
				const url = await uploadImage(image.file);
				imageUrls.push(url);
			}

			const roomData = {
				title: data.title,
				type: data.roomType,
				price: data.price,
				electricityCost: data.electricityCost || 0,
				waterCost: data.waterCost || 0,
				deposit: data.deposit || 0,
				minStay: data.minStay || '1 tháng',
				description: data.description,
				address: data.address,
				rule: data.rules,
				area: data.area,
				floor: data.floor || 0,
				imageUrls,
				primaryImageUrl: imageUrls[0],
				amenityIds: [],
			};

			await createRoom(roomData);
			toast.success('Tin đăng đã được tạo thành công!');
			router.push('/rooms');
		} catch (err: any) {
			const errorMessage =
				err.response?.data?.message || err.message || 'Có lỗi xảy ra';
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleNextStep = async () => {
		if (currentStep === 1) {
			setCurrentStep(currentStep + 1);
		} else if (currentStep === 2) {
			if (!getValues('description') || getValues('description').length < 10) {
				toast.error('Mô tả phải từ 10 ký tự trở lên');
				return;
			}
			setCurrentStep(currentStep + 1);
		} else if (currentStep === 3) {
			if (uploadedImages.length < 3) {
				toast.error('Vui lòng tải lên ít nhất 3 hình ảnh');
				return;
			}
			setCurrentStep(currentStep + 1);
		}
	};

	return (
		<div className='bg-background min-h-screen py-8'>
			<div className='max-w-5xl mx-auto px-4'>
				<div className='mb-8'>
					<div className='flex items-center justify-between mb-4'>
						{steps.map((step, index) => (
							<div key={step.number} className='flex items-center flex-1'>
								<div className='flex flex-col items-center'>
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step.number ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
										{currentStep > step.number ?
											<Check className='w-5 h-5' />
										:	step.number}
									</div>
									<span className='text-sm mt-2'>{step.title}</span>
								</div>
								{index < steps.length - 1 && (
									<div
										className={`flex-1 h-1 mx-4 ${currentStep > step.number ? 'bg-primary' : 'bg-secondary'}`}></div>
								)}
							</div>
						))}
					</div>
				</div>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
						<div className='lg:col-span-2 bg-card border border-border rounded-xl p-6'>
							{currentStep === 1 && (
								<div className='space-y-6'>
									<h2 className='text-2xl font-bold'>Thông tin cơ bản</h2>

									<div>
										<Label className='block mb-2'>Tiêu đề *</Label>
										<Input
											placeholder='Ví dụ: Phòng trọ 25m² gần ĐH Bách Khoa'
											{...register('title')}
											className={errors.title ? 'border-red-500' : ''}
										/>
										{errors.title && (
											<p className='text-sm text-red-500 mt-1'>
												{errors.title.message}
											</p>
										)}
									</div>

									<div>
										<Label className='block mb-3 text-lg'>Loại phòng *</Label>
										<div className='grid grid-cols-2 gap-3'>
											{roomTypes.map((type) => (
												<Button
													type='button'
													variant='outline'
													size='lg'
													key={type.value}
													onClick={() => setValue('roomType', type.value)}
													className={`p-4 h-20 border rounded-lg text-left transition-all ${formData.roomType === type.value ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary'}`}>
													<div className='text-2xl mb-2'>{type.icon}</div>
													<div>{type.label}</div>
												</Button>
											))}
										</div>
										{errors.roomType && (
											<p className='text-sm text-red-500 mt-1'>
												{errors.roomType.message}
											</p>
										)}
									</div>

									<div>
										<Label className='block mb-2'>Địa chỉ *</Label>
										<Input
											placeholder='Nhập địa chỉ chi tiết (số nhà, đường, phường, quận)'
											{...register('address')}
											className={errors.address ? 'border-red-500' : ''}
										/>
										{errors.address && (
											<p className='text-sm text-red-500 mt-1'>
												{errors.address.message}
											</p>
										)}
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<Label className='block mb-2'>Giá thuê (đ/tháng) *</Label>
											<Input
												type='number'
												placeholder='4500000'
												{...register('price')}
												className={errors.price ? 'border-red-500' : ''}
											/>
											{errors.price && (
												<p className='text-sm text-red-500 mt-1'>
													{errors.price.message}
												</p>
											)}
										</div>
										<div>
											<Label className='block mb-2'>Diện tích (m²) *</Label>
											<Input
												type='number'
												placeholder='25'
												{...register('area')}
												className={errors.area ? 'border-red-500' : ''}
											/>
											{errors.area && (
												<p className='text-sm text-red-500 mt-1'>
													{errors.area.message}
												</p>
											)}
										</div>
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<Label className='block mb-2'>Tầng</Label>
											<Input
												type='number'
												placeholder='3'
												{...register('floor')}
											/>
										</div>
										<div>
											<Label className='block mb-2'>
												Thời gian ở tối thiểu
											</Label>
											<Input placeholder='3 tháng' {...register('minStay')} />
										</div>
									</div>

									<div className='grid grid-cols-3 gap-4'>
										<div>
											<Label className='block mb-2'>Tiền điện (đ/kWh)</Label>
											<Input
												type='number'
												placeholder='3500'
												{...register('electricityCost')}
											/>
										</div>
										<div>
											<Label className='block mb-2'>Tiền nước (đ/m³)</Label>
											<Input
												type='number'
												placeholder='25000'
												{...register('waterCost')}
											/>
										</div>
										<div>
											<Label className='block mb-2'>Tiền cọc (đ)</Label>
											<Input
												type='number'
												placeholder='5000000'
												{...register('deposit')}
											/>
										</div>
									</div>
								</div>
							)}

							{currentStep === 2 && (
								<div className='space-y-6'>
									<h2 className='text-2xl font-bold'>Mô tả và Tiện nghi</h2>

									<div>
										<Label className='block mb-3 text-lg'>
											Mô tả chi tiết *
										</Label>
										<Textarea
											className='w-full px-4 py-3 rounded-lg border border-border bg-input-background min-h-[200px]'
											placeholder='Mô tả chi tiết về phòng của bạn...'
											{...register('description')}
										/>
										<div className='flex items-center justify-between mt-2'>
											<p className='text-sm text-muted-foreground'>
												{formData.description?.length || 0} ký tự
											</p>
											{errors.description && (
												<p className='text-sm text-red-500'>
													{errors.description.message}
												</p>
											)}
										</div>
									</div>

									<div>
										<Label className='block mb-2'>Tiện nghi</Label>
										<div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
											{amenitiesList.map((amenity) => (
												<Button
													type='button'
													variant='outline'
													size='lg'
													key={amenity.value}
													onClick={() => toggleAmenity(amenity.value)}
													className={`p-3 border rounded-lg transition-all ${formData.amenities?.includes(amenity.value) ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary'}`}>
													{amenity.label}
												</Button>
											))}
										</div>
									</div>

									<div>
										<Label className='block mb-2'>Quy định nhà</Label>
										<Textarea
											className='w-full px-4 py-3 rounded-lg border border-border bg-input-background min-h-[120px]'
											placeholder='Ví dụ: Không nuôi thú cưng, không hút thuốc trong phòng...'
											{...register('rules')}
										/>
									</div>
								</div>
							)}

							{currentStep === 3 && (
								<div className='space-y-6'>
									<h2 className='text-2xl font-bold'>Hình ảnh</h2>

									<div>
										<Label
											htmlFor='image-upload'
											className='block border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:bg-secondary transition-colors'>
											<Upload className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
											<p className='mb-2'>
												Kéo thả hình ảnh vào đây hoặc nhấn để chọn
											</p>
											<p className='text-sm text-muted-foreground'>
												Tối thiểu 3 ảnh
											</p>
											<Input
												id='image-upload'
												type='file'
												multiple
												accept='image/*'
												className='hidden'
												onChange={handleImageUpload}
											/>
										</Label>
									</div>

									{uploadedImages.length > 0 && (
										<div>
											<div className='flex items-center justify-between mb-3'>
												<label>Đã tải lên {uploadedImages.length} ảnh</label>
												<p className='text-sm text-muted-foreground'>
													Kéo để sắp xếp
												</p>
											</div>
											<div className='grid grid-cols-3 gap-4'>
												{uploadedImages.map((image, index) => (
													<div key={index} className='relative group'>
														<Image
															src={image.preview}
															width='200'
															height='200'
															alt={`Upload ${index + 1}`}
															className='w-full h-32 object-cover rounded-lg'
														/>
														<div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2'>
															<button
																type='button'
																className='p-2 bg-white rounded-full hover:scale-110 transition-transform'>
																<GripVertical className='w-4 h-4' />
															</button>
															<button
																type='button'
																onClick={() => removeImage(index)}
																className='p-2 bg-white rounded-full hover:scale-110 transition-transform'>
																<X className='w-4 h-4 text-destructive' />
															</button>
														</div>
														{index === 0 && (
															<Badge
																variant='secondary'
																className='absolute top-2 left-2 text-xs'>
																Ảnh bìa
															</Badge>
														)}
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							)}

							{currentStep === 4 && (
								<div className='space-y-6'>
									<h2 className='text-2xl font-bold'>Xem trước tin đăng</h2>

									<div className='bg-secondary rounded-xl p-6 space-y-4'>
										<div>
											<h3 className='text-xl font-semibold mb-2'>
												{formData.title}
											</h3>
											<p className='text-muted-foreground'>
												{formData.address}
											</p>
										</div>

										<div className='grid grid-cols-2 gap-4'>
											<div>
												<span className='text-sm text-muted-foreground block mb-1'>
													Loại phòng
												</span>
												<p className='text-lg font-medium'>
													{
														roomTypes.find((t) => t.value === formData.roomType)
															?.label
													}
												</p>
											</div>
											<div>
												<span className='text-sm text-muted-foreground block mb-1'>
													Giá thuê
												</span>
												<p className='text-xl text-accent font-semibold'>
													{Number(formData.price).toLocaleString('vi-VN')}
													₫/tháng
												</p>
											</div>
											<div>
												<span className='text-sm text-muted-foreground block mb-1'>
													Diện tích
												</span>
												<p className='text-lg'>{formData.area}m²</p>
											</div>
											<div>
												<span className='text-sm text-muted-foreground block mb-1'>
													Thời gian ở tối thiểu
												</span>
												<p className='text-lg'>{formData.minStay}</p>
											</div>
										</div>

										<Separator />

										<div>
											<span className='text-sm text-muted-foreground block mb-2 font-semibold'>
												Mô tả
											</span>
											<p className='whitespace-pre-line text-sm'>
												{formData.description}
											</p>
										</div>

										{formData.amenities && formData.amenities.length > 0 && (
											<>
												<Separator />
												<div>
													<span className='text-sm text-muted-foreground block mb-2 font-semibold'>
														Tiện nghi
													</span>
													<div className='flex flex-wrap gap-2'>
														{formData.amenities.map((amenity) => (
															<Badge key={amenity} variant='default'>
																{
																	amenitiesList.find((a) => a.value === amenity)
																		?.label
																}
															</Badge>
														))}
													</div>
												</div>
											</>
										)}

										{formData.rules && (
											<>
												<Separator />
												<div>
													<span className='text-sm text-muted-foreground block mb-2 font-semibold'>
														Quy định nhà
													</span>
													<p className='whitespace-pre-line text-sm'>
														{formData.rules}
													</p>
												</div>
											</>
										)}
									</div>

									<div className='flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
										<div className='text-blue-600 mt-0.5'>ℹ️</div>
										<div className='flex-1 text-sm'>
											<p className='mb-1'>
												Tin đăng của bạn sẽ được kiểm duyệt trong vòng 24 giờ.
											</p>
											<p className='text-muted-foreground'>
												Đảm bảo thông tin chính xác để tăng cơ hội được duyệt
												nhanh.
											</p>
										</div>
									</div>
								</div>
							)}

							<div className='flex items-center justify-between mt-8 pt-6 border-t border-border'>
								{currentStep > 1 ?
									<Button
										type='button'
										variant='secondary'
										onClick={() => setCurrentStep(currentStep - 1)}>
										Quay lại
									</Button>
								:	<div />}

								{currentStep < 4 ?
									<Button
										type='button'
										variant='default'
										onClick={handleNextStep}>
										Tiếp tục
									</Button>
								:	<Button
										type='submit'
										disabled={isLoading}
										className='bg-accent hover:bg-accent/90'>
										{isLoading ? 'Đang đăng...' : 'Đăng tin'}
									</Button>
								}
							</div>
						</div>

						<div className='lg:col-span-1'>
							<div className='sticky top-24 bg-card border border-border rounded-xl p-6'>
								<h3 className='mb-4'>💡 Mẹo đăng tin hiệu quả</h3>
								<ul className='space-y-3 text-sm text-muted-foreground'>
									{currentStep === 1 && (
										<>
											<li>✓ Điền đầy đủ thông tin địa chỉ</li>
											<li>✓ Giá thuê phải chính xác</li>
											<li>✓ Diện tích phòng thực tế</li>
										</>
									)}
									{currentStep === 2 && (
										<>
											<li>✓ Mô tả chi tiết, rõ ràng</li>
											<li>✓ Nêu rõ tiện ích xung quanh</li>
											<li>✓ Quy định nhà rõ ràng</li>
										</>
									)}
									{currentStep === 3 && (
										<>
											<li>✓ Tối thiểu 3 ảnh chất lượng</li>
											<li>✓ Ảnh bìa nên là góc đẹp nhất</li>
											<li>✓ Chụp nhiều góc khác nhau</li>
										</>
									)}
									{currentStep === 4 && (
										<>
											<li>✓ Kiểm tra kỹ thông tin</li>
											<li>✓ Đảm bảo số điện thoại chính xác</li>
											<li>✓ Tin đăng sẽ được duyệt trong 24h</li>
										</>
									)}
								</ul>

								<Separator className='my-4' />

								<div className='text-sm'>
									<p className='mb-2 font-semibold'>Tin đăng mẫu:</p>
									<div className='bg-secondary rounded-lg p-3'>
										<p className='text-xs text-muted-foreground'>
											&quot;Phòng trọ 25m² gần ĐH Bách Khoa, đầy đủ nội thất, an
											ninh tốt. Giá 4.5tr/tháng.&quot;
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default PostRoomPage;
