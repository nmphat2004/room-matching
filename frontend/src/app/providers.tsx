'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from '@/stores/auth.store';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Providers({ children }: PropsWithChildren) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 60 * 5,
						retry: 1,
					},
				},
			}),
	);

	useEffect(() => {
		useAuthStore.getState().fetchUser();
	}, []);

	return (
		<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
			<QueryClientProvider client={queryClient}>
				{children}
				<Toaster richColors position='top-right' />
			</QueryClientProvider>
		</GoogleOAuthProvider>
	);
}
