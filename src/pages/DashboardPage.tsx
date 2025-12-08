import React, { useState } from 'react';
import {
	QrCode, Layers, Clock, ChevronRight, Star, Award, AlertTriangle, Zap,
	DollarSign, FileText, Users, CalendarDays, Heart, Phone, PlusCircle,
	Edit2, Trash2, Circle, Check, Megaphone, Globe, Target, MapPin, Tag,
	Send, CheckCircle2, TrendingUp, Activity
} from 'lucide-react';
import { QRModal } from '../components/modals/QRModal';
import { FinancialModal } from '../components/modals/FinancialModal';
import { AddCustomerModal } from '../components/modals/AddCustomerModal';
import { EditCircleModal } from '../components/modals/EditCircleModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';

const BUSINESS_STATS = {
	l1_count: 142,
	l2_reach: 4820,
	l3_reach: 25420,
	trust_score: 94,
};

const INITIAL_CIRCLES = [
	{ id: 'l1', name: 'L1: Inner Orbit', type: 'system', count: 142, color: 'emerald', desc: 'Directly connected customers.' },
	{ id: 'l2', name: 'L2: Social Halo', type: 'system', count: 4820, color: 'amber', desc: 'Friends of your customers.' },
	{ id: 'l3', name: 'L3: Deep Network', type: 'system', count: 25420, color: 'slate', desc: 'Anonymous reach in region.' },
	{ id: 'c1', name: 'Weekend Regulars', type: 'custom', count: 45, color: 'indigo', desc: 'Visit Sat/Sun > 2 times/mo' },
	{ id: 'c2', name: 'Local Tech Workers', type: 'custom', count: 850, color: 'cyan', desc: 'Tag: Tech + Geo: <1km' },
];

const RECENT_ACTIVITY = [
	{ id: 1, type: 'tether', msg: 'New customer connected via QR', time: '2m ago', icon: QrCode, color: 'emerald' },
	{ id: 2, type: 'review', msg: 'Positive feedback received (5★)', time: '15m ago', icon: Star, color: 'amber' },
	{ id: 3, type: 'milestone', msg: 'Reached 150 L1 Nodes! 🎉', time: '1h ago', icon: Award, color: 'purple' },
	{ id: 4, type: 'ping', msg: 'Retention Campaign sent to 45 nodes', time: '2h ago', icon: Zap, color: 'blue' },
	{ id: 5, type: 'alert', msg: 'Unusual activity detected in L2', time: '4h ago', icon: AlertTriangle, color: 'rose' },
];

const INTEREST_TAGS = ['Tech', 'Creative', 'Foodie', 'Nightlife', 'Outdoors', 'Wellness', 'Finance', 'Student'];

