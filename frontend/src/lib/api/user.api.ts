import { Room, User } from '@/types';
import api from '../axios';

interface UserData {
	fullName?: string;
	phone?: string;
	role?: string;
	avatarUrl?: string;
}

export const getMe = async () => {
	const res = await api.get<User>('/users/me');
	return res.data;
};

export const updateMe = async (data: UserData) => {
	const res = await api.put<User>('/users/me', data);
	return res.data;
};

export const changePassword = async (data: {
	currentPassword: string;
	newPassword: string;
}) => {
	const res = await api.put<User>('/users/change-password', data);
	return res.data;
};

export const getSavedRooms = async () => {
	const res = await api.get<Room[]>('/users/saved-rooms');
	return res.data;
};

export const getSavedRoomStatus = async (roomId: string) => {
	const res = await api.get<{ saved: boolean }>(`/users/saved-rooms/${roomId}`);
	return res.data;
};

export const saveRoom = async (roomId: string) => {
	const res = await api.post<{ saved: boolean }>(`/users/saved-rooms/${roomId}`);
	return res.data;
};

export const unsaveRoom = async (roomId: string) => {
	const res = await api.delete<{ saved: boolean }>(`/users/saved-rooms/${roomId}`);
	return res.data;
};
