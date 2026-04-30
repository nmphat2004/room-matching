'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

type GalleryImage = {
	id: string;
	url: string;
};

interface DetailImageGalleryProps {
	title: string;
	images: GalleryImage[];
}

const DetailImageGallery = ({ title, images }: DetailImageGalleryProps) => {
	const imageList = useMemo(
		() => images.filter((img) => Boolean(img.url)),
		[images],
	);
	const [activeIndex, setActiveIndex] = useState(0);

	if (!imageList.length) {
		return (
			<div className='h-[300px] md:h-[450px] rounded-2xl border border-border bg-secondary/30 flex items-center justify-center text-muted-foreground'>
				Không có hình ảnh
			</div>
		);
	}

	const activeImage = imageList[activeIndex];
	const next = () => setActiveIndex((prev) => (prev + 1) % imageList.length);
	const prev = () =>
		setActiveIndex((prev) => (prev - 1 + imageList.length) % imageList.length);

	return (
		<section className='space-y-3'>
			<div className='relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden border border-border bg-secondary/10'>
				<Image
					src={activeImage.url}
					alt={title}
					fill
					priority
					className='object-cover'
				/>

				{imageList.length > 1 && (
					<>
						<Button
							type='button'
							size='icon'
							variant='secondary'
							className='absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/45 text-white hover:bg-black/60'
							onClick={prev}>
							<ChevronLeft className='h-5 w-5' />
						</Button>
						<Button
							type='button'
							size='icon'
							variant='secondary'
							className='absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/45 text-white hover:bg-black/60'
							onClick={next}>
							<ChevronRight className='h-5 w-5' />
						</Button>
					</>
				)}
			</div>

			<div className='flex gap-2 overflow-x-auto pb-1'>
				{imageList.map((img, idx) => (
					<button
						type='button'
						key={img.id || `${img.url}-${idx}`}
						onClick={() => setActiveIndex(idx)}
						className={`relative h-16 w-24 md:h-20 md:w-28 shrink-0 overflow-hidden rounded-lg border-2 transition ${
							idx === activeIndex ? 'border-primary' : 'border-transparent'
						}`}>
						<Image
							src={img.url}
							alt={`${title} ${idx + 1}`}
							fill
							className='object-cover'
						/>
					</button>
				))}
			</div>
		</section>
	);
};

export default DetailImageGallery;