export const BusinessDashboard = ({ customers: initialCustomers, initialTab = 'overview' }: any) => {
	const [activeInternalTab, setActiveInternalTab] = useState(initialTab);
	const [circles, setCircles] = useState(INITIAL_CIRCLES);
	const [showEditCircleModal, setShowEditCircleModal] = useState(false);
	const [editingCircle, setEditingCircle] = useState(null);
	const [selectedMarketingCircles, setSelectedMarketingCircles] = useState(['l1']);
	const [showLargeQR, setShowLargeQR] = useState(false);
	const [campaignMode, setCampaignMode] = useState('retention');
	const [geoScope, setGeoScope] = useState<string | null>('city');
	const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
	const [messagePayload, setMessagePayload] = useState('');
	const [customers, setCustomers] = useState(initialCustomers);
	const [showAddCustomer, setShowAddCustomer] = useState(false);
	const [editingCustomer, setEditingCustomer] = useState(null);
	const [showFinancialModal, setShowFinancialModal] = useState(false);
	const [financialType, setFinancialType] = useState('payment');

	// Helpers
	const toggleMarketingCircle = (id: string) => setSelectedMarketingCircles(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
	const toggleInterest = (tag: string) => setSelectedInterests(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

	const getTotalReach = () => {
		if (campaignMode === 'retention') return BUSINESS_STATS.l1_count.toLocaleString();
		let base = circles.filter(c => selectedMarketingCircles.includes(c.id)).reduce((a, c) => a + c.count, 0);
		if (geoScope === 'walkable') base *= 0.15;
		else if (geoScope === 'neighborhood') base *= 0.45;
		else if (geoScope === 'city') base *= 1.0;
		else base = 0;
		if (selectedInterests.length > 0) base *= 0.6;
		return Math.floor(base).toLocaleString();
	};

	const getTotalPrice = () => {
		if (campaignMode === 'retention') return 'Free';
		const selectedCircles = circles.filter(c => selectedMarketingCircles.includes(c.id));
		const baseCost = selectedCircles.reduce((a, c) => a + ((c.count / 1000) * (c.type === 'system' ? 10 : 15)), 0);
		let geoMultiplier = 1;
		if (geoScope === 'walkable') geoMultiplier = 0.5;
		else if (geoScope === 'neighborhood') geoMultiplier = 1.2;
		else if (geoScope === 'city') geoMultiplier = 2.5;
		let interestMultiplier = selectedInterests.length > 0 ? 1.5 : 1;
		const cost = (baseCost * geoMultiplier * interestMultiplier);
		const total = Math.max(1.00, cost);
		return `$${total.toFixed(2)}`;
	};

	// Handlers
	const handleAddCustomer = (data: any) => {
		if (data.id) {
			// Edit existing
			setCustomers(customers.map((c: any) => c.id === data.id ? {
				...c,
				name: data.name,
				tags: data.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t),
				emails: data.email ? [{ ...c.emails[0], value: data.email }] : c.emails,
				phones: data.phone ? [{ ...c.phones[0], value: data.phone }] : c.phones,
			} : c));
		} else {
			// Add new
			const newCust = {
				id: Date.now(),
				name: data.name,
				status: 'L1',
				tags: data.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t),
				visits: 0,
				last_seen: 'Just added',
				emails: data.email ? [{ id: Date.now() + 'e', value: data.email, isPrimary: true }] : [],
				phones: data.phone ? [{ id: Date.now() + 'p', value: data.phone, isPrimary: true }] : [],
				memberSince: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
				isFavorite: false
			};
			setCustomers([newCust, ...customers]);
		}
		setShowAddCustomer(false);
		setEditingCustomer(null);
	};

	const handleDeleteCircle = (id: string) => { setCircles(circles.filter(c => c.id !== id)); };
	const handleEditCircle = (updatedCircle: any) => {
		setCircles(circles.map(c => c.id === updatedCircle.id ? updatedCircle : c));
		setShowEditCircleModal(false);
		setEditingCircle(null);
	};
	const openEditCircle = (circle: any) => {
		setEditingCircle(circle);
		setShowEditCircleModal(true);
	};
	const toggleFavorite = (e: any, id: number) => {
		e.stopPropagation();
		setCustomers(customers.map((c: any) => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
	};
	const openFinancialModal = (type: string) => {
		setFinancialType(type);
		setShowFinancialModal(true);
	};
	const handleSaveFinancial = (data: any) => {
		console.log('Saving financial transaction:', data);
		setShowFinancialModal(false);
	};

	return (
		<div className="h-full overflow-y-auto no-scrollbar min-h-0">
			<div className="px-4 md:px-6 pt-0 space-y-4 md:space-y-6 pb-28 max-w-7xl mx-auto">

				{/* Tabs */}
				<div className="glass-panel p-1 rounded-xl flex overflow-x-auto no-scrollbar gap-1 mb-4 md:mb-6 sticky top-0 z-20 w-full sm:static">
					{['overview', 'intents', 'calendar', 'contacts', 'circles', 'marketing'].map(tab => (
						<button
							key={tab}
							onClick={() => setActiveInternalTab(tab)}
							className={`
							px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap flex-shrink-0
							${activeInternalTab === tab
									? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/20'
									: 'text-slate-400 hover:text-white hover:bg-white/5'}
						`}
						>
							{tab}
						</button>
					))}
				</div>

				{activeInternalTab === 'overview' && (
					<div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
						{/* Hero Card */}
						<div className="glass-panel rounded-2xl p-4 relative overflow-hidden group">
							{/* Decorative BG */}
							<div className="absolute -top-10 -right-10 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
								<QrCode size={180} className="text-white rotate-12" />
							</div>

							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
								{/* Left: Identity */}
								<div className="flex items-center gap-4">
									<div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg ring-1 ring-white/20 shrink-0">
										<span className="text-xl font-bold">J</span>
									</div>
									<div>
										<h2 className="text-xl font-bold text-white leading-tight">Joe's Coffee</h2>
										<div className="flex items-center gap-2 mt-1">
											<span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
												<CheckCircle2 size={10} /> Verified
											</span>
										</div>
									</div>
								</div>

								{/* Right: Stats & Action */}
								<div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
									{/* Compact Stats */}
									<div className="flex items-center gap-4">
										<div>
											<div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">L1 Direct</div>
											<div className="text-lg font-bold text-white leading-none">{BUSINESS_STATS.l1_count}</div>
										</div>
										<div className="w-px h-6 bg-white/10"></div>
										<div>
											<div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Network</div>
											<div className="text-lg font-bold text-white leading-none">25.4k</div>
										</div>
									</div>

									{/* QR Button */}
									<Button
										size="sm"
										className="h-10 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
										onClick={() => setShowLargeQR(true)}
									>
										<QrCode size={16} className="mr-2" />
										<span className="hidden sm:inline">Show </span>QR
									</Button>
								</div>
							</div>
						</div>

						{/* Feed */}
						<div>
							<h3 className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-4 pl-1">Live Feed</h3>
							<div className="space-y-3">
								{RECENT_ACTIVITY.map(item => (
									<div key={item.id} className="glass-card p-4 flex items-center gap-4 group cursor-pointer">
										<div className={`p-3 rounded-xl bg-${item.color}-900/20 text-${item.color}-400 border border-${item.color}-500/20 group-hover:scale-110 transition-transform duration-300`}>
											<item.icon size={20} />
										</div>
										<div className="flex-1 min-w-0">
											<div className="text-white font-medium mb-0.5">{item.msg}</div>
											<div className="text-xs text-slate-500 flex items-center gap-1">
												<Clock size={12} /> {item.time}
											</div>
										</div>
										<ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{activeInternalTab === 'intents' && (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
						{/* Header */}
						<div className="flex items-center gap-4 mb-2">
							<div className="p-3 bg-rose-500/20 rounded-xl border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
								<Target className="text-rose-400" size={24} />
							</div>
							<div>
								<h3 className="text-2xl font-bold text-white">Global Intents</h3>
								<p className="text-sm text-slate-400">Network statistics and activity</p>
							</div>
						</div>

						{/* Stats Grid */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 border-emerald-500/20">
								<CardContent className="p-5">
									<div className="text-3xl font-bold text-white mb-1">12.5k</div>
									<div className="text-sm text-emerald-300 font-medium flex items-center gap-1.5 mb-2"><Activity size={16} /> Active Nodes</div>
									<div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-900/40 px-2 py-1 rounded w-fit"><TrendingUp size={12} /><span>+12% growth</span></div>
								</CardContent>
							</Card>
							<Card className="bg-gradient-to-br from-indigo-900/20 to-indigo-900/5 border-indigo-500/20">
								<CardContent className="p-5">
									<div className="text-3xl font-bold text-white mb-1">148</div>
									<div className="text-sm text-indigo-300 font-medium flex items-center gap-1.5 mb-2"><Globe size={16} /> Countries</div>
									<div className="text-xs text-indigo-400 bg-indigo-900/40 px-2 py-1 rounded w-fit">8 major cities</div>
								</CardContent>
							</Card>
							<Card className="bg-gradient-to-br from-amber-900/20 to-amber-900/5 border-amber-500/20">
								<CardContent className="p-5">
									<div className="text-3xl font-bold text-white mb-1">$2.4M</div>
									<div className="text-sm text-amber-300 font-medium flex items-center gap-1.5 mb-2"><DollarSign size={16} /> Value Flow</div>
									<div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-900/40 px-2 py-1 rounded w-fit"><TrendingUp size={12} /><span>+8% volume</span></div>
								</CardContent>
							</Card>
						</div>

						{/* List */}
						<div className="glass-panel p-6 rounded-2xl">
							<div className="flex justify-between items-center mb-6">
								<h4 className="text-white font-bold text-lg">Top Active Cities</h4>
								<span className="text-xs font-medium text-slate-500 bg-slate-800/50 px-2 py-1 rounded">24h</span>
							</div>
							<div className="space-y-3">
								{[
									{ city: 'New York', country: 'USA', users: 3850, activity: 'Very High' },
									{ city: 'Tokyo', country: 'Japan', users: 2890, activity: 'High' },
									{ city: 'London', country: 'UK', users: 2120, activity: 'High' },
									{ city: 'Mumbai', country: 'India', users: 1980, activity: 'High' },
									{ city: 'Toronto', country: 'Canada', users: 1240, activity: 'Medium' }
								].map((city, idx) => (
									<div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
										<div className="flex items-center gap-4">
											<div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-white group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all">{idx + 1}</div>
											<div>
												<div className="text-sm font-bold text-white">{city.city}</div>
												<div className="text-xs text-slate-500">{city.country}</div>
											</div>
										</div>
										<div className="flex items-center gap-4">
											<div className="text-right">
												<div className="text-sm font-bold text-slate-200">{city.users.toLocaleString()}</div>
												<div className="text-[10px] text-slate-500 uppercase">Users</div>
											</div>
											<div className={`px-2 py-1 rounded text-[10px] font-bold ${city.activity.includes('High') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
												{city.activity}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{activeInternalTab === 'circles' && (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="flex justify-between items-center gap-4">
							<h3 className="text-2xl font-bold text-white">Network Circles</h3>
							<Button size="sm" variant="outline" className="glass-button"><PlusCircle size={16} className="mr-2" /> New Circle</Button>
						</div>

						<div className="grid gap-3 sm:gap-4">
							{circles.map(circle => (
								<div key={circle.id} className="glass-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 relative group overflow-hidden">
									{/* Type Label */}
									{circle.type === 'custom' && (
										<div className="absolute top-0 right-0 px-2 py-1 sm:px-3 bg-indigo-600/80 text-[10px] font-bold text-white rounded-bl-xl shadow-lg z-10">
											CUSTOM
										</div>
									)}

									<div className="flex items-center gap-4 w-full sm:w-auto">
										<div className={`h-12 w-12 sm:h-16 sm:w-16 rounded-2xl flex items-center justify-center bg-${circle.color}-500/20 text-${circle.color}-400 border border-${circle.color}-500/30 shadow-[0_0_15px_rgba(0,0,0,0.2)] shrink-0`}>
											{circle.type === 'system' ? <Layers size={24} className="sm:w-7 sm:h-7" /> : <Circle size={24} className="sm:w-7 sm:h-7" />}
										</div>

										{/* Mobile Only: Title next to icon */}
										<div className="sm:hidden flex-1 min-w-0">
											<h4 className="text-base font-bold text-white mb-0.5 group-hover:text-indigo-300 transition-colors">{circle.name}</h4>
											<p className="text-xs text-slate-400 truncate">{circle.desc}</p>
										</div>
									</div>

									<div className="hidden sm:block flex-1 min-w-0">
										<h4 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">{circle.name}</h4>
										<p className="text-sm text-slate-400">{circle.desc}</p>
									</div>

									<div className="w-full sm:w-auto flex justify-between items-center sm:block sm:text-right sm:pl-4 sm:border-l border-white/5">
										<span className="sm:hidden text-xs font-bold text-slate-500 uppercase">Total Nodes</span>
										<div>
											<div className="text-2xl sm:text-3xl font-bold text-white">{circle.count.toLocaleString()}</div>
											<div className="hidden sm:block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nodes</div>
										</div>
									</div>

									{/* Actions Overlay */}
									{circle.type === 'custom' && (
										<div className="absolute right-2 bottom-2 sm:right-4 sm:bottom-4 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
											<button onClick={(e) => { e.stopPropagation(); openEditCircle(circle); }} className="p-2 bg-slate-800 hover:bg-indigo-600 text-white rounded-lg transition-colors"><Edit2 size={14} /></button>
											<button onClick={(e) => { e.stopPropagation(); handleDeleteCircle(circle.id); }} className="p-2 bg-slate-800 hover:bg-rose-600 text-white rounded-lg transition-colors"><Trash2 size={14} /></button>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				)}

				{activeInternalTab === 'contacts' && (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
						{/* Actions */}
						<div className="grid grid-cols-2 gap-4">
							<Button
								className="h-16 bg-emerald-600/80 hover:bg-emerald-500 font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-500/30"
								onClick={() => openFinancialModal('payment')}
							>
								<DollarSign className="mr-2" /> Receive $
							</Button>
							<Button
								className="h-16 bg-indigo-600/80 hover:bg-indigo-500 font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.2)] border border-indigo-500/30"
								onClick={() => openFinancialModal('invoice')}
							>
								<FileText className="mr-2" /> Send Invoice
							</Button>
						</div>

						<div className="flex justify-between items-center mt-8">
							<h3 className="text-xl font-bold text-white">L1 Direct Nodes</h3>
							<Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20" onClick={() => { setEditingCustomer(null); setShowAddCustomer(true); }}>
								<PlusCircle size={16} className="mr-2" /> Add Contact
							</Button>
						</div>

						<div className="glass-panel rounded-2xl overflow-hidden">
							{customers.map((cust: any, idx: number) => (
								<div
									key={cust.id}
									className={`
									p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group
									${idx !== customers.length - 1 ? 'border-b border-white/5' : ''}
								`}
								>
									<div className="h-12 w-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-lg font-bold text-white shadow-inner">
										{cust.name[0]}
									</div>

									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">{cust.name}</span>
											{cust.isFavorite && <Heart size={12} className="text-rose-500 fill-rose-500" />}
										</div>
										<div className="flex items-center gap-3 text-xs text-slate-400">
											{cust.phones && cust.phones[0] && (
												<span className="flex items-center gap-1"><Phone size={10} /> {cust.phones[0].value}</span>
											)}
											<span className="flex items-center gap-1 opacity-50"><CalendarDays size={10} /> {cust.memberSince}</span>
										</div>
									</div>

									<div className="flex items-center gap-2">
										{cust.tags && cust.tags.slice(0, 2).map((tag: string, i: number) => (
											<span key={i} className="text-[10px] px-2 py-0.5 rounded border border-white/10 bg-white/5 text-slate-300 font-medium">
												{tag}
											</span>
										))}
										<Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white" onClick={(e) => { e.stopPropagation(); setEditingCustomer(cust); setShowAddCustomer(true); }}>
											<Edit2 size={16} />
										</Button>
										<Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white" onClick={(e) => toggleFavorite(e, cust.id)}>
											<Heart size={16} className={cust.isFavorite ? "fill-rose-500 text-rose-500" : ""} />
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{activeInternalTab === 'calendar' && (
					<div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
						<div className="h-24 w-24 rounded-full bg-slate-900/50 flex items-center justify-center mb-6 border border-white/5">
							<CalendarDays size={48} className="text-slate-600" />
						</div>
						<h3 className="text-xl font-bold text-white mb-2">Calendar</h3>
						<p className="text-slate-500">Upcoming appointments feature coming soon.</p>
					</div>
				)}

				{activeInternalTab === 'marketing' && (
					<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<button
								onClick={() => setCampaignMode('retention')}
								className={`
								p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center gap-3 group
								${campaignMode === 'retention'
										? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
										: 'glass-card opacity-60 hover:opacity-100'}
							`}
							>
								<Megaphone size={32} className="group-hover:scale-110 transition-transform" />
								<div>
									<div className="font-bold text-lg">RETENTION</div>
									<div className="text-xs opacity-70">Free • Existing L1</div>
								</div>
							</button>
							<button
								onClick={() => setCampaignMode('growth')}
								className={`
								p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center gap-3 group
								${campaignMode === 'growth'
										? 'bg-indigo-900/20 border-indigo-500/50 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
										: 'glass-card opacity-60 hover:opacity-100'}
							`}
							>
								<Globe size={32} className="group-hover:scale-110 transition-transform" />
								<div>
									<div className="font-bold text-lg">GROWTH</div>
									<div className="text-xs opacity-70">Paid • Targeted</div>
								</div>
							</button>
						</div>

						<div className="glass-panel p-6 rounded-2xl">
							<div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
								<h3 className="text-lg font-bold text-white flex items-center gap-2">
									{campaignMode === 'retention' ? <Zap className="text-emerald-400" /> : <Target className="text-indigo-400" />}
									{campaignMode === 'retention' ? 'Direct Blast' : 'Targeted Signal'}
								</h3>
								<span className="text-xs font-bold text-slate-500 uppercase">{campaignMode === 'retention' ? 'L1 Only' : 'L2/L3 Reach'}</span>
							</div>

							{campaignMode === 'retention' ? (
								<div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-4 items-start mb-6">
									<CheckCircle2 className="text-emerald-400 shrink-0 mt-1" />
									<div>
										<h4 className="font-bold text-emerald-300 mb-1">Free for Business Nodes</h4>
										<p className="text-sm text-emerald-200/70">Send unlimited status updates to customers who have physically tethered.</p>
									</div>
								</div>
							) : (
								<div className="space-y-6 mb-6">
									<div>
										<label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Target Circles</label>
										<div className="grid gap-3 max-h-60 overflow-y-auto pr-2">
											{circles.map(c => {
												const isSelected = selectedMarketingCircles.includes(c.id);
												return (
													<div
														key={c.id}
														onClick={() => toggleMarketingCircle(c.id)}
														className={`
														p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all
														${isSelected ? `bg-${c.color}-900/30 border-${c.color}-500/50` : 'bg-white/5 border-white/5 hover:bg-white/10'}
													`}
													>
														<div className="flex items-center gap-3">
															<div className={`h-10 w-10 rounded-lg flex items-center justify-center text-${c.color}-400 bg-${c.color}-900/20`}>
																{c.type === 'system' ? <Layers size={18} /> : <Circle size={18} />}
															</div>
															<div>
																<div className="text-sm font-bold text-white">{c.name}</div>
																<div className="text-xs text-slate-500">{c.count.toLocaleString()} Nodes</div>
															</div>
														</div>
														{isSelected && <CheckCircle2 size={18} className={`text-${c.color}-400`} />}
													</div>
												);
											})}
										</div>
									</div>
								</div>
							)}

							<div className="space-y-3 pt-6 border-t border-white/5">
								<label className="text-xs font-bold text-slate-400 uppercase">Message Payload</label>
								<textarea
									className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none h-32"
									placeholder={campaignMode === 'retention' ? "Write your update here..." : "Describe your offer..."}
									value={messagePayload}
									onChange={(e) => setMessagePayload(e.target.value)}
								/>
							</div>

							<div className="mt-6 flex items-center justify-between bg-black/40 rounded-xl p-4 border border-white/10">
								<div>
									<div className="text-[10px] font-bold text-slate-500 uppercase">Est. Reach</div>
									<div className="text-xl font-mono font-bold text-white flex items-center gap-2">
										{getTotalReach()} <Users size={16} className="text-slate-600" />
									</div>
								</div>
								<div className="text-right">
									<div className="text-[10px] font-bold text-slate-500 uppercase">Total Cost</div>
									<div className={`text-2xl font-mono font-bold ${campaignMode === 'retention' ? 'text-emerald-400' : 'text-indigo-400'}`}>
										{getTotalPrice()}
									</div>
								</div>
							</div>

							<Button
								className={`w-full h-14 mt-6 text-lg font-bold shadow-xl ${campaignMode === 'retention' ? 'bg-emerald-600 hover:bg-emerald-500' : 'glass-button-primary'}`}
							>
								<Send className="mr-2" /> {campaignMode === 'retention' ? 'Post Update' : 'Broadcast Signal'}
							</Button>
						</div>
					</div>
				)}

				{showAddCustomer && <AddCustomerModal onClose={() => { setShowAddCustomer(false); setEditingCustomer(null); }} onSave={handleAddCustomer} initialData={editingCustomer} />}
				{showLargeQR && <QRModal onClose={() => setShowLargeQR(false)} />}
				{showEditCircleModal && editingCircle && <EditCircleModal circle={editingCircle} onClose={() => { setShowEditCircleModal(false); setEditingCircle(null); }} onSave={handleEditCircle} />}
				{showFinancialModal && <FinancialModal type={financialType} initialCustomer={null} customers={customers} onClose={() => setShowFinancialModal(false)} onSave={handleSaveFinancial} />}
			</div>
		</div>
	);
};
