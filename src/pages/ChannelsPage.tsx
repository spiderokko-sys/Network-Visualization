import { useState } from 'react';
import {
	Megaphone, Plus, Search, Send, Eye, ThumbsUp, ChevronLeft,
	MoreVertical, Globe, Lock, X, Share2, Edit2, Image as ImageIcon,
	UserPlus, CheckCircle, Circle as CircleIcon, ChevronDown, ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/button';

// --- Types ---
interface Member {
	id: string | number;
	name: string;
	avatar: string;
	status: 'online' | 'offline' | 'busy';
}

interface Circle {
	id: string;
	name: string;
	members: Member[];
	color: string;
}

// --- Mock Data ---

const MOCK_CIRCLES: Circle[] = [
	{
		id: 'c1',
		name: 'Tech & AI',
		members: [
			{ id: 1, name: 'Alex', avatar: 'A', status: 'online' },
			{ id: 2, name: 'Sarah', avatar: 'S', status: 'busy' },
			{ id: 4, name: 'Jessica', avatar: 'J', status: 'online' }
		],
		color: 'text-emerald-500'
	},
	{
		id: 'c2',
		name: 'Sci-Fi & Fantasy',
		members: [
			{ id: 3, name: 'Mike', avatar: 'M', status: 'offline' },
			{ id: 4, name: 'Jessica', avatar: 'J', status: 'online' },
			{ id: 1, name: 'Alex', avatar: 'A', status: 'online' }
		],
		color: 'text-sky-500'
	},
	{
		id: 'c3',
		name: 'Local Meetups',
		members: [
			{ id: 2, name: 'Sarah', avatar: 'S', status: 'busy' },
			{ id: 3, name: 'Mike', avatar: 'M', status: 'offline' },
			{ id: 7, name: 'Samira', avatar: 'S', status: 'online' }
		],
		color: 'text-blue-500'
	}
];

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

const InviteFromCirclesModal = ({ isOpen, onClose, onInvite }: { isOpen: boolean, onClose: () => void, onInvite: (count: number) => void }) => {
	const [expandedCircles, setExpandedCircles] = useState<string[]>(['c1']);
	const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

	if (!isOpen) return null;

	const toggleCircle = (id: string) => {
		setExpandedCircles(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
	};

	const toggleMember = (id: number) => {
		setSelectedMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
	};

	const handleInvite = () => {
		onInvite(selectedMembers.length);
		onClose();
		setSelectedMembers([]);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
			<div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[85vh]">
				<div className="p-4 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex justify-between items-center">
					<h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
						<UserPlus size={20} className="text-indigo-500" /> Invite from Circles
					</h3>
					<button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"><X size={20} /></button>
				</div>

				<div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
					{MOCK_CIRCLES.map(circle => (
						<div key={circle.id} className="glass-card rounded-xl overflow-hidden border border-slate-200 dark:border-white/5">
							<div
								className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
								onClick={() => toggleCircle(circle.id)}
							>
								<div className="flex items-center gap-3">
									<CircleIcon size={16} className={circle.color} fill="currentColor" fillOpacity={0.2} />
									<span className="font-bold text-slate-700 dark:text-slate-200">{circle.name}</span>
									<span className="text-xs text-slate-500 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full">{circle.members.length}</span>
								</div>
								{expandedCircles.includes(circle.id) ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
							</div>

							{expandedCircles.includes(circle.id) && (
								<div className="bg-slate-50/50 dark:bg-black/20 p-2 space-y-1 border-t border-slate-200 dark:border-white/5">
									{circle.members.map(member => (
										<div
											key={`${circle.id}-${member.id}`}
											className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${selectedMembers.includes(member.id as number) ? 'bg-indigo-50 dark:bg-indigo-500/20' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
											onClick={() => toggleMember(member.id as number)}
										>
											<div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedMembers.includes(member.id as number) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 dark:border-slate-600'}`}>
												{selectedMembers.includes(member.id as number) && <CheckCircle size={12} className="text-white" />}
											</div>
											<div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
												{member.avatar}
											</div>
											<span className="text-sm font-medium text-slate-700 dark:text-slate-200 flex-1">{member.name}</span>
											<span className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-emerald-500' : member.status === 'busy' ? 'bg-rose-500' : 'bg-slate-400'}`}></span>
										</div>
									))}
								</div>
							)}
						</div>
					))}
				</div>

				<div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/5">
					<Button
						onClick={handleInvite}
						disabled={selectedMembers.length === 0}
						className="w-full h-12 glass-button-primary bg-indigo-600 hover:bg-indigo-500 text-base font-bold shadow-lg shadow-indigo-500/20"
					>
						Invite {selectedMembers.length > 0 ? `${selectedMembers.length} People` : 'Selected'}
					</Button>
				</div>
			</div>
		</div>
	);
};

const CreateChannelModal = ({ onClose, onSave }: any) => {
	const [form, setForm] = useState({ name: '', description: '', type: 'public' });

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
			<div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar">
				<div className="flex justify-between items-center mb-6 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-10 pb-4 border-b border-slate-200 dark:border-white/5">
					<h3 className="text-xl font-bold text-slate-900 dark:text-white">Create Channel</h3>
					<button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X /></button>
				</div>
				<div className="space-y-6">
					<div className="flex justify-center mb-2">
						<div className="h-24 w-24 rounded-full glass-card flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-600 cursor-pointer hover:border-indigo-500 hover:bg-white/5 transition-all group">
							<div className="text-slate-500 group-hover:text-indigo-400 transition-colors"><ImageIcon size={32} /></div>
						</div>
					</div>

					<div>
						<label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Channel Name</label>
						<input className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none transition-colors" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Announcements" />
					</div>

					<div>
						<label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Description</label>
						<textarea className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none resize-none transition-colors" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What is this channel about?" />
					</div>

					<div>
						<label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Channel Type</label>
						<div className="flex gap-3">
							<button onClick={() => setForm({ ...form, type: 'public' })} className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${form.type === 'public' ? 'bg-indigo-600/20 border-indigo-500 text-slate-900 dark:text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}>
								<Globe size={24} className={form.type === 'public' ? 'text-indigo-400' : ''} />
								<span className="text-xs font-bold uppercase tracking-wider">Public</span>
							</button>
							<button onClick={() => setForm({ ...form, type: 'private' })} className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${form.type === 'private' ? 'bg-indigo-600/20 border-indigo-500 text-slate-900 dark:text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}>
								<Lock size={24} className={form.type === 'private' ? 'text-indigo-400' : ''} />
								<span className="text-xs font-bold uppercase tracking-wider">Private</span>
							</button>
						</div>
					</div>
				</div>
				<div className="sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl pt-6 mt-2 z-10 -mx-6 px-6 pb-2">
					<Button onClick={() => onSave(form)} disabled={!form.name} className="w-full glass-button-primary bg-indigo-600 hover:bg-indigo-500 h-12 text-lg font-bold">Create Channel</Button>
				</div>
			</div>
		</div>
	);
};

const ChannelInfoModal = ({ channel, onClose }: any) => {
	return (
		<div className="fixed inset-0 z-50 flex justify-end backdrop-blur-md bg-black/50" onClick={onClose}>
			<div className="w-full max-w-sm glass-panel h-full border-l border-slate-200 dark:border-white/10 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
				<div className="h-48 bg-gradient-to-br from-indigo-600 to-purple-800 relative">
					<button onClick={onClose} className="absolute top-4 left-4 p-2 bg-slate-100 dark:bg-black/20 backdrop-blur-xl rounded-full text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-black/40 transition-colors border border-slate-200 dark:border-white/10"><X size={20} /></button>
					<button className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-black/20 backdrop-blur-xl rounded-full text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-black/40 transition-colors border border-slate-200 dark:border-white/10"><Edit2 size={18} /></button>
				</div>

				<div className="px-6 pb-6 -mt-16 relative">
					<div className="h-32 w-32 rounded-3xl bg-slate-900 p-1.5 shadow-2xl mb-4 border border-slate-200 dark:border-white/10 mx-auto">
						<div className="h-full w-full rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-4xl font-bold text-white border border-slate-200 dark:border-white/10 shadow-inner">
							{channel.name[0]}
						</div>
					</div>

					<div className="text-center mb-6">
						<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1.5">{channel.name}</h2>
						<div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
							<span className="capitalize">{channel.type}</span>
							<span>•</span>
							<span className="text-emerald-400 font-bold">{channel.subscribers.toLocaleString()} subscribers</span>
						</div>
					</div>

					<div className="space-y-4">
						<div className="p-5 glass-card rounded-xl">
							<h4 className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">About</h4>
							<p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{channel.description}</p>
						</div>

						<div className="p-4 glass-card rounded-xl flex items-center justify-between">
							<div>
								<div className="text-xs font-bold text-slate-500 uppercase mb-1">Invite Link</div>
								<div className="text-sm text-indigo-400 truncate max-w-[150px] font-mono">gigmind.net/{channel.id}</div>
							</div>
							<Button size="icon" variant="ghost" className="rounded-full hover:bg-slate-100 dark:hover:bg-white/10"><Share2 size={18} /></Button>
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

import { useSearchParams } from 'react-router-dom';

export const ChannelsModule = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const selectedChannelId = searchParams.get('id');

	const [channels, setChannels] = useState(MOCK_CHANNELS);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showInfoModal, setShowInfoModal] = useState(false);
	const [showInviteModal, setShowInviteModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [broadcastText, setBroadcastText] = useState('');

	const selectedChannel = channels.find(c => c.id === selectedChannelId) || null;

	const setSelectedChannel = (channel: any) => {
		if (channel) {
			setSearchParams({ id: channel.id });
		} else {
			setSearchParams({});
		}
	};


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

	const handleInviteUsers = (count: number) => {
		if (!selectedChannel) return;

		const updatedChannels = channels.map(c => {
			if (c.id === selectedChannel.id) {
				return { ...c, subscribers: c.subscribers + count };
			}
			return c;
		});
		setChannels(updatedChannels);
	};

	const handleBroadcast = () => {
		if (!broadcastText.trim() || !selectedChannel) return;
		const newPost = {
			id: Date.now(),
			text: broadcastText,
			views: 0,
			likes: 0,
			date: 'Just now'
		};
		const updatedChannels = channels.map(c => {
			if (c.id === selectedChannel!.id) {
				return { ...c, posts: [newPost, ...c.posts] };
			}
			return c;
		});
		setChannels(updatedChannels);
		setSelectedChannel(updatedChannels.find(c => c.id === selectedChannel!.id));
		setBroadcastText('');
	};

	const ChannelList = () => (
		<div className="glass-panel h-full flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
			<div className="p-5 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-20 border-b border-slate-200 dark:border-white/5">
				<div className="flex justify-between items-center mb-5">
					<h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5"><Megaphone size={28} className="text-indigo-400" /> Channels</h2>
					<Button size="icon" onClick={() => setShowCreateModal(true)} className="rounded-xl bg-indigo-600 hover:bg-indigo-500 h-10 w-10 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"><Plus size={20} /></Button>
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
			<div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar pb-24 md:pb-3">
				{filteredChannels.map(channel => (
					<div
						key={channel.id}
						onClick={() => setSelectedChannel(channel)}
						className="p-4 flex items-center gap-4 border rounded-2xl cursor-pointer transition-all min-h-[80px] group glass-card border-transparent hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-200 dark:border-white/10 hover:shadow-lg"
					>
						<div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg border border-slate-200 dark:border-white/10 group-hover:scale-105 transition-transform">
							{channel.name[0]}
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex justify-between items-center mb-1">
								<h4 className="text-base font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white truncate flex items-center gap-1.5 transition-colors">
									{channel.name}
									{channel.isOwner && <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider">Admin</span>}
								</h4>
							</div>
							<p className="text-sm font-medium text-slate-500 dark:text-slate-500 truncate group-hover:text-slate-700 dark:group-hover:text-slate-400 transition-colors">{channel.description}</p>
						</div>
					</div>
				))}
				{filteredChannels.length === 0 && (
					<div className="text-center text-slate-500 dark:text-slate-500 py-20 text-sm font-medium">No channels found.</div>
				)}
			</div>
		</div>
	);

	const ChannelFeed = () => {
		if (!selectedChannel) return null;
		return (
			<div className="glass-panel h-full flex flex-col rounded-2xl overflow-hidden relative shadow-2xl">
				<div className="p-4 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex justify-between items-center sticky top-0 z-20">
					<div className="flex items-center gap-2 min-w-0">
						<button
							onClick={(e) => {
								e.stopPropagation();
								setSelectedChannel(null);
							}}
							className="p-2 mr-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
						>
							<ChevronLeft size={24} />
						</button>

						<div
							className="flex items-center gap-3 cursor-pointer hover:opacity-80 min-w-0 overflow-hidden group transition-opacity"
							onClick={() => setShowInfoModal(true)}
						>
							<div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md border border-slate-200 dark:border-white/10">
								{selectedChannel.name[0]}
							</div>
							<div className="min-w-0 max-w-[150px] sm:max-w-xs">
								<h3 className="text-slate-900 dark:text-white font-bold truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors text-base">{selectedChannel.name}</h3>
								<p className="text-xs text-slate-500 dark:text-slate-500 font-medium">{selectedChannel.subscribers.toLocaleString()} subscribers</p>
							</div>
						</div>
					</div>
					<div className="flex gap-1 flex-shrink-0">
						{selectedChannel.isOwner && (
							<Button
								size="icon"
								variant="ghost"
								onClick={() => setShowInviteModal(true)}
								className="rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
								title="Invite from Circles"
							>
								<UserPlus size={20} />
							</Button>
						)}
						<Button size="icon" variant="ghost" className="rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"><Search size={20} /></Button>
						<Button size="icon" variant="ghost" onClick={() => setShowInfoModal(true)} className="rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"><MoreVertical size={20} /></Button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 no-scrollbar min-h-0 bg-slate-50/50 dark:bg-black/20 pb-24 md:pb-6">
					{selectedChannel.posts.map((post: any) => (
						<div key={post.id} className="glass-card p-5 max-w-2xl mx-auto shadow-lg border border-slate-200 dark:border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-500 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
							<p className="text-slate-800 dark:text-slate-100 text-sm leading-7 whitespace-pre-wrap font-medium">{post.text}</p>
							<div className="mt-4 flex justify-between items-center text-slate-400 dark:text-slate-500 text-xs border-t border-slate-100 dark:border-white/5 pt-3">
								<div className="flex gap-4">
									<span className="flex items-center gap-1.5 font-medium"><Eye size={14} className="text-slate-400" /> {post.views.toLocaleString()}</span>
									<button className="flex items-center gap-1.5 hover:text-indigo-500 cursor-pointer transition-colors font-medium"><ThumbsUp size={14} /> {post.likes}</button>
								</div>
								<span className="font-mono font-medium opacity-80">{post.date}</span>
							</div>
						</div>
					))}
					{selectedChannel.posts.length === 0 && (
						<div className="text-center text-slate-500 mt-20">
							<div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-white/5">
								<Megaphone size={40} className="opacity-30" />
							</div>
							<p className="font-medium">No messages yet.</p>
						</div>
					)}
				</div>

				{selectedChannel.isOwner ? (
					<div className="p-4 border-t border-slate-200 dark:border-white/5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl sticky bottom-20 md:bottom-0 z-20 flex-shrink-0">
						<div className="flex gap-3 items-end max-w-3xl mx-auto">
							<textarea
								value={broadcastText}
								onChange={e => setBroadcastText(e.target.value)}
								placeholder="Broadcast a message..."
								className="flex-1 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-black/60 resize-none text-sm h-14 max-h-32 transition-colors shadow-inner font-medium"
							/>
							<Button onClick={handleBroadcast} disabled={!broadcastText.trim()} className="h-14 w-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 text-white transition-all hover:scale-105">
								<Send size={22} />
							</Button>
						</div>
					</div>
				) : (
					<div className="p-4 bg-white/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-white/5 text-center text-xs text-slate-500 uppercase font-bold tracking-widest flex-shrink-0 backdrop-blur">
						Broadcast Channel • Read Only
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="p-0 md:p-4 space-y-0 md:space-y-4 animate-in fade-in h-full flex gap-4 min-h-0">
			{!selectedChannel ? (
				<div className="w-full h-full">
					<ChannelList />
				</div>
			) : (
				<div className="w-full h-full">
					<ChannelFeed />
				</div>
			)}

			{showCreateModal && <CreateChannelModal onClose={() => setShowCreateModal(false)} onSave={handleCreateChannel} />}
			{showInfoModal && selectedChannel && <ChannelInfoModal channel={selectedChannel} onClose={() => setShowInfoModal(false)} />}
			{showInviteModal && selectedChannel && (
				<InviteFromCirclesModal
					isOpen={showInviteModal}
					onClose={() => setShowInviteModal(false)}
					onInvite={handleInviteUsers}
				/>
			)}
		</div>
	);
};
