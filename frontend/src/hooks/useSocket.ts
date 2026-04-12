/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useAuthStore } from '@/stores/auth.store';
import useChatStore from '@/stores/chat.store';
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

const useSocket = () => {
	const { accessToken, user } = useAuthStore();
	const { addMessage, setTyping, incrementUnread, activeConversationId } =
		useChatStore();

	useEffect(() => {
		if (!accessToken || !user) return;
		if (socketInstance?.connected) return;

		socketInstance = io(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
			auth: { token: accessToken },
			transports: ['websocket'],
		});

		socketInstance.on('connect', () => console.log('Socket Connected!'));

		socketInstance.on('new_message', (msg: any) => {
			addMessage(msg);
			if (msg.conversationId !== activeConversationId) incrementUnread();
		});

		socketInstance.on('user_typing', ({ conversationId }: any) => {
			setTyping(conversationId, true);
			setTimeout(() => setTyping(conversationId, false), 2000);
		});

		socketInstance.on('disconnect', () => console.log('Socket disconnected!'));

		return () => {
			socketInstance?.disconnect();
			socketInstance = null;
		};
	}, [accessToken]);

	const joinConversation = (id: string) => {
		socketInstance?.emit('join_conversation', id);
	};

	const sendMessage = (conversationId: string, content: string) => {
		socketInstance?.emit('send_message', { conversationId, content });
	};

	const sendTyping = (conversationId: string) => {
		socketInstance?.emit('typing', conversationId);
	};

	return { joinConversation, sendMessage, sendTyping };
};

export default useSocket;
