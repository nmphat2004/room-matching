/* eslint-disable @typescript-eslint/no-explicit-any */
interface PriceTagProps {
	amount: number;
	period?: string;
	size?: 'sm' | 'md' | 'lg';
}

export function PriceTag({
	amount,
	period = '/tháng',
	size = 'md',
}: PriceTagProps) {
	const formatPrice = (price: any) => {
		const val = Number(price) / 1000000;
		return isNaN(val) ? '0,0' : val.toFixed(1).replace('.', ',');
	};

	const textSizes = {
		sm: 'text-base',
		md: 'text-lg',
		lg: 'text-2xl',
	};

	const periodSizes = {
		sm: 'text-xs',
		md: 'text-sm',
		lg: 'text-base',
	};

	return (
		<div className='inline-flex items-baseline gap-1'>
			<span className={`${textSizes[size]} text-accent`}>
				{formatPrice(amount)}tr
			</span>
			<span className={`${periodSizes[size]} text-muted-foreground`}>
				{period}
			</span>
		</div>
	);
}
