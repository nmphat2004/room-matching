'use client';

import api from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Fix issue with Leaflet default icons in NextJS
export default function RoomMap({ address }: { address?: string }) {
	useEffect(() => {
		// This ensures marker icons resolve properly when packed
		delete (L.Icon.Default.prototype as any)._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
			iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
		});
	}, []);

	const { data, isLoading, isError } = useQuery({
		queryKey: ['room-map-geocode', address],
		queryFn: async () => {
			const res = await api.get<{ lat: number; lng: number }>('/analytics/geocode', {
				params: { address },
			});
			return res.data;
		},
		enabled: Boolean(address),
	});

	if (isLoading) {
		return <Skeleton className='h-[300px] w-full rounded-xl mt-4' />;
	}

	if (isError || !data || !Number.isFinite(data.lat) || !Number.isFinite(data.lng)) {
		return (
			<div className='w-full rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground mt-4'>
				Không xác định được vị trí từ địa chỉ để hiển thị bản đồ.
			</div>
		);
	}

	const lat = data.lat;
	const lng = data.lng;

	return (
		<div className="w-full h-full rounded-xl overflow-hidden border border-border mt-4">
			<MapContainer
				center={[lat, lng]}
				zoom={15}
				scrollWheelZoom={false}
				style={{ height: '300px', width: '100%', zIndex: 0 }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={[lat, lng]}>
					<Popup>
						{address || 'Vị trí phòng'}
					</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
}
