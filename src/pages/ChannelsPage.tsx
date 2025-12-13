import { useState, useEffect, useRef } from 'react';
import {
	Megaphone, Search, Send, Eye, ChevronLeft,
	MoreVertical, Lock, X,
	Mic, Paperclip, Smile, Pin,
	FileText, // Attachments
	MessageCircle, Hash, Image as ImageIcon,
	Settings, Users, Shield, Ban, Trash, Download, Edit2, Link
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useSearchParams } from 'react-router-dom';

// --- Types ---

interface MessageAttachment {
	type: 'image' | 'file' | 'audio' | 'poll';
	url: string;
	name?: string;
	size?: string;
	duration?: string;
	caption?: string; // For images
	tags?: string[]; // Admin tags
}

interface Reaction {
	emoji: string;
	count: number;
	active: boolean;
}

interface Comment {
	id: string | number;
	senderId: string | number;
	senderName: string;
	text: string;
	timestamp: string;
}

interface Message {
	id: string | number;
	senderId: string | number; // 'me', 'system', or userId
	senderName?: string;
	senderAvatar?: string;
	text: string;
	attachments?: MessageAttachment[];
	views: number;
	likes: number;
	timestamp: string;
	isSystem?: boolean;
	replyTo?: { id: string | number, text: string, sender: string };
	reactions?: Reaction[];
	comments?: Comment[];
	commentCount: number;
}

interface Channel {
	id: string;
	name: string;
	description: string;
	subscribers: number;
	isOwner: boolean;
	type: 'public' | 'private';
	unreadCount: number;
	color: string;

	// Advanced Settings
	signMessages?: boolean;
	restrictContent?: boolean;
	topics?: string[];
	linkedGroup?: string;

	lastMessage?: {
		text: string;
		timestamp: string;
		sender: string;
	};
	pinnedMessage?: {
		id: string | number;
		text: string;
	};
	messages: Message[];
}

// --- Mock Data ---

