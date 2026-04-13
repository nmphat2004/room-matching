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
	isLoading: boolean;
	setAuth: (user: User, accessToken: string) => void;
	logout: () => void;
	fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
	isLoading: true,
	setAuth: (user, accessToken) => {
		localStorage.setItem('accessToken', accessToken);
		set({ user, accessToken, isLoading: false });
	},
	logout: () => {
		localStorage.removeItem('accessToken');
		set({ user: null, accessToken: null, isLoading: false });
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
			// Token hết hạn hoặc không hợp lệ
			localStorage.removeItem('accessToken');
			set({ user: null, accessToken: null, isLoading: false });
		}
	},
}));
