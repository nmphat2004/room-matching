import { create } from 'zustand';
import api from '@/lib/axios';

interface User {
	id: string;
	fullName: string;
	email: string;
	role: 'ADMIN' | 'LANDLORD' | 'RENTER';
	avatarUrl?: string;
}

interface AuthState {
	user: User | null;
	accessToken: string | null;
	refreshToken: string | null;
	isLoading: boolean;
	setAuth: (user: User, accessToken: string, refreshToken: string) => void;
	updateTokens: (accessToken: string, refreshToken: string) => void;
	logout: () => void;
	fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
	refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
	isLoading: true,
	setAuth: (user, accessToken, refreshToken) => {
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);
		set({ user, accessToken, refreshToken, isLoading: false });
	},
	updateTokens: (accessToken, refreshToken) => {
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshToken);
		set({ accessToken, refreshToken });
	},
	logout: () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		set({ user: null, accessToken: null, refreshToken: null, isLoading: false });
	},
	fetchUser: async () => {
		const token = get().accessToken || localStorage.getItem('accessToken');
		if (!token) {
			set({ isLoading: false });
			return;
		}
		try {
			const res = await api.get('/users/me');
			set({ user: res.data, accessToken: token, isLoading: false });
		} catch {
			// Token hết hạn hoặc không hợp lệ -> logout hoặc để axios interceptor xử lý
			set({ isLoading: false });
		}
	},
}));
