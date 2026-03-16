import { create } from 'zustand';

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
	setAuth: (user: User, accessToken: string) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	accessToken: null,
	setAuth: (user, accessToken) => {
		localStorage.setItem('accessToken', accessToken);
		set({ user, accessToken });
	},
	logout: () => {
		localStorage.removeItem('accessToken');
		set({ user: null, accessToken: null });
	},
}));
