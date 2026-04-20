import { create } from 'zustand';

interface NotificationState {
	chatUnreadCount: number;
	notificationUnreadCount: number;
	setUnreadSummary: (data: {
		chatUnreadCount: number;
		notificationUnreadCount: number;
	}) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
	chatUnreadCount: 0,
	notificationUnreadCount: 0,
	setUnreadSummary: (data) =>
		set({
			chatUnreadCount: data.chatUnreadCount,
			notificationUnreadCount: data.notificationUnreadCount,
		}),
}));
