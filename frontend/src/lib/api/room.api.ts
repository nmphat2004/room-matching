/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginatedResponse, Room } from '@/types';
import api from '../axios';

export interface SearchRoomParams {
	keyword?: string;
	minPrice?: number;
	maxPrice?: number;
	minArea?: number;
	maxArea?: number;
	minRating?: number;
	selectedDistrict?: string;
	amenities?: string;
	roomType?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
}

export const getRooms = async (params: SearchRoomParams) => {
	const res = await api.get<PaginatedResponse<Room>>('/rooms', { params });
	return res.data;
};

export const getRoomById = async (id: string) => {
	const res = await api.get<Room>(`/rooms/${id}`);
	return res.data;
};

export const createRoom = async (data: any) => {
	const res = await api.post<Room>('/rooms', data);
	return res.data;
};

export const getMyRoom = async () => {
	const res = await api.get<Room>('/rooms/my-rooms');
	return res.data;
};
