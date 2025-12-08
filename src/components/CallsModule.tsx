import React, { useState } from 'react';
import {
	Phone, Users, Video, PlusSquare, CalendarIcon, Monitor, Plus,
	Search, Filter, Eye, ArrowUpRight, Clock, UserPlus, X
} from 'lucide-react';
import { Button } from './ui/button';

const MOCK_CALL_HISTORY = [
	{ id: 1, type: 'inbound', customer: 'Alice M.', time: '10:30 AM', date: 'Today', duration: '2:15', status: 'completed', color: 'emerald' },
	{ id: 2, type: 'outbound', customer: 'Bob D.', time: '11:45 AM', date: 'Today', duration: '0:45', status: 'completed', color: 'indigo' },
	{ id: 3, type: 'missed', customer: 'Sarah J.', time: '02:00 PM', date: 'Yesterday', duration: '-', status: 'missed', color: 'red' },
	{ id: 4, type: 'inbound', customer: 'Davina K.', time: '09:15 AM', date: 'Nov 23', duration: '5:01', status: 'completed', color: 'emerald' },
	{ id: 5, type: 'outbound', customer: 'Charlie', time: '04:20 PM', date: 'Nov 22', duration: '12:30', status: 'completed', color: 'indigo' },
];

const ContactListModal = ({ onClose, customers }: { onClose: () => void, customers: any[] }) => {
	const [search, setSearch] = useState('');
	const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

	return (
		<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
			<div className="glass-panel w-full max-w-md h-[80vh] sm:h-auto sm:max-h-[80vh] rounded-3xl sm:rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 duration-300">
				<div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl">
					<h3 className="text-lg font-bold text-white flex items-center gap-2"><Users size={20} className="text-indigo-400" /> Contacts</h3>
					<button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"><X size={18} /></button>
				</div>

				<div className="p-4 pb-2">
					<div className="relative">
						<Search size={16} className="absolute left-3 top-3 text-slate-500" />
						<input
							type="text"
							placeholder="Search people..."
							className="w-full bg-black/30 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
							autoFocus
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
					{filtered.map(c => (
						<div key={c.id} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer group transition-colors">
							<div className="h-10 w-10 rounded-full bg-slate-800 group-hover:bg-indigo-600 transition-colors flex items-center justify-center text-white font-bold shadow-sm border border-white/10">
								{c.name[0]}
							</div>
							<div className="flex-1">
								<div className="text-sm font-bold text-white">{c.name}</div>
								<div className="text-xs text-slate-400 group-hover:text-slate-300">
									{c.phones && c.phones[0]?.value || 'No number'}
								</div>
							</div>
							<button className="p-2 bg-slate-800 group-hover:bg-emerald-600 text-slate-300 group-hover:text-white rounded-full transition-all transform group-hover:scale-110 border border-white/10">
								<Phone size={16} />
							</button>
						</div>
					))}
					{filtered.length === 0 && (
						<div className="text-center text-slate-500 py-8 text-sm">No contacts found</div>
					)}
				</div>

				<div className="p-4 border-t border-white/5 bg-slate-900/50">
					<Button className="w-full glass-button" onClick={() => { }}>
						<UserPlus size={16} className="mr-2" /> Add New Contact
					</Button>
				</div>
			</div>
		</div>
	);
};

