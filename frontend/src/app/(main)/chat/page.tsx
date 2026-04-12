import { useState } from 'react';
import { Search, Send, Smile, Paperclip, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { PriceTag } from '@/components/room/price-tag';
import { Button } from '@/components/ui/button';

export function MessagingPage() {
	const [selectedConversation, setSelectedConversation] = useState('1');
	const [messageInput, setMessageInput] = useState('');
	const [filterTab, setFilterTab] = useState('all');

	const conversations = [
		{
			id: '1',
			name: 'Trần Thị Mai',
			avatar: '',
			lastMessage: 'Phòng còn trống không ạ?',
			timestamp: '10:30',
			unread: 2,
			online: true,
			roomName: 'Phòng trọ cao cấp gần ĐH Bách Khoa',
			roomId: '1',
		},
		{
			id: '2',
			name: 'Lê Minh Tuấn',
			avatar: '',
			lastMessage: 'Em muốn xem phòng vào cuối tuần được không ạ?',
			timestamp: 'Hôm qua',
			unread: 0,
			online: false,
			roomName: 'Studio hiện đại Quận 1',
			roomId: '2',
		},
		{
			id: '3',
			name: 'Phạm Thu Hà',
			avatar: '',
			lastMessage: 'Cảm ơn chủ nhà nhiều ạ!',
			timestamp: '2 ngày trước',
			unread: 0,
			online: true,
			roomName: 'Căn hộ mini đầy đủ tiện nghi',
			roomId: '3',
		},
		{
			id: '4',
			name: 'Nguyễn Văn Bình',
			avatar: '',
			lastMessage: 'Điện nước tính như thế nào ạ?',
			timestamp: '3 ngày trước',
			unread: 1,
			online: false,
			roomName: 'Phòng đẹp giá rẻ gần chợ',
			roomId: '4',
		},
	];

	const messages = [
		{
			id: '1',
			sender: 'them',
			content: 'Chào chủ nhà, em xem tin phòng trọ cao cấp gần ĐH Bách Khoa.',
			timestamp: '09:45',
		},
		{
			id: '2',
			sender: 'them',
			content: 'Phòng còn trống không ạ?',
			timestamp: '09:46',
		},
		{
			id: '3',
			sender: 'me',
			content: 'Chào bạn! Phòng vẫn còn trống nhé.',
			timestamp: '09:50',
		},
		{
			id: '4',
			sender: 'me',
			content: 'Bạn có thể qua xem phòng vào cuối tuần này được không?',
			timestamp: '09:51',
		},
		{
			id: '5',
			sender: 'them',
			content: 'Dạ được ạ, em có thể qua xem vào Chủ nhật được không ạ?',
			timestamp: '10:15',
		},
		{
			id: '6',
			sender: 'me',
			content:
				'Được nhé, khoảng 2 giờ chiều nhé. Mình sẽ gửi địa chỉ chi tiết cho bạn.',
			timestamp: '10:20',
		},
		{
			id: '7',
			sender: 'them',
			content: 'Cảm ơn chủ nhà ạ!',
			timestamp: '10:30',
		},
	];

	const currentConversation = conversations.find(
		(c) => c.id === selectedConversation,
	);

	const handleSendMessage = () => {
		if (messageInput.trim()) {
			console.log('Sending message:', messageInput);
			setMessageInput('');
		}
	};

	return (
		<div className='bg-background h-[calc(100vh-73px)]'>
			<div className='max-w-7xl mx-auto h-full'>
				<div className='flex h-full border-x border-border'>
					{/* Left Column - Conversations List */}
					<div className='w-80 shrink-0 border-r border-border bg-card flex flex-col'>
						{/* Search */}
						<div className='p-4 border-b border-border'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
								<Input
									placeholder='Tìm kiếm cuộc trò chuyện...'
									className='pl-10'
								/>
							</div>
						</div>

						{/* Filter Tabs */}
						<div className='flex border-b border-border'>
							<button
								onClick={() => setFilterTab('all')}
								className={`flex-1 px-4 py-3 text-sm transition-colors ${
									filterTab === 'all' ?
										'border-b-2 border-primary text-primary'
									:	'text-muted-foreground hover:text-foreground'
								}`}>
								Tất cả
							</button>
							<button
								onClick={() => setFilterTab('unread')}
								className={`flex-1 px-4 py-3 text-sm transition-colors ${
									filterTab === 'unread' ?
										'border-b-2 border-primary text-primary'
									:	'text-muted-foreground hover:text-foreground'
								}`}>
								Chưa đọc
							</button>
						</div>

						{/* Conversation List */}
						<div className='flex-1 overflow-y-auto'>
							{conversations
								.filter((conv) =>
									filterTab === 'unread' ? conv.unread > 0 : true,
								)
								.map((conversation) => (
									<button
										key={conversation.id}
										onClick={() => setSelectedConversation(conversation.id)}
										className={`w-full p-4 border-b border-border hover:bg-secondary transition-colors text-left ${
											selectedConversation === conversation.id ?
												'bg-secondary'
											:	''
										}`}>
										<div className='flex items-start gap-3'>
											<Avatar />
											<div className='flex-1 min-w-0'>
												<div className='flex items-center justify-between mb-1'>
													<p className='truncate'>{conversation.name}</p>
													<span className='text-xs text-muted-foreground shrink-0 ml-2'>
														{conversation.timestamp}
													</span>
												</div>
												<Badge variant='default' className='text-xs mb-2'>
													{conversation.roomName}
												</Badge>
												<div className='flex items-center justify-between'>
													<p className='text-sm text-muted-foreground truncate'>
														{conversation.lastMessage}
													</p>
													{conversation.unread > 0 && (
														<span className='w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center shrink-0 ml-2'>
															{conversation.unread}
														</span>
													)}
												</div>
											</div>
										</div>
									</button>
								))}
						</div>
					</div>

					{/* Right Column - Chat Area */}
					{currentConversation && (
						<div className='flex-1 flex flex-col'>
							{/* Chat Header */}
							<div className='p-4 border-b border-border bg-card flex items-center justify-between'>
								<div className='flex items-center gap-3'>
									<Avatar />
									<div>
										<p>{currentConversation.name}</p>
										<p className='text-sm text-muted-foreground'>
											{currentConversation.online ?
												'Đang hoạt động'
											:	'Không hoạt động'}
										</p>
									</div>
								</div>
								<button className='p-2 hover:bg-secondary rounded-lg transition-colors'>
									<MoreVertical className='w-5 h-5' />
								</button>
							</div>

							{/* Pinned Room Card */}
							<div className='p-4 bg-secondary border-b border-border'>
								<Link
									href={`/room/${currentConversation.roomId}`}
									className='flex items-center gap-4 p-3 bg-card border border-border rounded-lg hover:shadow-md transition-shadow'>
									<Image
										src={`https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200`}
										alt={currentConversation.roomName}
										className='w-20 h-20 rounded-lg object-cover'
									/>
									<div className='flex-1'>
										<p className='mb-1'>{currentConversation.roomName}</p>
										<PriceTag amount={4500000} size='sm' />
									</div>
									<Button variant='secondary' className='shrink-0'>
										Xem tin
									</Button>
								</Link>
							</div>

							{/* Messages */}
							<div className='flex-1 overflow-y-auto p-4 space-y-4'>
								{messages.map((message, index) => {
									const showTimestamp =
										index === 0 ||
										messages[index - 1].timestamp !== message.timestamp;

									return (
										<div key={message.id}>
											{showTimestamp && (
												<div className='flex justify-center mb-4'>
													<span className='text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full'>
														{message.timestamp}
													</span>
												</div>
											)}
											<div
												className={`flex ${
													message.sender === 'me' ?
														'justify-end'
													:	'justify-start'
												}`}>
												<div
													className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
														message.sender === 'me' ?
															'bg-primary text-white rounded-br-sm'
														:	'bg-secondary text-foreground rounded-bl-sm'
													}`}>
													<p>{message.content}</p>
												</div>
											</div>
										</div>
									);
								})}
							</div>

							{/* Message Input */}
							<div className='p-4 border-t border-border bg-card'>
								<div className='flex items-center gap-3'>
									<button className='p-2 hover:bg-secondary rounded-lg transition-colors'>
										<Paperclip className='w-5 h-5 text-muted-foreground' />
									</button>

									<div className='flex-1 relative'>
										<Input
											placeholder='Nhập tin nhắn...'
											value={messageInput}
											onChange={(e) => setMessageInput(e.target.value)}
											onKeyPress={(e) => {
												if (e.key === 'Enter' && !e.shiftKey) {
													e.preventDefault();
													handleSendMessage();
												}
											}}
										/>
									</div>

									<button className='p-2 hover:bg-secondary rounded-lg transition-colors'>
										<Smile className='w-5 h-5 text-muted-foreground' />
									</button>

									<Button
										variant='default'
										onClick={handleSendMessage}
										disabled={!messageInput.trim()}>
										<Send className='w-4 h-4' />
									</Button>
								</div>
							</div>
						</div>
					)}

					{!currentConversation && (
						<div className='flex-1 flex items-center justify-center bg-secondary'>
							<div className='text-center'>
								<p className='text-muted-foreground'>
									Chọn một cuộc trò chuyện để bắt đầu
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
