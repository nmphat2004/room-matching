import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface AmenityIconProps {
	type?: string;
	label?: string;
	size?: 'sm' | 'md';
}

const AmenityIcon = ({ type, label, size = 'md' }: AmenityIconProps) => {
	const Icon =
		(type && (Icons[type as keyof typeof Icons] as LucideIcon)) ||
		Icons.CircleHelp;

	const iconSizes = {
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
	};

	const textSizes = {
		sm: 'text-xs',
		md: 'text-sm',
	};

	return (
		<div className='flex items-center gap-2'>
			<Icon className={`${iconSizes[size]} text-muted-foreground`} />
			{label !== undefined && (
				<span className={`${textSizes[size]} text-foreground`}>
					{label}
				</span>
			)}
		</div>
	);
};

export default AmenityIcon;
