import { Star } from 'lucide-react';

interface StarRatingProps {
	rating: number;
	totalReviews?: number;
	size?: 'sm' | 'md' | 'lg';
	interactive?: boolean;
	onRate?: (rating: number) => void;
}

export function StarRating({
	rating,
	totalReviews,
	size = 'md',
	interactive = false,
	onRate,
}: StarRatingProps) {
	const sizes = {
		sm: 'w-3.5 h-3.5',
		md: 'w-4 h-4',
		lg: 'w-5 h-5',
	};

	const textSizes = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base',
	};

	return (
		<div className='flex items-center gap-1.5'>
			<div className='flex items-center gap-0.5'>
				{[1, 2, 3, 4, 5].map((star) => (
					<Star
						key={star}
						className={`${sizes[size]} ${
							star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
						} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
						onClick={() => interactive && onRate && onRate(star)}
					/>
				))}
			</div>
			{totalReviews !== undefined && (
				<span className={`${textSizes[size]} text-muted-foreground`}>
					({totalReviews})
				</span>
			)}
		</div>
	);
}
