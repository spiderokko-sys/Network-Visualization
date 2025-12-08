import React, { useState } from 'react';
import {
	Megaphone, Plus, Search, Send, Eye, ThumbsUp, ChevronLeft,
	MoreVertical, Globe, Lock, X, Share2, Edit2, Image as ImageIcon
} from 'lucide-react';
import { Button } from './ui/button';

const MOCK_CHANNELS = [
	{
		id: 'ch1',
		name: 'GigMind Official Updates',
		subscribers: 12400,
		description: 'Official news and updates from the GigMind platform. Stay tuned for features.',
		isOwner: false,
		type: 'public',
		posts: [
			{ id: 101, text: "🚀 New analytics dashboard is live! Check your stats.", views: 4520, likes: 120, date: '2h ago' },
			{ id: 102, text: "Maintenance scheduled for Sunday, 3:00 AM EST.", views: 8900, likes: 45, date: '1d ago' }
		]
	},
	{
		id: 'ch2',
		name: 'Joe\'s Coffee Specials',
		subscribers: 850,
		description: 'Daily specials and secret menu items for our loyal customers.',
		isOwner: true,
		type: 'public',
		posts: [
			{ id: 201, text: "☕️ 2-for-1 Lattes today until 2 PM! Show this post.", views: 320, likes: 85, date: '1h ago' },
			{ id: 202, text: "Fresh croissants just came out of the oven 🥐", views: 110, likes: 40, date: '4h ago' }
		]
	},
	{
		id: 'ch3',
		name: 'Local Business Network',
		subscribers: 340,
		description: 'Private channel for local business owners to coordinate events.',
		isOwner: false,
		type: 'private',
		posts: [
			{ id: 301, text: "Don't forget the town hall meeting tomorrow.", views: 200, likes: 15, date: '5h ago' }
		]
	}
];

