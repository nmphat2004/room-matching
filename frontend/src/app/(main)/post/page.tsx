'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Check, GripVertical, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const PostRoomPage = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState({
		roomType: '',
		address: '',
		price: '',
		area: '',
		floor: '',
		availableRooms: '1',
		description: '',
		amenities: [] as string[],
		rules: '',
	});
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);

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
		setFormData((prev) => ({
			...prev,
			amenities:
				prev.amenities.includes(amenity) ?
					prev.amenities.filter((a) => a !== amenity)
				:	[...prev.amenities, amenity],
		}));
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const newImages = Array.from(files).map((file) =>
				URL.createObjectURL(file),
			);
			setUploadedImages([...uploadedImages, ...newImages]);
		}
	};

	const removeImage = (index: number) => {
		setUploadedImages(uploadedImages.filter((_, i) => i !== index));
	};

	return (
		<div className='bg-background min-h-screen py-8'>
			<div className='max-w-5xl mx-auto px-4'>
				{/* Step Indicator */}
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

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Main Form */}
					<div className='lg:col-span-2 bg-card border border-border rounded-xl p-6'>
						{/* Step 1: Basic Info */}
						{currentStep === 1 && (
							<div className='space-y-6'>
								<h2>Thông tin cơ bản</h2>
								<div>
									<Label className='block mb-3 text-lg'>Loại phòng *</Label>
									<div className='grid grid-cols-2 gap-3'>
										{roomTypes.map((type) => (
											<Button
												variant='outline'
												size='lg'
												key={type.value}
												onClick={() =>
													setFormData({ ...formData, roomType: type.value })
												}
												className={`p-4 h-20 border rounded-lg text-left transition-all ${formData.roomType === type.value ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary'}`}>
												<div className='text-2xl mb-2'>{type.icon}</div>
												<div>{type.label}</div>
											</Button>
										))}
									</div>
								</div>
								<div>
									<Label className='block mb-2'>Địa chỉ</Label>
									<Input
										placeholder='Nhập địa chỉ chi tiết (số nhà, đường, phường, quận)'
										value={formData.address}
										onChange={(e) =>
											setFormData({ ...formData, address: e.target.value })
										}
									/>
								</div>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<Label className='block mb-2'>Giá thuê (đ/tháng)</Label>
										<Input
											type='number'
											placeholder='4500000'
											value={formData.price}
											onChange={(e) =>
												setFormData({ ...formData, price: e.target.value })
											}
										/>
									</div>

									<div>
										<Label className='block mb-2'>Diện tích (m²)</Label>
										<Input
											type='number'
											placeholder='25'
											value={formData.area}
											onChange={(e) =>
												setFormData({ ...formData, area: e.target.value })
											}
										/>
									</div>
								</div>
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<Label className='block mb-2'>Tầng</Label>
										<Input
											type='number'
											placeholder='3'
											value={formData.floor}
											onChange={(e) =>
												setFormData({ ...formData, floor: e.target.value })
											}
										/>
									</div>

									<div>
										<Label className='block mb-2'>Số phòng trống</Label>
										<Input
											type='number'
											placeholder='1'
											value={formData.availableRooms}
											onChange={(e) =>
												setFormData({
													...formData,
													availableRooms: e.target.value,
												})
											}
										/>
									</div>
								</div>
							</div>
						)}

						{/* Step 2: Description & Amenities */}
						{currentStep === 2 && (
							<div className='space-y-6'>
								<h2>Mô tả và Tiện nghi</h2>
								<div>
									<Label className='block mb-3 text-lg'>Mô tả chi tiết *</Label>
									<Textarea
										className='w-full px-4 py-3 rounded-lg border border-border bg-input-background min-h-[200px]'
										placeholder='Mô tả chi tiết về phòng của bạn...'
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
									/>
									<p className='text-sm text-muted-foreground mt-1'>
										{formData.description.length} kí tự
									</p>
								</div>
								<div>
									<Label className='block mb-2'>Tiện nghi</Label>
									<div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
										{amenitiesList.map((amenity) => (
											<Button
												variant='outline'
												size='lg'
												key={amenity.value}
												className={`p-3 border rounded-lg transition-all ${formData.amenities.includes(amenity.value) ? 'border-primary bg-primary/3' : 'border-border hover:bg-secondary'}`}>
												{amenity.value}
											</Button>
										))}
									</div>
								</div>
								<div>
									<Label className='block mb-2'>Quy định nhà</Label>
									<Textarea
										className='w-full px-4 py-3 rounded-lg border border-border bg-input-background min-h-[120px]'
										placeholder='Ví dụ: Không nuôi thú cưng, không hút thuốc trong phòng...'
										value={formData.rules}
										onChange={(e) =>
											setFormData({ ...formData, rules: e.target.value })
										}
									/>
								</div>
							</div>
						)}

						{/* Step 3: Photos */}
						{currentStep === 3 && (
							<div className='space-y-6'>
								<h2>Hình ảnh</h2>

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
														src={image}
														width='200'
														height='200'
														alt={`Upload ${index + 1}`}
														className='w-full h-32 object-cover rounded-lg'
													/>
													<div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2'>
														<button className='p-2 bg-white rounded-full hover:scale-110 transition-transform'>
															<GripVertical className='w-4 h-4' />
														</button>
														<button
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

						{/* Step 4: Preview */}
						{currentStep === 4 && (
							<div className='space-y-6'>
								<h2>Xem trước tin đăng</h2>

								<div className='bg-secondary rounded-xl p-6'>
									<h3 className='mb-4'>
										{
											roomTypes.find((t) => t.value === formData.roomType)
												?.label
										}
									</h3>
									<p className='text-muted-foreground mb-4'>
										{formData.address}
									</p>

									<div className='grid grid-cols-2 gap-4 mb-4'>
										<div>
											<span className='text-sm text-muted-foreground'>
												Giá thuê
											</span>
											<p className='text-xl text-accent'>
												{Number(formData.price).toLocaleString('vi-VN')}₫/tháng
											</p>
										</div>
										<div>
											<span className='text-sm text-muted-foreground'>
												Diện tích
											</span>
											<p className='text-xl'>{formData.area}m²</p>
										</div>
									</div>

									<div className='mb-4'>
										<span className='text-sm text-muted-foreground block mb-2'>
											Mô tả
										</span>
										<p className='whitespace-pre-line'>
											{formData.description}
										</p>
									</div>

									<div>
										<span className='text-sm text-muted-foreground block mb-2'>
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

						{/* Navigation Buttons */}
						<div className='flex items-center justify-between mt-8 pt-6 border-t border-border'>
							{currentStep > 1 ?
								<Button
									variant='secondary'
									onClick={() => setCurrentStep(currentStep - 1)}>
									Quay lại
								</Button>
							:	<div />}

							{currentStep < 4 ?
								<Button
									variant='default'
									onClick={() => setCurrentStep(currentStep + 1)}>
									Tiếp tục
								</Button>
							:	<Button
									variant='default'
									className='bg-accent hover:bg-accent/90'>
									Đăng tin
								</Button>
							}
						</div>
					</div>

					{/* Tips Sidebar */}
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
								<p className='mb-2'>Tin đăng mẫu:</p>
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
			</div>
		</div>
	);
};

export default PostRoomPage;
