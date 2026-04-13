import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface AmenityIconProps {
	icon?: string;
	name?: string;
	size?: 'sm' | 'md';
}

const AmenityIcon = ({ icon, name, size = 'md' }: AmenityIconProps) => {
	const Icon =
		(icon && (Icons[icon as keyof typeof Icons] as LucideIcon)) ||
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
			{name !== undefined && (
				<span className={`${textSizes[size]} text-foreground`}>{name}</span>
			)}
		</div>
	);
};

export default AmenityIcon;
