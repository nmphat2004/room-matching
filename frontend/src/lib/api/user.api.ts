import { User } from '@/types';
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
