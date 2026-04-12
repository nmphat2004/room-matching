/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

interface Message {
	id: string;
	conversationId: string;
	senderId: string;
	content: string;
	sentAt: string;
	sender: { id: string; fullName: string; avatarUrl?: string };
}

interface Conversation {
	id: string;
	roomId: string;
	renterId: string;
	ownerId: string;
	room: { id: string; title: string; price: number; image: any[] };
	renter: { id: string; fullName: string; avatarUrl?: string };
	owner: { id: string; fullName: string; avatarUrl?: string };
	messages: Message[];
}

interface ChatState {
	conversations: Conversation[];
	activeConversationId: string | null;
	messages: Record<string, Message[]>;
	unreadCount: number;
	isTyping: Record<string, boolean>;
	setConversations: (c: Conversation[]) => void;
	setActiveConversation: (id: string) => void;
	addMessage: (msg: Message) => void;
	setMessage: (convId: string, msgs: Message[]) => void;
	setTyping: (convId: string, val: boolean) => void;
	incrementUnread: () => void;
	resetUnread: () => void;
}

const useChatStore = create<ChatState>((set) => ({
	conversations: [],
	activeConversationId: null,
	messages: {},
	unreadCount: 0,
	isTyping: {},

	setConversations: (conversations) => set({ conversations }),
	setActiveConversation: (id) => set({ activeConversationId: id }),

	addMessage: (msg) =>
		set((state) => ({
			messages: {
				...state.messages,
				[msg.conversationId]: [
					...(state.messages[msg.conversationId] || []),
					msg,
				],
			},
			conversations: state.conversations.map((c) =>
				c.id === msg.conversationId ?
					{ ...c, messages: [...(c.messages || []), msg] }
				:	c,
			),
		})),

	setMessage: (convId, msgs) =>
		set((state) => ({
			messages: { ...state.messages, [convId]: msgs },
		})),

	setTyping: (convId, val) =>
		set((state) => ({
			isTyping: { ...state.isTyping, [convId]: val },
		})),

	incrementUnread: () => {
		set((state) => ({ unreadCount: state.unreadCount + 1 }));
	},

	resetUnread: () => set({ unreadCount: 0 }),
}));

export default useChatStore;
