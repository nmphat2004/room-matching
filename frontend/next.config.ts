import type { NextConfig } from 'next';

// next.config.ts
const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'images.unsplash.com' },
			{ protocol: 'https', hostname: 'res.cloudinary.com' }, // Thêm Cloudinary ở đây
		],
	},
};

export default nextConfig;