const MOCK_CHANNELS: Channel[] = [
	{
		id: 'ch-new',
		name: 'Creative Studio',
		subscribers: 12,
		description: 'A space for testing new designs and sharing creative assets.',
		isOwner: true,
		type: 'private',
		unreadCount: 0,
		color: 'from-pink-500 to-rose-500',
		topics: ['Design', 'Assets', 'Test'],
		lastMessage: { text: "Welcome to the studio!", timestamp: "Just now", sender: "You" },
		messages: [
			{
				id: 901, senderId: 'me', senderName: 'You',
				text: "Welcome to the studio! Feel free to test reactions and comments here.",
				views: 12, likes: 0, timestamp: 'Just now',
				reactions: [],
				commentCount: 0,
				comments: []
			}
		]
	},
	{
		id: 'ch1',
		name: 'GigMind Official',
		subscribers: 12400,
		description: 'Official news and updates from the GigMind platform. Stay tuned for features.',
		isOwner: false,
		type: 'public',
		unreadCount: 3,
		color: 'from-indigo-600 to-purple-600',
		topics: ['Platform', 'News', 'Updates'],
		lastMessage: { text: "New analytics dashboard is live!", timestamp: "10:42 AM", sender: "GigMind Team" },
		pinnedMessage: { id: 102, text: "Maintenance scheduled for Sunday, 3:00 AM EST." },
		messages: [
			{
				id: 101, senderId: 'system', senderName: 'GigMind Team', senderAvatar: 'G',
				text: "Welcome to the official GigMind channel! Here you'll find all the latest updates.",
				views: 15420, likes: 230, timestamp: 'Yesterday', isSystem: true,
				reactions: [{ emoji: '🔥', count: 120, active: true }, { emoji: '❤️', count: 45, active: false }],
				commentCount: 45,
				comments: []
			},
			{
				id: 103, senderId: 'system', senderName: 'GigMind Team', senderAvatar: 'G',
				text: "🚀 New analytics dashboard is live! Check your stats.",
				views: 4520, likes: 120, timestamp: '10:42 AM',
				commentCount: 12,
				attachments: [{ type: 'image', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', caption: 'Dashboard Preview' }]
			}
		]
	}
];

// --- Components ---

const EmojiPicker = ({ onSelect }: { onSelect: (emoji: string) => void }) => {
	const emojis = ['👍', '👎', '❤️', '🔥', '😀', '😂', '😍', '🤔', '😎', '🎉', '🚀', '👀', '💯', '✨', '💀', '🤡', '🤖', '👻', '💩', '🙌'];
	return (
		<div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 p-2 grid grid-cols-5 gap-1 w-64 animate-in zoom-in-95 duration-200 z-50">
			{emojis.map(emoji => (
				<button key={emoji} onClick={(e) => { e.stopPropagation(); onSelect(emoji); }} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-xl transition-colors">
					{emoji}
				</button>
			))}
		</div>
	);
};

const ImageStagingModal = ({ isOpen, onClose, onSend, initialUrl }: any) => {
	const [caption, setCaption] = useState('');
	const [tags, setTags] = useState('');
	// Use initialUrl if provided, otherwise random for testing
	const [previewUrl] = useState(initialUrl || `https://picsum.photos/600/400?random=${Date.now()}`);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
			<div className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
				{/* Image Preview */}
				<div className="flex-1 bg-black flex items-center justify-center p-4 min-h-[300px] relative">
					<img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
					<div className="absolute top-4 left-4">
						<span className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-md">Preview</span>
					</div>
				</div>

				{/* Controls */}
				<div className="w-full md:w-80 bg-white dark:bg-slate-900 p-6 flex flex-col border-l border-slate-200 dark:border-white/10">
					<div className="flex justify-between items-center mb-6">
						<h3 className="font-bold text-lg text-slate-900 dark:text-white">Send Photo</h3>
						<button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
					</div>

					<div className="space-y-4 flex-1">
						<div>
							<label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Caption</label>
							<textarea
								className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 resize-none text-slate-800 dark:text-slate-200"
								rows={4}
								placeholder="Write a caption..."
								value={caption}
								onChange={e => setCaption(e.target.value)}
							/>
						</div>

						<div>
							<div className="flex justify-between items-center mb-1.5">
								<label className="text-xs font-bold uppercase text-slate-500 block">Admin Tags</label>
								<span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 px-1.5 py-0.5 rounded font-bold uppercase">Admin Only</span>
							</div>
							<div className="bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl p-2 flex items-center gap-2">
								<Hash size={16} className="text-slate-400 shrink-0" />
								<input
									className="bg-transparent w-full text-sm focus:outline-none text-slate-800 dark:text-slate-200"
									placeholder="promo, design..."
									value={tags}
									onChange={e => setTags(e.target.value)}
								/>
							</div>
						</div>
					</div>

					<div className="mt-6 flex justify-end gap-3">
						<Button variant="ghost" onClick={onClose} className="text-slate-600 dark:text-slate-400">Cancel</Button>
						<Button
							onClick={() => onSend({ url: previewUrl, caption, tags: tags.split(',').filter(Boolean) })}
							className="bg-indigo-600 hover:bg-indigo-500 text-white"
						>
							<Send size={16} className="mr-2" /> Send
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

const ChannelFeed = ({ channel, onBack, onInfo, onUpdateChannel }: { channel: Channel, onBack: () => void, onInfo: () => void, onUpdateChannel: (c: Channel) => void }) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [inputText, setInputText] = useState('');
	const [activeAttachmentMenu, setActiveAttachmentMenu] = useState(false);
	const [activeEmojiPicker, setActiveEmojiPicker] = useState(false);

	const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | number | null>(null);

	const [showImageModal, setShowImageModal] = useState(false);
	const [pendingImageFile, setPendingImageFile] = useState<string | null>(null);

	const [localMessages, setLocalMessages] = useState<Message[]>(channel.messages);
	const [activeThread, setActiveThread] = useState<Message | null>(null);

	// Sync local messages
	useEffect(() => {
		setLocalMessages(channel.messages);
		setActiveThread(null); // Close thread on channel switch
	}, [channel.id]);

	// Auto scroll
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [localMessages]);

	// Close menus on click outside
	useEffect(() => {
		const handleClickOutside = () => {
			if (activeAttachmentMenu) setActiveAttachmentMenu(false);
			if (activeEmojiPicker) setActiveEmojiPicker(false);
			if (activeReactionMessageId) setActiveReactionMessageId(null);
		};
		window.addEventListener('click', handleClickOutside);
		return () => window.removeEventListener('click', handleClickOutside);
	}, [activeAttachmentMenu, activeEmojiPicker, activeReactionMessageId]);


	const updateParent = (msgs: Message[]) => {
		const last = msgs[msgs.length - 1];
		onUpdateChannel({
			...channel,
			messages: msgs,
			lastMessage: last ? { text: last.text || 'Attachment', sender: 'You', timestamp: last.timestamp } : channel.lastMessage
		});
	};

	const handleSend = () => {
		if (!inputText.trim()) return;
		const newMessage: Message = {
			id: Date.now(),
			senderId: 'me',
			text: inputText,
			views: 1,
			likes: 0,
			timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			commentCount: 0,
			comments: []
		};
		const newMsgs = [...localMessages, newMessage];
		setLocalMessages(newMsgs);
		updateParent(newMsgs);
		setInputText('');
		setActiveEmojiPicker(false);
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// In a real app, you'd upload here. For now we create a fake URL
			const objectUrl = URL.createObjectURL(file);
			setPendingImageFile(objectUrl);
			setShowImageModal(true);
		}
		// Reset input
		if (fileInputRef.current) fileInputRef.current.value = '';
		setActiveAttachmentMenu(false);
	};

	const handleCommitImage = (data: { url: string, caption: string, tags: string[] }) => {
		const newMessage: Message = {
			id: Date.now(),
			senderId: 'me',
			text: "",
			views: 0,
			likes: 0,
			timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			commentCount: 0,
			attachments: [{
				type: 'image',
				url: data.url,
				caption: data.caption,
				tags: data.tags
			}]
		};
		const newMsgs = [...localMessages, newMessage];
		setLocalMessages(newMsgs);
		updateParent(newMsgs);
		setShowImageModal(false);
		setPendingImageFile(null);
	};

	const handleReaction = (msgId: string | number, emoji: string) => {
		const updatedMsgs = localMessages.map(msg => {
			if (msg.id !== msgId) return msg;

			const existingReactionIndex = msg.reactions?.findIndex(r => r.emoji === emoji);
			let newReactions = msg.reactions ? [...msg.reactions] : [];

			if (existingReactionIndex !== undefined && existingReactionIndex !== -1) {
				const reaction = newReactions[existingReactionIndex];
				if (reaction.active) {
					newReactions[existingReactionIndex] = { ...reaction, count: reaction.count - 1, active: false };
					if (newReactions[existingReactionIndex].count <= 0) newReactions.splice(existingReactionIndex, 1);
				} else {
					newReactions[existingReactionIndex] = { ...reaction, count: reaction.count + 1, active: true };
				}
			} else {
				newReactions.push({ emoji, count: 1, active: true });
			}
			return { ...msg, reactions: newReactions };
		});
		setLocalMessages(updatedMsgs);
		// Update parent stealthily
		onUpdateChannel({ ...channel, messages: updatedMsgs });
		setActiveReactionMessageId(null);
	};

	const handleAddComment = (msgId: string | number, text: string) => {
		const updatedMsgs = localMessages.map(msg => {
			if (msg.id !== msgId) return msg;
			const newComment: Comment = {
				id: Date.now(),
				senderId: 'me',
				senderName: 'You',
				text: text,
				timestamp: 'Just now'
			};
			return {
				...msg,
				comments: [...(msg.comments || []), newComment],
				commentCount: (msg.commentCount || 0) + 1
			};
		});
		setLocalMessages(updatedMsgs);
		onUpdateChannel({ ...channel, messages: updatedMsgs });

		// Update active thread view if open
		if (activeThread?.id === msgId) {
			const updatedMsg = updatedMsgs.find(m => m.id === msgId);
			if (updatedMsg) setActiveThread(updatedMsg);
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const ThreadView = ({ message, onClose }: { message: Message, onClose: () => void }) => {
		const [commentText, setCommentText] = useState('');
		const bottomRef = useRef<HTMLDivElement>(null);

		useEffect(() => {
			bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
		}, [message.comments?.length]);

		return (
			<div className="absolute right-0 top-0 bottom-0 z-40 w-full sm:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-white/5 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
				<div className="p-4 border-b border-slate-200 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
					<h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
						<MessageCircle size={18} className="text-indigo-500" /> Thread
					</h3>
					<button onClick={onClose} className="bg-slate-200 dark:bg-white/10 p-1.5 rounded-full hover:bg-slate-300 dark:hover:bg-white/20 transition-colors">
						<X size={16} className="text-slate-700 dark:text-slate-200" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-4 space-y-6">
					{/* Parent Message */}
					<div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 text-sm shadow-sm">
						<div className="flex items-center gap-2 mb-3">
							<div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs text-white font-bold">{message.senderName?.[0] || 'U'}</div>
							<div>
								<span className="font-bold text-slate-800 dark:text-slate-100 block">{message.senderName || 'User'}</span>
								<span className="text-[10px] text-slate-400 font-medium">{message.timestamp}</span>
							</div>
						</div>
						<p className="text-slate-700 dark:text-slate-200 mb-3 leading-relaxed">{message.text || (message.attachments ? '' : '')}</p>
						{message.attachments && message.attachments[0].type === 'image' && (
							<img src={message.attachments[0].url} className="rounded-xl max-h-48 object-cover w-full opacity-95 shadow-sm border border-black/5" />
						)}
					</div>

					<div className="relative">
						<div className="absolute inset-0 flex items-center" aria-hidden="true">
							<div className="w-full border-t border-slate-200 dark:border-white/10"></div>
						</div>
						<div className="relative flex justify-center">
							<span className="bg-white dark:bg-slate-900 px-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Comments</span>
						</div>
					</div>

					{/* Comments */}
					<div className="space-y-4">
						{message.comments?.length === 0 && (
							<p className="text-center text-xs text-slate-400 italic py-6">No comments yet. Start the conversation!</p>
						)}
						{message.comments?.map(c => (
							<div key={c.id} className="flex gap-3 group">
								<div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">
									{c.senderName[0]}
								</div>
								<div className="flex-1">
									<div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl rounded-tl-none text-sm group-hover:bg-slate-100 dark:group-hover:bg-white/10 transition-colors">
										<div className="flex justify-between items-baseline mb-1">
											<span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{c.senderName}</span>
											<span className="text-[10px] text-slate-400">{c.timestamp}</span>
										</div>
										<p className="text-slate-800 dark:text-slate-200 leading-snug">{c.text}</p>
									</div>
								</div>
							</div>
						))}
						<div ref={bottomRef} />
					</div>
				</div>

				{/* Reply Input */}
				<div className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
					<div className="flex items-end gap-2 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-2 focus-within:border-indigo-500 shadow-sm transition-all duration-200">
						<textarea
							className="flex-1 bg-transparent px-2 py-1.5 text-sm focus:outline-none resize-none max-h-24 text-slate-800 dark:text-slate-200"
							placeholder="Write a reply..."
							rows={1}
							value={commentText}
							onChange={e => setCommentText(e.target.value)}
							onKeyDown={e => {
								if (e.key === 'Enter' && !e.shiftKey && commentText.trim()) {
									e.preventDefault();
									handleAddComment(message.id, commentText);
									setCommentText('');
								}
							}}
						/>
						<Button size="icon" className={`h-8 w-8 rounded-xl shrink-0 transition-all ${commentText.trim() ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`} disabled={!commentText.trim()} onClick={() => {
							if (commentText.trim()) {
								handleAddComment(message.id, commentText);
								setCommentText('');
							}
						}}>
							<Send size={14} className={commentText.trim() ? "translate-x-0.5 translate-y-0.5" : ""} />
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Hidden File Input for Native Picker */}
			<input
				type="file"
				ref={fileInputRef}
				className="hidden"
				accept="image/*"
				onChange={handleFileSelect}
			/>

			{/* Chat Header */}
			<div className="h-16 px-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between shrink-0 z-20">
				<div className="flex items-center gap-3 overflow-hidden">
					<Button size="icon" variant="ghost" className="md:hidden -ml-2 text-slate-500" onClick={onBack}>
						<ChevronLeft size={24} />
					</Button>

					<div onClick={onInfo} className="flex items-center gap-3 cursor-pointer group">
						<div className={`h-10 w-10 rounded-full bg-gradient-to-br ${channel.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
							{channel.name[0]}
						</div>
						<div className="min-w-0">
							<h3 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors flex items-center gap-2">
								{channel.name}
								{channel.isOwner && <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Admin</span>}
							</h3>
							<p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
								{channel.subscribers.toLocaleString()} subscribers
							</p>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-1">
					<Button size="icon" variant="ghost" className="text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-white/10 rounded-full h-9 w-9">
						<Search size={20} />
					</Button>
					<Button size="icon" variant="ghost" onClick={onInfo} className="text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-white/10 rounded-full h-9 w-9">
						<MoreVertical size={20} />
					</Button>
				</div>
			</div>

			{/* Pinned Message */}
			{channel.pinnedMessage && (
				<div className="px-4 py-2 bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-medium text-indigo-600 dark:text-indigo-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10">
					<div className="flex items-center gap-2 truncate">
						<Pin size={14} className="flex-shrink-0" />
						<div className="flex flex-col truncate">
							<span className="font-bold text-[10px] uppercase text-slate-500">Pinned Message</span>
							<span className="truncate">{channel.pinnedMessage.text}</span>
						</div>
					</div>
					<X size={14} className="text-slate-400 hover:text-slate-600 ml-4 flex-shrink-0" />
				</div>
			)}

			<div className="flex-1 relative overflow-hidden flex">
				{/* Messages Area */}
				<div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-100/50 dark:bg-black/20 no-scrollbar">

					{localMessages.length === 0 && (
						<div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
							<Megaphone size={40} className="mb-2" />
							<span className="text-sm">No messages yet</span>
						</div>
					)}

					<div className="flex justify-center my-4">
						<span className="bg-slate-200/60 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
							Today
						</span>
					</div>

					{localMessages.map((msg) => {
						return (
							<div
								key={msg.id}
								className={`max-w-[85%] md:max-w-[70%] relative group animate-in slide-in-from-bottom-2 fade-in duration-300 ${msg.senderId === 'me' ? 'ml-auto' : 'mr-auto'} mb-6`}
							>
								<div className={`
									p-3 rounded-2xl shadow-sm relative overflow-visible backdrop-blur-md border
									${msg.senderId === 'me'
										? 'bg-indigo-600 text-white rounded-br-sm border-indigo-500'
										: 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm border-slate-200 dark:border-white/5'
									}
								`}>
									{/* Tag for Admins */}
									{msg.senderId !== 'me' && <p className="text-[10px] font-bold text-indigo-500 mb-1">{msg.senderName}</p>}

									{/* Attachments */}
									{msg.attachments?.map((att, i) => (
										<div key={i} className="mb-2 rounded-xl overflow-hidden">
											{att.type === 'image' && (
												<div className="relative">
													<img src={att.url} alt="Attachment" className="w-full h-auto object-cover max-h-80" />
													{att.caption && <div className="p-2 text-sm italic opacity-90">{att.caption}</div>}
													{channel.isOwner && att.tags && att.tags.length > 0 && (
														<div className="absolute top-2 right-2 flex gap-1">
															{att.tags.map(t => <span key={t} className="bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur">#{t}</span>)}
														</div>
													)}
												</div>
											)}
										</div>
									))}

									{/* Message Text */}
									{msg.text && <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${msg.attachments ? 'mt-1' : ''}`}>{msg.text}</p>}

									{/* Metadata Footer */}
									<div className={`flex items-center justify-between mt-2 select-none pt-2 border-t ${msg.senderId === 'me' ? 'border-white/20 text-indigo-100' : 'border-slate-100 dark:border-white/5 text-slate-400'}`}>
										<div className="flex items-center gap-3">
											{/* Comment Count - Triggers Thread */}
											<button
												onClick={(e) => { e.stopPropagation(); setActiveThread(msg); }}
												className="flex items-center gap-1 text-[11px] font-bold hover:scale-105 transition-transform"
											>
												<MessageCircle size={14} /> {msg.commentCount > 0 ? `${msg.commentCount} Comments` : 'Comment'}
											</button>

											{/* Visible Reaction Button */}
											<div className="relative">
												<button
													onClick={(e) => { e.stopPropagation(); setActiveReactionMessageId(activeReactionMessageId === msg.id ? null : msg.id); }}
													className="flex items-center gap-1 text-[11px] font-bold hover:scale-105 transition-transform hover:text-indigo-300"
												>
													<Smile size={14} />
												</button>
												{activeReactionMessageId === msg.id && (
													<div className="absolute z-50 bottom-6 left-0 animate-in zoom-in-95 duration-150">
														<EmojiPicker onSelect={(emoji) => handleReaction(msg.id, emoji)} />
													</div>
												)}
											</div>
										</div>

										<div className="flex items-center gap-2">
											<span className="text-[10px] font-medium">{msg.timestamp}</span>
											{msg.senderId !== 'me' && <span className="flex items-center text-[10px] gap-0.5"><Eye size={10} /> {msg.views}</span>}
										</div>
									</div>
								</div>

								{/* Reactions Display */}
								{msg.reactions && msg.reactions.length > 0 && (
									<div className={`absolute -bottom-3 ${msg.senderId === 'me' ? 'right-0' : 'left-0'} flex gap-1 z-10 flex-wrap max-w-full justify-${msg.senderId === 'me' ? 'end' : 'start'}`}>
										{msg.reactions.map((r, i) => (
											<div
												key={i}
												onClick={() => handleReaction(msg.id, r.emoji)}
												className={`
													rounded-full px-1.5 py-0.5 text-[10px] shadow-sm flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform border backdrop-blur-md
													${r.active
														? 'bg-indigo-100 border-indigo-200 text-indigo-700 dark:bg-indigo-900/80 dark:border-indigo-500/30'
														: 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
													}
												`}
											>
												<span>{r.emoji}</span>
												<span className="font-bold">{r.count}</span>
											</div>
										))}
									</div>
								)}
							</div>
						);
					})}
					<div ref={messagesEndRef} />
				</div>

				{/* Thread Side Panel Drawer */}
				{activeThread && (
					<ThreadView message={activeThread} onClose={() => setActiveThread(null)} />
				)}
			</div>

			{/* Input Area */}
			<div className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 z-20 sticky bottom-0">
				{channel.isOwner ? (
					<div className="relative">
						{/* Attachments Menu Popover */}
						{activeAttachmentMenu && (
							<div className="absolute bottom-16 left-0 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 p-2 min-w-[180px] animate-in slide-in-from-bottom-5 fade-in duration-200 flex flex-col gap-1 z-50">
								<button
									onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
									className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left text-slate-700 dark:text-slate-200 font-medium text-sm"
								>
									<div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><ImageIcon size={18} /></div>
									Photo or Video
								</button>
								<button
									onClick={(e) => { e.stopPropagation(); }}
									className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-left text-slate-700 dark:text-slate-200 font-medium text-sm opacity-50 cursor-not-allowed"
								>
									<div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><FileText size={18} /></div>
									File (Coming Soon)
								</button>
							</div>
						)}

						{/* Emoji Picker */}
						{activeEmojiPicker && (
							<div className="absolute bottom-16 left-0 sm:left-12 z-50">
								<EmojiPicker onSelect={(emoji) => { setInputText(prev => prev + emoji); }} />
							</div>
						)}

						<div className="bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-2xl flex items-end p-2 gap-2 shadow-inner transition-colors focus-within:bg-white dark:focus-within:bg-black/50 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20">
							<Button
								size="icon"
								variant="ghost"
								onClick={(e) => { e.stopPropagation(); setActiveEmojiPicker(!activeEmojiPicker); setActiveAttachmentMenu(false); }}
								className={`rounded-xl h-10 w-10 shrink-0 transition-colors ${activeEmojiPicker ? 'text-indigo-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
							>
								<Smile size={22} />
							</Button>

							<textarea
								value={inputText}
								onChange={e => setInputText(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Broadcast a message..."
								className="flex-1 bg-transparent border-none focus:ring-0 p-2 min-h-[44px] max-h-32 resize-none text-slate-900 dark:text-white placeholder:text-slate-500 text-sm leading-6"
								rows={1}
								style={{ height: 'auto' }}
							/>

							<Button
								size="icon"
								variant="ghost"
								onClick={(e) => { e.stopPropagation(); setActiveAttachmentMenu(!activeAttachmentMenu); setActiveEmojiPicker(false); }}
								className={`rounded-xl h-10 w-10 shrink-0 transition-colors ${activeAttachmentMenu ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
							>
								<Paperclip size={20} />
							</Button>

							{inputText.trim() ? (
								<Button onClick={handleSend} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 w-10 shrink-0 shadow-lg shadow-indigo-500/20 animate-in zoom-in-50 duration-200 p-0 flex items-center justify-center">
									<Send size={18} className="translate-x-0.5 translate-y-0.5" />
								</Button>
							) : (
								<Button size="icon" variant="ghost" className="text-slate-400 hover:text-red-500 rounded-xl h-10 w-10 shrink-0">
									<Mic size={22} />
								</Button>
							)}
						</div>
					</div>
				) : (
					<div className="py-4 text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 text-xs font-bold uppercase tracking-wider">
							<Lock size={12} /> Read Only Channel
						</div>
					</div>
				)}
			</div>

			{/* Modals */}
			{showImageModal && <ImageStagingModal isOpen={showImageModal} onClose={() => setShowImageModal(false)} onSend={handleCommitImage} initialUrl={pendingImageFile} />}
		</>
	);
};

