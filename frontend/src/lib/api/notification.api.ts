import api from '../axios';

export interface NotificationItem {
	id: string;
	type: string;
	title: string;
	content: string;
	link?: string;
	isRead: boolean;
	createdAt: string;
}

export interface NotificationPreferences {
	newMessage: boolean;
	savedListing: boolean;
	newReview: boolean;
	priceAlert: boolean;
}

export const getNotifications = async () => {
	const res = await api.get<NotificationItem[]>('/notifications');
	return res.data;
};

export const markNotificationRead = async (id: string) => {
	const res = await api.put<{ success: boolean }>(`/notifications/${id}/read`);
	return res.data;
};

export const markAllNotificationRead = async () => {
	const res = await api.put<{ success: boolean }>('/notifications/read-all');
	return res.data;
};

export const getNotificationPreferences = async () => {
	const res = await api.get<NotificationPreferences>(
		'/notifications/preferences',
	);
	return res.data;
};

export const updateNotificationPreferences = async (
	data: Partial<NotificationPreferences>,
) => {
	const res = await api.post<NotificationPreferences>(
		'/notifications/preferences',
		data,
	);
	return res.data;
};
