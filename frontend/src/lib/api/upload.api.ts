import api from '../axios';

export const uploadImage = async (file: File) => {
	const formData = new FormData();
	formData.append('files', file);

	const res = await api.post<{ urls: string[] }>('/upload/images', formData);

	return res.data.urls[0];
};