// --- Modal Components ---

const ChannelInfoModal = ({ channel, onClose }: { channel: Channel, onClose: () => void }) => {
	const [activeTab, setActiveTab] = useState<'overview' | 'media' | 'files' | 'settings'>('overview');
	const isOwner = channel.isOwner;

	return (
		<div className="fixed inset-0 z-50 flex justify-end backdrop-blur-sm bg-black/20 animate-in fade-in duration-200" onClick={onClose}>
			<div
				className="w-full md:w-[400px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl h-full shadow-2xl border-l border-slate-200 dark:border-white/5 flex flex-col animate-in slide-in-from-right duration-300"
				onClick={e => e.stopPropagation()}
			>
				{/* Header */}
				<div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-white/5 shrink-0">
					<h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">Channel Info</h2>
					<button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
						<X size={20} className="text-slate-500" />
					</button>
				</div>

				{/* Channel Profile Header */}
				<div className="p-6 flex flex-col items-center border-b border-slate-200 dark:border-white/5 shrink-0">
					<div className={`w-24 h-24 rounded-full bg-gradient-to-br ${channel.color} flex items-center justify-center text-white text-3xl font-bold shadow-xl mb-4`}>
						{channel.name[0]}
					</div>
					<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 text-center">{channel.name}</h3>
					<p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{channel.subscribers.toLocaleString()} subscribers</p>
				</div>

				{/* Tabs */}
				<div className="flex p-2 gap-1 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 shrink-0">
					{['overview', 'media', 'files'].map(tab => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab as any)}
							className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-indigo-500 shadow-sm' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-white/5'}`}
						>
							{tab}
						</button>
					))}
					{isOwner && (
						<button
							onClick={() => setActiveTab('settings')}
							className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'settings' ? 'bg-white dark:bg-slate-700 text-indigo-500 shadow-sm' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-white/5'}`}
						>
							<Settings size={14} className="mx-auto" />
						</button>
					)}
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-6">

					{/* OVERVIEW TAB */}
					{activeTab === 'overview' && (
						<div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
							<div className="space-y-2">
								<h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</h4>
								<p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
									{channel.description || "No description provided."}
								</p>
							</div>

							<div className="space-y-2">
								<h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Invite Link</h4>
								<div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-xl border border-indigo-100 dark:border-indigo-500/20 group cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
									<Link size={16} className="text-indigo-500" />
									<span className="text-xs font-mono text-indigo-600 dark:text-indigo-300 flex-1 truncate">t.me/{channel.id}</span>
									<div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-indigo-500">COPY</div>
								</div>
							</div>

							<div className="space-y-3">
								<h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notifications</h4>
								<div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
									<span className="text-sm font-medium text-slate-700 dark:text-slate-200">Mute Channel</span>
									<div className="w-10 h-5 bg-slate-200 dark:bg-white/10 rounded-full relative cursor-pointer">
										<div className="w-4 h-4 bg-white rounded-full shadow absolute left-0.5 top-0.5 transition-transform" />
									</div>
								</div>
							</div>
						</div>
					)}

					{/* MEDIA TAB */}
					{activeTab === 'media' && (
						<div className="animate-in slide-in-from-bottom-2 duration-300">
							<div className="grid grid-cols-3 gap-2">
								{[...Array(9)].map((_, i) => (
									<div key={i} className="aspect-square rounded-lg bg-slate-100 dark:bg-white/5 overflow-hidden relative group cursor-pointer">
										<img
											src={`https://picsum.photos/200?random=${i + 10}`}
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
										/>
										<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
									</div>
								))}
							</div>
						</div>
					)}

					{/* FILES TAB */}
					{activeTab === 'files' && (
						<div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300">
							{[1, 2, 3].map(i => (
								<div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-colors cursor-pointer group">
									<div className="w-10 h-10 rounded-lg bg-red-100 text-red-500 flex items-center justify-center shrink-0">
										<FileText size={20} />
									</div>
									<div className="flex-1 min-w-0">
										<h5 className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-indigo-500 transition-colors">Project_Brief_v{i}.pdf</h5>
										<p className="text-[10px] text-slate-400">2.4 MB • 12 Oct 2024</p>
									</div>
									<Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-indigo-500">
										<Download size={16} />
									</Button>
								</div>
							))}
						</div>
					)}

					{/* SETTINGS TAB (OWNER ONLY) */}
					{activeTab === 'settings' && isOwner && (
						<div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
							<div className="space-y-3">
								<h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
									<Shield size={12} /> Admin Controls
								</h4>

								<button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-left">
									<Edit2 size={16} className="text-slate-500" />
									<span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">Edit Channel Info</span>
								</button>
								<button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-left">
									<Users size={16} className="text-slate-500" />
									<span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">Subscribers & Admins</span>
									<span className="text-xs font-bold bg-slate-200 dark:bg-white/20 px-2 py-0.5 rounded-full">{channel.subscribers}</span>
								</button>
								<button className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-left">
									<Ban size={16} className="text-slate-500" />
									<span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">Blacklist</span>
								</button>
							</div>

							<div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/5">
								<h4 className="text-xs font-bold text-red-500 uppercase tracking-widest">Danger Zone</h4>
								<button className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-left group">
									<Trash size={16} className="text-red-500" />
									<span className="text-sm font-medium text-red-600 dark:text-red-400 flex-1">Delete Channel</span>
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

// --- Main Page Component ---

export const ChannelsModule = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const selectedChannelId = searchParams.get('id');

	// State
	const [channels, setChannels] = useState<Channel[]>(MOCK_CHANNELS);
	const [searchTerm, setSearchTerm] = useState('');
	const [showInfoModal, setShowInfoModal] = useState(false);

	// Computed
	const selectedChannel = channels.find(c => c.id === selectedChannelId) || null;
	const filteredChannels = channels.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

	// Actions
	const handleSelectChannel = (channel: Channel) => {
		setSearchParams({ id: channel.id });
		setShowInfoModal(false); // Close info if switching channels
	};

	const handleUpdateChannel = (updatedChannel: Channel) => {
		setChannels(prev => prev.map(c => c.id === updatedChannel.id ? updatedChannel : c));
	}

	return (
		<div className="h-full w-full flex flex-col md:flex-row gap-4 p-0 md:p-4 overflow-hidden">
			{/* Left Side: Channel List */}
			<div className={`
				w-full md:w-[380px] lg:w-[420px] flex-shrink-0 flex flex-col h-full
				glass-panel rounded-none md:rounded-2xl overflow-hidden shadow-2xl transition-all duration-300
				${selectedChannel ? 'hidden md:flex' : 'flex'}
			`}>
				{/* List Header */}
				<div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 z-20">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
							<Megaphone className="text-indigo-500" /> Channels
						</h2>
					</div>

					<div className="relative group">
						<Search size={18} className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
						<input
							type="text"
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							placeholder="Search channels..."
							className="w-full bg-slate-100 dark:bg-black/30 border-transparent focus:bg-white dark:focus:bg-black/50 border focus:border-indigo-500 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-500 shadow-inner"
						/>
					</div>
				</div>

				{/* List Content */}
				<div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
					{filteredChannels.map(channel => (
						<div
							key={channel.id}
							onClick={() => handleSelectChannel(channel)}
							className={`
								group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-transparent
								${selectedChannelId === channel.id
									? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-200 dark:border-indigo-500/30'
									: 'hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-white/5'
								}
							`}
						>
							<div className={`h-14 w-14 rounded-full bg-gradient-to-br ${channel.color} flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md`}>
								{channel.name[0]}
							</div>
							<div className="flex-1 min-w-0 overflow-hidden">
								<div className="flex justify-between items-center mb-0.5">
									<h4 className={`text-[15px] font-bold truncate ${selectedChannelId === channel.id ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-200'}`}>
										{channel.name}
									</h4>
									{channel.lastMessage && <span className="text-[11px] font-medium text-slate-400 flex-shrink-0 ml-2">{channel.lastMessage.timestamp}</span>}
								</div>
								<div className="flex justify-between items-center text-sm">
									<p className="text-slate-500 dark:text-slate-400 truncate pr-2 font-medium">{channel.lastMessage?.text || 'No messages'}</p>
									{channel.unreadCount > 0 && <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center shadow">{channel.unreadCount}</span>}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Right Side: Chat Area */}
			<div className={`
				flex-1 h-full glass-panel md:rounded-2xl overflow-hidden shadow-2xl flex flex-col relative transition-all duration-300
				${selectedChannel ? 'flex' : 'hidden md:flex'}
			`}>
				{selectedChannel ? (
					<ChannelFeed
						channel={selectedChannel}
						onBack={() => setSearchParams({})}
						onInfo={() => setShowInfoModal(true)}
						onUpdateChannel={handleUpdateChannel}
					/>
				) : (
					<div className="h-full w-full flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50 dark:bg-white/5">
						<Megaphone size={48} className="opacity-20 mb-6" />
						<h3 className="text-xl font-bold text-slate-600 dark:text-slate-300 mb-2">Select a Channel</h3>
					</div>
				)}
			</div>

			{/* Info Modal */}
			{showInfoModal && selectedChannel && (
				<ChannelInfoModal
					channel={selectedChannel}
					onClose={() => setShowInfoModal(false)}
				/>
			)}
		</div>
	);
};
