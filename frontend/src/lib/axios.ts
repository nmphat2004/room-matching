/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { refreshToken } from './api/auth.api';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let refreshQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
	refreshQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	refreshQueue = [];
};

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('accessToken');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					refreshQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						return api(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			const currentRefreshToken = localStorage.getItem('refreshToken');
			if (!currentRefreshToken) {
				isRefreshing = false;
				return Promise.reject(error);
			}

			try {
				const { accessToken, refreshToken: newRefreshToken } =
					await refreshToken(currentRefreshToken);

				localStorage.setItem('accessToken', accessToken);
				localStorage.setItem('refreshToken', newRefreshToken);

				api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
				processQueue(null, accessToken);

				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return api(originalRequest);
			} catch (err) {
				processQueue(err, null);
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
				// Redirect to login if needed or let the app handle auth state
				window.location.href = '/login';
				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);

export default api;
