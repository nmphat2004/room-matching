export interface User {
	id: string;
	fullName: string;
	email: string;
	role: 'ADMIN' | 'LANDLORD' | 'RENTER';
	phone?: string;
	avatarUrl?: string;
}

export interface Room {
	id: string;
	title: string;
	price: number;
	description?: string;
	address: string;
	lat?: number;
	lng?: number;
	area?: number;
	floor?: number;
	status: 'AVAILABLE' | 'RENTED' | 'HIDDEN';
	avgRating: number;
	reviewCount: number;
	viewCount: number;
	createdAt: number;
	owner: {
		id: string;
		fullName: string;
		phone?: number;
		avatarUrl?: string;
	};
	images: RoomImage[];
	amenities: RoomAmenity[];
}

export interface RoomImage {
	id: string;
	url: string;
	isPrimary: boolean;
}

export interface Amenity {
	id: string;
	name: string;
	icon?: string;
}

export interface RoomAmenity {
	amenityId: string;
	amenity: Amenity;
}

export interface Review {
	id: string;
	rating: string;
	cleanRating: string;
	landlordRating: string;
	securityRating: string;
	locationRating: string;
	comment?: string;
	sentiment?: string;
	createdAt: string;
	reviewer: {
		id: string;
		fullName: string;
		avatarUrl?: string;
	};
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}