export const CallsModule = ({ customers }: any) => {
	const [showContacts, setShowContacts] = useState(false);
	const [historyFilter, setHistoryFilter] = useState('all');

	const filteredHistory = historyFilter === 'all'
		? MOCK_CALL_HISTORY
		: MOCK_CALL_HISTORY.filter(c => c.status === 'missed');

	const favorites = customers.filter((c: any) => c.isFavorite);

	return (
		<div className="p-4 md:p-6 space-y-6 animate-in fade-in slide-in-from-right-4 pb-28">
			{/* Header */}
			<div className="flex justify-between items-center sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl py-4 -mx-4 px-4 md:-mx-6 md:px-6 border-b border-white/5">
				<h2 className="text-2xl font-bold text-white tracking-tight">Calls</h2>
				<div className="flex gap-2">
					<label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Channel Type</label>
					<div className="flex flex-col sm:flex-row gap-3">
						<Button
							onClick={() => setShowContacts(true)}
							className="glass-button-primary rounded-full px-6"
						>
							<Users size={20} className="mr-2" /> Contacts
						</Button>
					</div>
				</div>
			</div>

			{/* Main Actions */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<button className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 to-rose-600/20 border border-orange-500/30 flex flex-col justify-between min-h-[160px] group transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]">
					<div className="absolute -right-6 -bottom-6 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500"><Video size={120} className="text-orange-400" /></div>
					<div className="glass-panel w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
						<Video size={28} className="text-white" />
					</div>
					<div className="text-left z-10">
						<div className="text-white font-bold text-xl leading-tight mb-1">New Meeting</div>
						<div className="text-orange-200/70 text-sm">Start instant call</div>
					</div>
				</button>

				<button className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-indigo-500/30 flex flex-col justify-between min-h-[160px] group transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]">
					<div className="absolute -right-6 -bottom-6 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500"><PlusSquare size={120} className="text-indigo-400" /></div>
					<div className="glass-panel w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
						<PlusSquare size={28} className="text-white" />
					</div>
					<div className="text-left z-10">
						<div className="text-white font-bold text-xl leading-tight mb-1">Join</div>
						<div className="text-indigo-200/70 text-sm">Enter code</div>
					</div>
				</button>
			</div>

			{/* Secondary Actions */}
			<div className="grid grid-cols-2 gap-4">
				<button className="glass-card p-4 flex items-center gap-3 group hover:border-indigo-500/50 transition-colors">
					<div className="bg-indigo-500/20 p-2.5 rounded-lg group-hover:bg-indigo-500/30 transition-colors"><CalendarIcon size={22} className="text-indigo-400" /></div>
					<span className="text-base font-bold text-slate-200 group-hover:text-white transition-colors">Schedule</span>
				</button>
				<button className="glass-card p-4 flex items-center gap-3 group hover:border-indigo-500/50 transition-colors">
					<div className="bg-indigo-500/20 p-2.5 rounded-lg group-hover:bg-indigo-500/30 transition-colors"><Monitor size={22} className="text-indigo-400" /></div>
					<span className="text-base font-bold text-slate-200 group-hover:text-white transition-colors">Share Screen</span>
				</button>
			</div>

			{/* Favorites */}
			<div>
				<div className="flex justify-between items-center mb-4 px-1">
					<h3 className="text-slate-500 text-xs uppercase tracking-wider font-bold">Favorites</h3>
					<button className="text-indigo-400 text-xs hover:text-indigo-300 font-bold uppercase transition-colors">Edit</button>
				</div>
				<div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
					<div className="flex flex-col items-center gap-2 cursor-pointer group min-w-[64px]">
						<div className="w-16 h-16 rounded-2xl glass-panel border border-dashed border-slate-600 flex items-center justify-center group-hover:border-indigo-500 group-hover:text-indigo-400 text-slate-500 transition-colors">
							<Plus size={24} />
						</div>
						<span className="text-xs text-slate-500 font-medium">Add</span>
					</div>
					{favorites.map((fav: any) => (
						<div key={fav.id} className="flex flex-col items-center gap-2 cursor-pointer group min-w-[64px]">
							<div className="w-16 h-16 rounded-2xl p-1 relative group-hover:scale-105 transition-transform">
								<div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg border border-white/20">
									{fav.name[0]}
								</div>
								<div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-950 rounded-full flex items-center justify-center">
									<div className="w-3 h-3 bg-emerald-500 rounded-full border border-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
								</div>
							</div>
							<span className="text-xs text-slate-300 font-medium truncate w-full text-center group-hover:text-white transition-colors">{fav.name.split(' ')[0]}</span>
						</div>
					))}
				</div>
			</div>

			{/* Ongoing Call Card */}
			<div className="relative group cursor-pointer">
				<div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
				<div className="glass-panel p-6 relative overflow-hidden">
					<div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Clock size={120} /></div>
					<div className="relative z-10">
						<div className="flex justify-between items-center mb-4">
							<span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-1 rounded border border-rose-500/30 flex items-center gap-1.5 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
								<span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
								LIVE NOW
							</span>
							<span className="text-slate-400 text-xs font-mono bg-black/40 px-2 py-1 rounded border border-white/5">00:12:45</span>
						</div>
						<h3 className="text-xl font-bold text-white mb-1">Weekly Team Sync</h3>
						<p className="text-xs text-slate-400 mb-6 flex items-center gap-1.5"><Video size={14} className="text-indigo-400" /> Video Call • Project Updates</p>

						<div className="flex items-center justify-between">
							<div className="flex items-center -space-x-3 pl-2">
								{['A', 'B', 'S', '+5'].map((initial, i) => (
									<div key={i} className={`w-9 h-9 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-sm ${i === 3 ? 'bg-slate-700 text-slate-300' : 'bg-gradient-to-br from-indigo-500 to-purple-500'}`}>
										{initial}
									</div>
								))}
							</div>
							<Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20 border border-emerald-500/30">
								Join Call <ArrowUpRight size={16} className="ml-2" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* History */}
			<div>
				<div className="flex justify-between items-center mb-4 px-1">
					<div className="glass-panel p-1 rounded-lg flex shrink-0">
						<button
							onClick={() => setHistoryFilter('all')}
							className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${historyFilter === 'all' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
						>
							Recent
						</button>
						<button
							onClick={() => setHistoryFilter('missed')}
							className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${historyFilter === 'missed' ? 'bg-rose-500/20 text-rose-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
						>
							Missed
						</button>
					</div>
					<button className="text-indigo-400 text-xs hover:text-indigo-300"><Filter size={16} /></button>
				</div>
				<div className="glass-panel rounded-xl overflow-hidden">
					{filteredHistory.length > 0 ? filteredHistory.map((call, idx) => (
						<div
							key={call.id}
							className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors group ${idx !== filteredHistory.length - 1 ? 'border-b border-white/5' : ''}`}
						>
							<div className={`p-2.5 rounded-full ${call.status === 'missed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white/5 text-slate-400 border border-white/5'} transition-colors`}>
								<Phone size={18} />
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex justify-between items-center mb-0.5">
									<span className={`font-bold text-sm truncate ${call.status === 'missed' ? 'text-red-400' : 'text-white group-hover:text-indigo-200 transition-colors'}`}>{call.customer}</span>
									<span className="text-[10px] text-slate-500 whitespace-nowrap font-medium">{call.date}</span>
								</div>
								<div className="flex items-center gap-2 text-xs text-slate-500">
									<span className="capitalize">{call.type}</span>
									{call.duration !== '-' && <span>• {call.duration}</span>}
									{call.time && <span>• {call.time}</span>}
								</div>
							</div>
							<button className="p-2 rounded-full bg-transparent hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/30">
								<Phone size={16} />
							</button>
						</div>
					)) : (
						<div className="flex flex-col items-center justify-center py-10 text-slate-500 text-center">
							<Phone size={32} className="mx-auto mb-2 opacity-20" />
							<p className="text-sm">No {historyFilter} calls found</p>
						</div>
					)}
				</div>
			</div>

			{showContacts && <ContactListModal onClose={() => setShowContacts(false)} customers={customers} />}
		</div>
	);
};
