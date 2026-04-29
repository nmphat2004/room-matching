import api from '../axios';

export const getAdminStats = async () => {
	const res = await api.get('/admin/stats');
	return res.data;
};

export const getAdminUsers = async () => {
	const res = await api.get('/admin/users');
	return res.data;
};

export const toggleUserBan = async (id: string) => {
	const res = await api.put(`/admin/users/${id}/ban`);
	return res.data;
};

export const getAdminRooms = async (page = 1, limit = 10) => {
	const res = await api.get('/admin/rooms', { params: { page, limit } });
	return res.data;
};

export const changeRoomStatus = async (id: string, status: 'AVAILABLE' | 'HIDDEN') => {
	const res = await api.put(`/admin/rooms/${id}/status`, { status });
	return res.data;
};

export const removeRoom = async (id: string) => {
	const res = await api.delete(`/admin/rooms/${id}`);
	return res.data;
};

export const getAdminReviews = async (page = 1, limit = 10) => {
	const res = await api.get('/admin/reviews', { params: { page, limit } });
	return res.data;
};

export const changeReviewStatus = async (id: string, isVerified: boolean) => {
	const res = await api.put(`/admin/reviews/${id}/status`, { isVerified });
	return res.data;
};

export const removeReview = async (id: string) => {
	const res = await api.delete(`/admin/reviews/${id}`);
	return res.data;
};
