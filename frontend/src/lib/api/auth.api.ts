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

export const refreshToken = async (token: string) => {
	const res = await api.post<{ accessToken: string; refreshToken: string }>(
		'/auth/refresh',
		{ refreshToken: token },
	);
	return res.data;
};

export const googleLogin = async (idToken: string) => {
	const res = await api.post<AuthResponse>('/auth/google', { idToken });
	return res.data;
};

export const forgotPassword = async (email: string) => {
	const res = await api.post<{ message: string }>('/auth/forgot-password', {
		email,
	});
	return res.data;
};

export const verifyResetCode = async (email: string, code: string) => {
	const res = await api.post<{ valid: boolean }>('/auth/verify-reset-code', {
		email,
		code,
	});
	return res.data;
};

export const resetPassword = async (
	email: string,
	code: string,
	newPassword: string,
) => {
	const res = await api.post<{ message: string }>('/auth/reset-password', {
		email,
		code,
		newPassword,
	});
	return res.data;
};
