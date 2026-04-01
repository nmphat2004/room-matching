import { User } from '@/types';
import api from '../axios';

interface AuthResponse {
	user: User;
	accessToken: string;
	refreshToken: string;
}

export const register = async (data: {
	fullName: string;
	email: string;
	password: string;
	role?: string;
}) => {
	const res = await api.post<AuthResponse>('/auth/register', data);
	return res.data;
};

export const login = async (data: { email: string; password: string }) => {
	const res = await api.post<AuthResponse>('/auth/login', data);
	return res.data;
};
