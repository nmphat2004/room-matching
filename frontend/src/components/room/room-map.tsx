'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix issue with Leaflet default icons in NextJS
export default function RoomMap({ lat, lng, address }: { lat: number; lng: number, address?: string }) {
	useEffect(() => {
		// This ensures marker icons resolve properly when packed
		delete (L.Icon.Default.prototype as any)._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
			iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
			shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
		});
	}, []);

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
