import { useState } from 'react';
import { MessageSquare, User, Users, Heart } from 'lucide-react';
import { ChatWindow } from '../components/chat/ChatWindow';

const MOCK_CHATS = [
	{ id: 1, name: 'Alice M.', lastMessage: "See you next week!", unread: 1, timestamp: '1m ago', isNode: true, tags: ['L1', 'VIP'], isGroup: false, isFavorite: true },
	{ id: 2, name: 'Bob D.', lastMessage: "Thanks for the invoice.", unread: 0, timestamp: '2h ago', isNode: true, tags: ['L1'], isGroup: false, isFavorite: false },
	{ id: 3, name: 'Community Group', lastMessage: "Event RSVP is closed.", unread: 5, timestamp: '1d ago', isNode: false, isGroup: true, tags: ['L3', 'Event'], isFavorite: false },
	{ id: 4, name: 'Sarah J.', lastMessage: "Do you have vegan options?", unread: 0, timestamp: '2d ago', isNode: true, tags: ['L1', 'Vegan'], isGroup: false, isFavorite: true },
];

const MOCK_MESSAGES: any = {
	1: [
		{ id: 1, sender: 'Alice M.', text: "The coffee consultation went great!", time: '10:00 AM', isMe: false },
		{ id: 2, sender: 'Me', text: "Wonderful to hear! See you next week for the follow-up?", time: '10:05 AM', isMe: true },
		{ id: 3, sender: 'Alice M.', text: "See you next week!", time: '10:06 AM', isMe: false }
	],
	2: [
		{ id: 1, sender: 'Me', text: "Invoice #F203 attached for the event deposit.", time: '8:00 AM', isMe: true },
		{ id: 2, sender: 'Bob D.', text: "Got it, payment confirmed. Thanks for the invoice.", time: '10:15 AM', isMe: false }
	],
	3: [
		{ id: 1, sender: 'Group Admin', text: "Reminder: Event RSVP is closed.", time: 'Nov 23', isMe: false },
		{ id: 2, sender: 'Davina K.', text: "Who won the raffle?", time: 'Nov 23', isMe: false },
		{ id: 3, sender: 'Charlie', text: "I think it was Bob!", time: 'Nov 23', isMe: false }
	],
	4: [
		{ id: 1, sender: 'Sarah J.', text: "Hi, I'm new here. Do you have vegan options?", time: 'Yesterday', isMe: false, type: 'text' },
	]
};

