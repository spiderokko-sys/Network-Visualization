import { useState } from 'react';
import {
	Phone, Video, PlusSquare, CalendarIcon, Monitor, Plus,
	Filter, ArrowUpRight, Clock
} from 'lucide-react';
import { Button } from '../components/ui/button';

const MOCK_CALL_HISTORY = [
	{ id: 1, type: 'inbound', customer: 'Alice M.', time: '10:30 AM', date: 'Today', duration: '2:15', status: 'completed', color: 'emerald' },
	{ id: 2, type: 'outbound', customer: 'Bob D.', time: '11:45 AM', date: 'Today', duration: '0:45', status: 'completed', color: 'indigo' },
	{ id: 3, type: 'missed', customer: 'Sarah J.', time: '02:00 PM', date: 'Yesterday', duration: '-', status: 'missed', color: 'red' },
	{ id: 4, type: 'inbound', customer: 'Davina K.', time: '09:15 AM', date: 'Nov 23', duration: '5:01', status: 'completed', color: 'emerald' },
	{ id: 5, type: 'outbound', customer: 'Charlie', time: '04:20 PM', date: 'Nov 22', duration: '12:30', status: 'completed', color: 'indigo' },
];



export const CallsModule = ({ customers }: any) => {

	const [historyFilter, setHistoryFilter] = useState('all');

	const filteredHistory = historyFilter === 'all'
		? MOCK_CALL_HISTORY
		: MOCK_CALL_HISTORY.filter(c => c.status === 'missed');

	const favorites = customers.filter((c: any) => c.isFavorite);

	return (
		<div className="h-full overflow-y-auto no-scrollbar pt-2 px-4 md:p-6 space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 pb-28 bg-slate-50 dark:bg-slate-950">
			{/* Header */}


			{/* Main Actions */}
			<div className="flex gap-3">
				<Button className="flex-1 h-12 glass-button-primary bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20">
					<Video className="mr-2" size={18} /> New Meeting
				</Button>
				<Button variant="glass" className="flex-1 h-12 text-base text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10">
					<PlusSquare className="mr-2" size={18} /> Join
				</Button>
			</div>

			{/* Secondary Actions */}
			<div className="grid grid-cols-2 gap-3">
				<button className="glass-card p-3 flex items-center gap-2 group hover:border-indigo-500/50 transition-colors bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
					<div className="bg-indigo-500/20 p-2 rounded-lg group-hover:bg-indigo-500/30 transition-colors"><CalendarIcon size={18} className="text-indigo-400" /></div>
					<span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">Schedule</span>
				</button>
				<button className="glass-card p-3 flex items-center gap-2 group hover:border-indigo-500/50 transition-colors bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
					<div className="bg-indigo-500/20 p-2 rounded-lg group-hover:bg-indigo-500/30 transition-colors"><Monitor size={18} className="text-indigo-400" /></div>
					<span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">Share Screen</span>
				</button>
			</div>

			{/* Favorites */}
			<div>
				<div className="flex justify-between items-center mb-3 px-1">
					<h3 className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-3">Favorites</h3>
					<button className="text-indigo-400 text-xs hover:text-indigo-300 font-bold uppercase transition-colors">Edit</button>
				</div>
				<div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
					<div className="flex flex-col items-center gap-1.5 cursor-pointer group min-w-[56px]">
						<div className="w-14 h-14 rounded-2xl glass-panel border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center group-hover:border-indigo-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-slate-400 dark:text-slate-500 transition-colors">
							<Plus size={20} />
						</div>
						<span className="text-[10px] text-slate-500 font-medium">Add</span>
					</div>
					{favorites.map((fav: any) => (
						<div key={fav.id} className="flex flex-col items-center gap-1.5 cursor-pointer group min-w-[56px]">
							<div className="w-14 h-14 rounded-2xl p-1 relative group-hover:scale-105 transition-transform">
								<div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-lg border border-white/20">
									{fav.name[0]}
								</div>
								<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-950 rounded-full flex items-center justify-center">
									<div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
								</div>
							</div>
							<span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium truncate w-full text-center group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">{fav.name.split(' ')[0]}</span>
						</div>
					))}
				</div>
			</div>

			{/* Ongoing Call Card */}
			<div className="relative group cursor-pointer">
				<div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
				<div className="glass-panel p-4 md:p-6 relative overflow-hidden border border-slate-200 dark:border-white/5">
					<div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Clock size={100} /></div>
					<div className="relative z-10">
						<div className="flex justify-between items-center mb-3">
							<span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-1 rounded border border-rose-500/30 flex items-center gap-1.5 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
								<span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
								LIVE NOW
							</span>
							<span className="text-slate-500 dark:text-slate-400 text-[10px] font-mono bg-slate-100 dark:bg-black/40 px-2 py-1 rounded border border-slate-200 dark:border-white/5">00:12:45</span>
						</div>
						<h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Weekly Team Sync</h3>
						<p className="text-[10px] text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5"><Video size={12} className="text-indigo-400" /> Video Call • Project Updates</p>

						<div className="flex items-center justify-between">
							<div className="flex items-center -space-x-2 pl-2">
								{['A', 'B', 'S', '+5'].map((initial, i) => (
									<div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-50 dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${i === 3 ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'bg-gradient-to-br from-indigo-500 to-purple-500'}`}>
										{initial}
									</div>
								))}
							</div>
							<Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20 border border-emerald-500/30">
								Join <ArrowUpRight size={14} className="ml-1" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* History */}
			<div>
				<div className="flex justify-between items-center mb-3 px-1">
					<div className="glass-panel p-1 rounded-lg flex shrink-0 border border-slate-200 dark:border-white/5">
						<button
							onClick={() => setHistoryFilter('all')}
							className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${historyFilter === 'all' ? 'bg-white shadow-sm text-indigo-600 dark:bg-white/10 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
						>
							Recent
						</button>
						<button
							onClick={() => setHistoryFilter('missed')}
							className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${historyFilter === 'missed' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
						>
							Missed
						</button>
					</div>
					<button className="text-indigo-400 text-xs hover:text-indigo-300"><Filter size={16} /></button>
				</div>
				<div className="glass-panel rounded-xl overflow-hidden border border-slate-200 dark:border-white/5">
					{filteredHistory.length > 0 ? filteredHistory.map((call, idx) => (
						<div
							key={call.id}
							className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group ${idx !== filteredHistory.length - 1 ? 'border-b border-slate-200 dark:border-white/5' : ''}`}
						>
							<div className={`p-2 rounded-full ${call.status === 'missed' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5'} transition-colors`}>
								<Phone size={16} />
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex justify-between items-center mb-0.5">
									<span className={`font-bold text-sm truncate ${call.status === 'missed' ? 'text-red-500 dark:text-red-400' : 'text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors'}`}>{call.customer}</span>
									<span className="text-[10px] text-slate-500 whitespace-nowrap font-medium">{call.date}</span>
								</div>
								<div className="flex items-center gap-2 text-[10px] text-slate-500">
									<span className="capitalize">{call.type}</span>
									{call.duration !== '-' && <span>• {call.duration}</span>}
									{call.time && <span>• {call.time}</span>}
								</div>
							</div>
							<button className="p-1.5 rounded-full bg-transparent hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/30">
								<Phone size={14} />
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


		</div>
	);
};
