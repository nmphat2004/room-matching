export const formatRelativeTime = (input: string | Date) => {
	const date = typeof input === 'string' ? new Date(input) : input;
	if (Number.isNaN(date.getTime())) return '';

	const diffMs = Date.now() - date.getTime();
	const minute = 60 * 1000;
	const hour = 60 * minute;
	const day = 24 * hour;

	if (diffMs < minute) return 'Vừa xong';
	if (diffMs < hour) return `${Math.floor(diffMs / minute)} phút trước`;
	if (diffMs < day) return `${Math.floor(diffMs / hour)} giờ trước`;
	if (diffMs < day * 7) return `${Math.floor(diffMs / day)} ngày trước`;

	return date.toLocaleDateString('vi-VN');
};
