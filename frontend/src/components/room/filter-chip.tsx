import { Button } from '@base-ui/react/button';
import { X } from 'lucide-react';

interface FilterChipProps {
	label: string;
	active?: boolean;
	onRemove?: () => void;
	onClick?: () => void;
}

const FilterChip = ({
	label,
	active = false,
	onRemove,
	onClick,
}: FilterChipProps) => {
	return (
		<Button
			onClick={onClick}
			className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200 ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:bg-secondary'}`}>
			<span>{label}</span>
			{active && onRemove && (
				<X
					className='w-3.5 h-3.5 cursor-pointer hover:scale-110'
					onClick={(e) => {
						e.stopPropagation();
						onRemove();
					}}
				/>
			)}
		</Button>
	);
};

export default FilterChip;