const CreateChannelModal = ({ onClose, onSave }: any) => {
	const [form, setForm] = useState({ name: '', description: '', type: 'public' });

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
			<div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar">
				<div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-900/50 backdrop-blur-xl z-10 pb-4 border-b border-white/5">
					<h3 className="text-xl font-bold text-white">Create Channel</h3>
					<button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X /></button>
				</div>
				<div className="space-y-6">
					<div className="flex justify-center mb-2">
						<div className="h-24 w-24 rounded-full glass-card flex items-center justify-center border border-dashed border-slate-600 cursor-pointer hover:border-indigo-500 hover:bg-white/5 transition-all group">
							<div className="text-slate-500 group-hover:text-indigo-400 transition-colors"><ImageIcon size={32} /></div>
						</div>
					</div>

					<div>
						<label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Channel Name</label>
						<input className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none transition-colors" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Announcements" />
					</div>

					<div>
						<label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Description</label>
						<textarea className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 focus:outline-none resize-none transition-colors" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What is this channel about?" />
					</div>

					<div>
						<label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Channel Type</label>
						<div className="flex gap-3">
							<button onClick={() => setForm({ ...form, type: 'public' })} className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${form.type === 'public' ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
								<Globe size={24} className={form.type === 'public' ? 'text-indigo-400' : ''} />
								<span className="text-xs font-bold uppercase tracking-wider">Public</span>
							</button>
							<button onClick={() => setForm({ ...form, type: 'private' })} className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${form.type === 'private' ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
								<Lock size={24} className={form.type === 'private' ? 'text-indigo-400' : ''} />
								<span className="text-xs font-bold uppercase tracking-wider">Private</span>
							</button>
						</div>
					</div>
				</div>
				<div className="sticky bottom-0 bg-transparent pt-6 mt-2 z-10">
					<Button onClick={() => onSave(form)} disabled={!form.name} className="w-full glass-button-primary bg-indigo-600 hover:bg-indigo-500 h-12 text-lg font-bold">Create Channel</Button>
				</div>
			</div>
		</div>
	);
};

const ChannelInfoModal = ({ channel, onClose }: any) => {
	return (
		<div className="fixed inset-0 z-50 flex justify-end backdrop-blur-md bg-black/50" onClick={onClose}>
			<div className="w-full max-w-sm glass-panel h-full border-l border-white/10 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
				<div className="h-48 bg-gradient-to-br from-indigo-600 to-purple-800 relative">
					<button onClick={onClose} className="absolute top-4 left-4 p-2 bg-black/20 backdrop-blur-xl rounded-full text-white hover:bg-black/40 transition-colors border border-white/10"><X size={20} /></button>
					<button className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-xl rounded-full text-white hover:bg-black/40 transition-colors border border-white/10"><Edit2 size={18} /></button>
				</div>

				<div className="px-6 pb-6 -mt-16 relative">
					<div className="h-32 w-32 rounded-3xl bg-slate-900 p-1.5 shadow-2xl mb-4 border border-white/10 mx-auto">
						<div className="h-full w-full rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-4xl font-bold text-white border border-white/10 shadow-inner">
							{channel.name[0]}
						</div>
					</div>

					<div className="text-center mb-6">
						<h2 className="text-2xl font-bold text-white mb-1.5">{channel.name}</h2>
						<div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
							<span className="capitalize">{channel.type}</span>
							<span>•</span>
							<span className="text-emerald-400 font-bold">{channel.subscribers.toLocaleString()} subscribers</span>
						</div>
					</div>

					<div className="space-y-4">
						<div className="p-5 glass-card rounded-xl">
							<h4 className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">About</h4>
							<p className="text-sm text-slate-300 leading-relaxed font-medium">{channel.description}</p>
						</div>

						<div className="p-4 glass-card rounded-xl flex items-center justify-between">
							<div>
								<div className="text-xs font-bold text-slate-500 uppercase mb-1">Invite Link</div>
								<div className="text-sm text-indigo-400 truncate max-w-[150px] font-mono">gigmind.net/{channel.id}</div>
							</div>
							<Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10"><Share2 size={18} /></Button>
						</div>

						<Button variant="destructive" className="w-full h-12 glass-button border-rose-500/30 text-rose-300 bg-rose-500/10 hover:bg-rose-500/20">
							Leave Channel
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export const ChannelsModule = ({ selectedChannel, setSelectedChannel }: any) => {
	const [channels, setChannels] = useState(MOCK_CHANNELS);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showInfoModal, setShowInfoModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [broadcastText, setBroadcastText] = useState('');

	const filteredChannels = channels.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

	const handleCreateChannel = (form: any) => {
		const newChannel = {
			id: Date.now().toString(),
			name: form.name,
			description: form.description,
			subscribers: 1,
			isOwner: true,
			type: form.type,
			posts: []
		};
		setChannels([newChannel, ...channels]);
		setShowCreateModal(false);
	};

	const handleBroadcast = () => {
		if (!broadcastText.trim()) return;
		const newPost = {
			id: Date.now(),
			text: broadcastText,
			views: 0,
			likes: 0,
			date: 'Just now'
		};
		const updatedChannels = channels.map(c => {
			if (c.id === selectedChannel.id) {
				return { ...c, posts: [newPost, ...c.posts] };
			}
			return c;
		});
		setChannels(updatedChannels);
		setSelectedChannel(updatedChannels.find(c => c.id === selectedChannel.id));
		setBroadcastText('');
	};

	const ChannelList = () => (
		<div className="glass-panel h-full flex flex-col rounded-2xl overflow-hidden min-h-0">
			<div className="p-4 border-b border-white/5 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold text-white flex items-center gap-2"><Megaphone size={24} className="text-indigo-400" /> Channels</h2>
					<Button size="icon" onClick={() => setShowCreateModal(true)} className="rounded-full bg-indigo-600 hover:bg-indigo-500 h-10 w-10 shadow-lg shadow-indigo-500/20"><Plus size={20} /></Button>
				</div>
				<div className="relative">
					<Search size={16} className="absolute left-3 top-3 text-slate-500" />
					<input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search channels..." className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600" />
				</div>
			</div>
			<div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar pb-24 md:pb-2">
				{filteredChannels.map(channel => (
					<div key={channel.id} onClick={() => setSelectedChannel(channel)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
						<div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg border border-white/10 group-hover:scale-105 transition-transform">
							{channel.name[0]}
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex justify-between items-center">
								<h4 className="text-white font-bold truncate group-hover:text-indigo-200 transition-colors">{channel.name}</h4>
								{channel.isOwner && <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-bold uppercase">Admin</span>}
							</div>
							<p className="text-xs text-slate-400 truncate group-hover:text-slate-300">{channel.description}</p>
						</div>
					</div>
				))}
				{filteredChannels.length === 0 && (
					<div className="text-center text-slate-500 py-10 text-sm">No channels found.</div>
				)}
			</div>
		</div>
	);

	const ChannelFeed = () => (
		<div className="glass-panel h-full flex flex-col rounded-2xl overflow-hidden relative min-h-0">
			<div className="p-3 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl flex justify-between items-center sticky top-0 z-20">
				<div className="flex items-center gap-2 min-w-0">
					<button
						onClick={(e) => {
							e.stopPropagation();
							setSelectedChannel(null);
						}}
						className="p-2 mr-1 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
					>
						<ChevronLeft size={22} />
					</button>

					<div
						className="flex items-center gap-3 cursor-pointer hover:opacity-80 min-w-0 overflow-hidden group"
						onClick={() => setShowInfoModal(true)}
					>
						<div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-600 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md border border-white/10">
							{selectedChannel.name[0]}
						</div>
						<div className="min-w-0 max-w-[150px] sm:max-w-xs">
							<h3 className="text-white font-bold truncate group-hover:text-indigo-200 transition-colors">{selectedChannel.name}</h3>
							<p className="text-xs text-slate-400">{selectedChannel.subscribers.toLocaleString()} subscribers</p>
						</div>
					</div>
				</div>
				<div className="flex gap-1 flex-shrink-0">
					<Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 text-slate-400 hover:text-white"><Search size={20} /></Button>
					<Button size="icon" variant="ghost" onClick={() => setShowInfoModal(true)} className="rounded-full hover:bg-white/10 text-slate-400 hover:text-white"><MoreVertical size={20} /></Button>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 no-scrollbar min-h-0 bg-black/20 pb-24 md:pb-6">
				{selectedChannel.posts.map((post: any) => (
					<div key={post.id} className="glass-card p-5 max-w-2xl mx-auto shadow-lg border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-500">
						<p className="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap font-medium">{post.text}</p>
						<div className="mt-4 flex justify-between items-center text-slate-500 text-xs border-t border-white/5 pt-3">
							<div className="flex gap-4">
								<span className="flex items-center gap-1.5"><Eye size={14} className="text-slate-600" /> {post.views.toLocaleString()}</span>
								<button className="flex items-center gap-1.5 hover:text-indigo-400 cursor-pointer transition-colors"><ThumbsUp size={14} /> {post.likes}</button>
							</div>
							<span className="font-mono opacity-70">{post.date}</span>
						</div>
					</div>
				))}
				{selectedChannel.posts.length === 0 && (
					<div className="text-center text-slate-500 mt-20">
						<div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
							<Megaphone size={40} className="opacity-30" />
						</div>
						<p>No messages yet.</p>
					</div>
				)}
			</div>

			{selectedChannel.isOwner ? (
				<div className="p-4 border-t border-white/5 bg-slate-900/90 backdrop-blur sticky bottom-20 md:bottom-0 z-20 flex-shrink-0">
					<div className="flex gap-3 items-end max-w-3xl mx-auto">
						<textarea
							value={broadcastText}
							onChange={e => setBroadcastText(e.target.value)}
							placeholder="Broadcast a message..."
							className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none text-sm h-14 max-h-32 transition-colors"
						/>
						<Button onClick={handleBroadcast} disabled={!broadcastText.trim()} className="h-14 w-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20">
							<Send size={22} />
						</Button>
					</div>
				</div>
			) : (
				<div className="p-4 bg-slate-900/50 border-t border-white/5 text-center text-xs text-slate-500 uppercase font-bold tracking-widest flex-shrink-0 backdrop-blur">
					Broadcast Channel • Read Only
				</div>
			)}
		</div>
	);

	return (
		<div className="p-4 space-y-4 animate-in fade-in h-full min-h-0">
			{!selectedChannel ? <ChannelList /> : <ChannelFeed />}

			{showCreateModal && <CreateChannelModal onClose={() => setShowCreateModal(false)} onSave={handleCreateChannel} />}
			{showInfoModal && selectedChannel && <ChannelInfoModal channel={selectedChannel} onClose={() => setShowInfoModal(false)} />}
		</div>
	);
};
