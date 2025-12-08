import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Users, Search, Phone, Video, MoreVertical, Send, Smile, Mic, X, Image as ImageIcon, Sticker as StickerIcon, CornerUpLeft, Heart, Palette } from 'lucide-react';
import { Button } from '../ui/button';
import { ChatProfileModal } from './ChatProfileModal';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🔥', '🎉', '👻', '👀', '💯', '🙏', '🚀', '💅', '💩', '🦄'];
const STICKERS = [
	'https://api.dicebear.com/7.x/bottts/svg?seed=Buddy',
	'https://api.dicebear.com/7.x/bottts/svg?seed=Love',
	'https://api.dicebear.com/7.x/bottts/svg?seed=Happy',
	'https://api.dicebear.com/7.x/bottts/svg?seed=Wow',
	'https://api.dicebear.com/7.x/bottts/svg?seed=Sad'
];

const BACKGROUNDS = [
	{ name: 'Default', class: 'bg-slate-50 dark:bg-black/20' },
	{ name: 'Sunset', class: 'bg-gradient-to-br from-orange-900/20 to-rose-900/20' },
	{ name: 'Ocean', class: 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20' },
	{ name: 'Forest', class: 'bg-gradient-to-br from-emerald-900/20 to-teal-900/20' },
	{ name: 'Midnight', class: 'bg-slate-50 dark:bg-slate-950' },
];

export const ChatWindow = ({ chat, messages, onSendMessage, onReaction, onChatUpdate, onBack }: any) => {
	const [inputText, setInputText] = useState('');
	const [showProfile, setShowProfile] = useState(false);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [recordingTime, setRecordingTime] = useState(0);
	const [replyTo, setReplyTo] = useState<any>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSend = (text = inputText, type = 'text') => {
		if (text.trim() || type !== 'text') {
			onSendMessage(chat.id, text, { type, replyToId: replyTo?.id });
			setInputText('');
			setShowEmojiPicker(false);
			setReplyTo(null);
		}
	};

	const startRecording = () => {
		setIsRecording(true);
		setRecordingTime(0);
		// Mock recording timer
		const timer = setInterval(() => {
			setRecordingTime(prev => {
				if (prev >= 5) { // Auto send after 5 seconds for demo
					clearInterval(timer);
					handleSend('Voice Message (5s)', 'audio');
					setIsRecording(false);
					return 0;
				}
				return prev + 1;
			});
		}, 1000);
	};

	const cancelRecording = () => {
		setIsRecording(false);
		setRecordingTime(0);
	};

	const MessageBubble = ({ message }: any) => {
		const isReply = !!message.replyToId;
		const repliedMessage = isReply ? messages.find((m: any) => m.id === message.replyToId) : null;

		return (
			<div className={`flex mb-4 ${message.isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300 group relative`}>
				<button
					onClick={() => setReplyTo(message)}
					className={`absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-slate-100 dark:bg-white/20 text-slate-300 opacity-0 group-hover:opacity-100 transition-all ${message.isMe ? '-left-12' : '-right-12'}`}
					title="Reply"
				>
					<CornerUpLeft size={16} />
				</button>

				<div className={`max-w-[75%] px-5 py-4 rounded-3xl shadow-md backdrop-blur-sm relative ${message.isMe
					? 'bg-indigo-600/90 text-slate-900 dark:text-white rounded-br-sm border border-indigo-500/50 shadow-[0_4px_15px_rgba(99,102,241,0.3)]'
					: 'bg-white/10 dark:bg-white/10 text-slate-800 dark:text-slate-100 rounded-tl-sm border border-slate-200 dark:border-white/10'
					}`}
					onDoubleClick={() => onReaction(message.id, '❤️')}
				>
					{repliedMessage && (
						<div className={`text-xs mb-2 p-2 rounded-lg border-l-2 ${message.isMe ? 'bg-slate-50 dark:bg-black/20 border-white/30' : 'bg-white/5 dark:bg-white/5 border-indigo-400/50'}`}>
							<div className="font-bold opacity-70 mb-0.5">{repliedMessage.sender}</div>
							<div className="truncate opacity-50">{repliedMessage.text}</div>
						</div>
					)}

					{!message.isMe && <div className="text-xs font-bold text-indigo-300 mb-1">{message.sender}</div>}

					{message.type === 'image' && (
						<div className="mb-2 rounded-lg overflow-hidden">
							<img src={message.text} alt="Shared" className="max-w-full h-auto" />
						</div>
					)}

					{message.type === 'sticker' && (
						<div className="mb-2">
							<img src={message.text} alt="Sticker" className="w-24 h-24 object-contain" />
						</div>
					)}

					{message.type === 'audio' && (
						<div className="flex items-center gap-3 min-w-[150px]">
							<div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/20 flex items-center justify-center">
								<Send size={14} className="ml-0.5" />
							</div>
							<div className="flex-1 h-8 flex items-center gap-0.5">
								{[1, 2, 3, 4, 5, 3, 2, 4, 6, 3].map((h, i) => (
									<div key={i} className="w-1 bg-white/5 dark:bg-white/50 rounded-full animate-pulse" style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }}></div>
								))}
							</div>
							<span className="text-xs font-mono opacity-80">0:05</span>
						</div>
					)}

					{(message.type === 'text' || !message.type) && (
						<p className="text-base leading-relaxed font-medium">{message.text}</p>
					)}

					<div className={`text-[10px] mt-2 font-bold opacity-70 ${message.isMe ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-400'} text-right`}>{message.time}</div>

					{/* Reactions */}
					{message.reactions && Object.keys(message.reactions).length > 0 && (
						<div className="absolute -bottom-2 right-4 flex gap-1">
							{Object.entries(message.reactions).map(([emoji, count]: any) => (
								<div key={emoji} className="bg-slate-800 text-xs px-1.5 py-0.5 rounded-full border border-white/10 shadow-lg flex items-center gap-1">
									<span>{emoji}</span>
									<span className="font-bold text-slate-600 dark:text-slate-400">{count}</span>
								</div>
							))}
						</div>
					)}

					{/* Mobile Friendly Reply Button */}
					<button
						onClick={(e) => {
							e.stopPropagation();
							setReplyTo(message);
						}}
						className={`absolute bottom-1 ${message.isMe ? 'left-2' : 'right-2'} p-1.5 rounded-full bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white/50 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-black/40 transition-all opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100`}
					>
						<CornerUpLeft size={12} />
					</button>
				</div>
			</div>
		);
	};

	return (
		<div className="glass-panel flex flex-col h-full rounded-none md:rounded-2xl overflow-hidden overflow-x-hidden relative shadow-2xl pb-0 border-x-0 md:border-x border-y-0 md:border-y min-h-0">
			{/* Header */}
			<div className="px-4 py-3 md:py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between sticky top-0 z-10 relative">
				{showBackgroundPicker && (
					<div className="absolute top-full right-4 mt-2 p-3 glass-panel rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 z-50 w-48">
						<h5 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2 px-2">Backgrounds</h5>
						<div className="space-y-1">
							{BACKGROUNDS.map(bg => (
								<button
									key={bg.name}
									onClick={() => {
										onChatUpdate({ background: bg.class });
										setShowBackgroundPicker(false);
									}}
									className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 hover:bg-white/10 ${chat.background === bg.class ? 'text-indigo-300 bg-white/5 dark:bg-white/5' : 'text-slate-300'}`}
								>
									<div className={`w-4 h-4 rounded-full border border-white/10 ${bg.class}`}></div>
									{bg.name}
								</button>
							))}
						</div>
					</div>
				)}
				<div className="flex items-center gap-3 flex-1 min-w-0">
					<Button size="icon" variant="ghost" onClick={onBack} className="md:hidden rounded-full hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white" title="Back to list">
						<ChevronLeft size={24} />
					</Button>

					<div
						className="flex items-center gap-3 cursor-pointer hover:bg-white/5 dark:bg-white/5 p-2 rounded-xl transition-all flex-1 min-w-0 group"
						onClick={() => setShowProfile(true)}
					>
						<div className={`h-11 w-11 rounded-full flex items-center justify-center text-lg font-bold text-slate-900 dark:text-white flex-shrink-0 shadow-lg border border-white/10 group-hover:scale-105 transition-transform ${chat.isGroup ? 'bg-emerald-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
							{chat.isGroup ? <Users size={20} /> : chat.name[0]}
						</div>
						<div className="min-w-0">
							<h3 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-200 transition-colors">{chat.name}</h3>
							<div className="flex items-center gap-1.5">
								<span className={`w-2 h-2 rounded-full ${chat.isGroup ? 'bg-emerald-500' : 'bg-indigo-400'} animate-pulse`}></span>
								<p className="text-xs text-slate-600 dark:text-slate-400 truncate font-medium">
									{chat.isGroup ? `${chat.tags?.length + 3 || 3} members` : 'Online'}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-1">
					<Button size="icon" variant="ghost" onClick={() => setShowBackgroundPicker(!showBackgroundPicker)} className={`rounded-full hover:bg-white/10 transition-colors ${showBackgroundPicker ? 'text-indigo-400 bg-white/5 dark:bg-white/5' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}><Palette size={20} /></Button>
					<Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white"><Search size={20} /></Button>
					<Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hidden sm:flex"><Phone size={20} /></Button>
					<Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hidden sm:flex"><Video size={20} /></Button>
					<Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white"><MoreVertical size={20} /></Button>
				</div>
			</div>

			{/* Messages */}
			<div className={`flex-1 p-4 md:p-6 overflow-y-auto no-scrollbar overflow-x-hidden flex flex-col min-h-0 ${chat.background || 'bg-slate-50 dark:bg-black/20'} transition-colors duration-500`}>
				{messages.map((msg: any) => <MessageBubble key={msg.id} message={msg} />)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input Area */}
			<div className="p-4 bg-white/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-white/5 flex-shrink-0 backdrop-blur-xl sticky bottom-0 z-30 overflow-hidden">
				{replyTo && (
					<div className="flex items-center justify-between bg-white/5 dark:bg-white/5 p-3 rounded-t-2xl -mt-4 border-b border-slate-200 dark:border-white/5 animate-in slide-in-from-bottom-2 mx-4">
						<div className="flex items-center gap-3 overflow-hidden">
							<CornerUpLeft size={16} className="text-indigo-400 flex-shrink-0" />
							<div className="border-l-2 border-indigo-500 pl-2">
								<div className="text-xs font-bold text-indigo-300">Replying to {replyTo.sender}</div>
								<div className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[200px]">{replyTo.type === 'text' || !replyTo.type ? replyTo.text : `[${replyTo.type}]`}</div>
							</div>
						</div>
						<Button size="icon" variant="ghost" onClick={() => setReplyTo(null)} className="h-8 w-8 hover:bg-white/10 rounded-full">
							<X size={14} className="text-slate-600 dark:text-slate-400" />
						</Button>
					</div>
				)}

				{showEmojiPicker && (
					<div className="absolute bottom-full mb-4 left-4 p-4 glass-panel rounded-2xl shadow-2xl w-72 animate-in slide-in-from-bottom-5">
						<h5 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-3">Stickers</h5>
						<div className="grid grid-cols-4 gap-2 mb-4">
							{STICKERS.map((sticker, i) => (
								<button key={i} onClick={() => handleSend(sticker, 'sticker')} className="hover:scale-110 transition-transform">
									<img src={sticker} alt="Sticker" className="w-12 h-12" />
								</button>
							))}
						</div>
						<h5 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-3 border-t border-slate-200 dark:border-white/5 pt-3">Emojis</h5>
						<div className="grid grid-cols-8 gap-1">
							{EMOJIS.map((emoji) => (
								<button
									key={emoji}
									onClick={() => setInputText(prev => prev + emoji)}
									className="text-xl hover:bg-white/10 rounded p-1 transition-colors"
								>
									{emoji}
								</button>
							))}
						</div>
					</div>
				)}

				<div className="flex gap-3 items-end w-full">
					<Button
						size="icon"
						variant="ghost"
						onClick={() => setShowEmojiPicker(!showEmojiPicker)}
						className={`rounded-xl h-14 w-14 shrink-0 ${showEmojiPicker ? 'text-indigo-400 bg-indigo-500/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-white/5 dark:bg-white/5'}`}
					>
						<Smile size={24} />
					</Button>

					{isRecording ? (
						<div className="flex-1 bg-red-900/20 border border-red-500/30 rounded-2xl px-5 py-4 flex items-center justify-between animate-pulse">
							<div className="flex items-center gap-3 text-red-400 font-bold">
								<div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
								Recording {recordingTime}s...
							</div>
							<Button size="sm" variant="ghost" onClick={cancelRecording} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white">
								<X size={20} />
								<span className="ml-2">Cancel</span>
							</Button>
						</div>
					) : (
						<textarea
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							onKeyPress={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									handleSend();
								}
							}}
							className="flex-1 bg-slate-100 dark:bg-black/40 border border-white/10 rounded-3xl px-5 py-4 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm min-h-[56px] max-h-32 resize-none leading-relaxed transition-colors shadow-inner no-scrollbar overflow-x-hidden break-words"
							placeholder="Broadcast secure message..."
							rows={1}
						/>
					)}

					{inputText.trim() ? (
						<Button
							onClick={() => handleSend()}
							className="h-14 w-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white shadow-lg shadow-indigo-600/20 glass-button-primary"
						>
							<Send size={22} className="translate-x-0.5 translate-y-[-1px]" />
						</Button>
					) : (
						<Button
							onClick={isRecording ? () => { } : startRecording} // Click to start, logic handles auto-send
							className={`h-14 w-14 rounded-2xl shadow-lg transition-all ${isRecording ? 'bg-red-500 text-slate-900 dark:text-white animate-pulse' : 'bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-700'}`}
						>
							<Mic size={22} />
						</Button>
					)}
				</div>
			</div>

			{showProfile && <ChatProfileModal chat={chat} onClose={() => setShowProfile(false)} />}
		</div>
	);
};