const ChatListItem = ({ chat, isSelected, onClick }: any) => {
	const AvatarIcon = chat.isGroup ? Users : User;

	return (
		<div
			className={`
				p-4 flex items-center gap-4 border rounded-2xl cursor-pointer transition-all min-h-[80px] group
				${isSelected
					? 'glass-card-active border-indigo-500/50 bg-indigo-50 dark:bg-indigo-900/20'
					: 'glass-card border-transparent hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-200 dark:border-white/10'
				}
			`}
			onClick={() => onClick(chat.id)}
		>
			<div className={`h-14 w-14 rounded-full flex items-center justify-center font-bold text-xl relative flex-shrink-0 border border-slate-200 dark:border-white/10 shadow-lg transition-transform group-hover:scale-105 ${chat.isGroup ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'}`}>
				{chat.isGroup ? <AvatarIcon size={24} /> : chat.name[0]}
				{chat.unread > 0 && (
					<span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 rounded-full text-[10px] flex items-center justify-center text-white ring-2 ring-white dark:ring-slate-950 font-bold shadow-lg">
						{chat.unread}
					</span>
				)}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex justify-between items-center mb-1">
					<h4 className={`text-base font-bold truncate flex items-center gap-1.5 ${isSelected ? 'text-indigo-900 dark:text-white' : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
						{chat.name}
						{chat.isFavorite && <Heart size={14} className="text-rose-500 fill-rose-500" />}
					</h4>
					<span className="text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap ml-2 font-medium">{chat.timestamp}</span>
				</div>
				<p className={`text-sm truncate font-medium ${isSelected ? 'text-indigo-600 dark:text-indigo-200' : 'text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-400'}`}>
					{chat.lastMessage}
				</p>
			</div>
		</div>
	);
};

import { useSearchParams } from 'react-router-dom';

export const ChatsModule = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const selectedChatId = searchParams.get('id') ? parseInt(searchParams.get('id')!) : null;

	const [chats, setChats] = useState(MOCK_CHATS);
	const [allMessages, setAllMessages] = useState(MOCK_MESSAGES);
	const [filter, setFilter] = useState('all');

	const selectedChat = chats.find(c => c.id === selectedChatId);

	const filteredChats = chats.filter(chat => {
		if (filter === 'all') return true;
		if (filter === 'personal') return !chat.isGroup;
		if (filter === 'groups') return chat.isGroup;
		return true;
	});

	const handleSendMessage = (chatId: number, content: string, options: { type?: 'text' | 'image' | 'sticker' | 'audio', replyToId?: number } = {}) => {
		const type = options.type || 'text';
		const newMessage = {
			id: Date.now(),
			sender: 'Me',
			text: content,
			time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
			isMe: true,
			type,
			replyToId: options.replyToId
		};
		setAllMessages((prev: any) => ({ ...prev, [chatId]: [...(prev[chatId] || []), newMessage] }));

		let lastMsgText = content;
		if (type === 'image') lastMsgText = 'Sent an image';
		if (type === 'sticker') lastMsgText = 'Sent a sticker';
		if (type === 'audio') lastMsgText = 'Sent a voice message';

		setChats(prev => prev.map(c => c.id === chatId ? { ...c, lastMessage: lastMsgText, timestamp: 'Just now', unread: 0 } : c));
	};

	const handleReaction = (chatId: number, messageId: number, emoji: string) => {
		setAllMessages((prev: any) => ({
			...prev,
			[chatId]: prev[chatId].map((msg: any) =>
				msg.id === messageId ? { ...msg, reactions: { ...(msg.reactions || {}), [emoji]: (msg.reactions?.[emoji] || 0) + 1 } } : msg
			)
		}));
	};

	const handleChatUpdate = (chatId: number, updates: any) => {
		setChats(prev => prev.map(c => c.id === chatId ? { ...c, ...updates } : c));
	};

	const selectChat = (id: number) => {
		setSearchParams({ id: id.toString() });
		setChats(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
	};

	return (
		<div className="p-0 md:p-4 space-y-0 md:space-y-4 animate-in fade-in h-full flex gap-2 md:gap-4 min-h-0">
			{/* Chat List */}
			<div className={`glass-panel h-full flex flex-col rounded-none md:rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 min-h-0 ${selectedChatId ? 'hidden md:flex md:w-80 lg:w-96' : 'w-full'}`}>
				<div className="p-5 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-20 border-b border-slate-200 dark:border-white/5">
					<h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5 mb-5"><MessageSquare size={28} className="text-indigo-400" /> Chats</h2>
					<div className="flex bg-slate-100 dark:bg-black/30 p-1 rounded-xl">
						{['All', 'Personal', 'Groups'].map(f => (
							<button
								key={f}
								onClick={() => setFilter(f.toLowerCase())}
								className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
									${filter === f.toLowerCase() ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5'}
								`}
							>
								{f}
							</button>
						))}
					</div>
				</div>
				<div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar pb-24 md:pb-3">
					{filteredChats.map(chat => (
						<ChatListItem key={chat.id} chat={chat} isSelected={chat.id === selectedChatId} onClick={selectChat} />
					))}
					{filteredChats.length === 0 && (
						<div className="text-center text-slate-500 dark:text-slate-500 py-20 text-sm">No chats found.</div>
					)}
				</div>
			</div>

			{/* Chat Window */}
			{selectedChatId ? (
				<div className="flex-1 h-full min-w-0">
					{selectedChat && (
						<ChatWindow
							chat={selectedChat}
							messages={allMessages[selectedChatId] || []}
							onSendMessage={handleSendMessage}
							onReaction={(msgId: number, emoji: string) => handleReaction(selectedChatId, msgId, emoji)}
							onChatUpdate={(updates: any) => handleChatUpdate(selectedChatId, updates)}
							onBack={() => setSearchParams({})}
						/>
					)}
				</div>
			) : (
				/* Splash screen for desktop when no chat selected */
				<div className="hidden md:flex flex-1 glass-panel rounded-2xl items-center justify-center p-8 text-center">
					<div>
						<div className="h-32 w-32 bg-black/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200 dark:border-white/5">
							<MessageSquare size={64} className="text-slate-600 opacity-50" />
						</div>
						<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Select a Conversation</h3>
						<p className="text-slate-500 dark:text-slate-500 max-w-xs mx-auto">Choose a contact from the list to view your encrypted message history.</p>
					</div>
				</div>
			)}
		</div>
	);
};
