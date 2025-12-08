import { useState } from 'react';
import {
	User,
	Users,
	MessageSquare,
	Bell,
	Search,
	X,
	Target,
	List,
	Calendar as CalendarIcon,
	Phone,
	ChevronLeft,
	CreditCard,
	Briefcase,
	Maximize2,
	Layers,
	Sliders,
	Radar,
	LayoutDashboard
} from 'lucide-react';
import { CallsModule } from './components/CallsModule';
import { ChatsModule } from './components/ChatsModule';
import { ChannelsModule } from './components/ChannelsModule';
import { BusinessDashboard } from './components/BusinessDashboard';
import { GlobeWithUI } from './components/GlobeMap';
import { NetworkCircles } from './components/NetworkCircles';

// --- Mock Data Constants (kept from original) ---
const MOCK_CUSTOMERS = [
	{
		id: 1,
		name: 'Alice M.',
		status: 'L1',
		tags: ['Regular', 'Coffee'],
		visits: 12,
		last_seen: '2h ago',
		memberSince: 'Oct 2023',
		isFavorite: true,
		emails: [{ id: 'e1', value: 'alice.m@gigmind.net', isPrimary: true }],
		phones: [{ id: 'p1', value: '416-555-0192', isPrimary: true }, { id: 'p2', value: '647-555-0000', isPrimary: false }],
		history: [
			{ id: 101, date: 'Nov 20, 2025', service: 'Catering Consult', notes: 'Booked for office party. Loves pastries.' },
			{ id: 102, date: 'Oct 15, 2025', service: 'Coffee Order', notes: 'Large takeaway. Mentioned she works at the tech hub.' }
		],
		upcoming: [],
		finance: [
			{ id: 'f1', type: 'payment', amount: 45.50, date: 'Nov 20, 2025', status: 'completed', description: 'Catering Deposit' },
			{ id: 'f2', type: 'invoice', amount: 120.00, date: 'Nov 18, 2025', status: 'pending', description: 'Office Lunch Event' }
		],
		notes: [
			{ id: 1, text: 'Alice prefers oat milk. Birthday is in Dec.', date: 'Nov 10, 2025', attachment: null }
		],
		documents: [
			{ id: 1, name: 'Catering_Contract_v1.pdf', date: 'Nov 20, 2025', size: '2.4MB' }
		],
		reminders: [
			{ id: 1, text: 'Call to confirm headcount', date: 'Nov 25, 2025', done: false }
		]
	},
	{
		id: 2,
		name: 'Bob D.',
		status: 'L1',
		tags: ['Big Spender'],
		visits: 5,
		last_seen: '1d ago',
		memberSince: 'Jan 2024',
		isFavorite: false,
		emails: [{ id: 'e1', value: 'bob.builder@gigmind.net', isPrimary: true }],
		phones: [{ id: 'p1', value: '647-555-9921', isPrimary: true }],
		history: [
			{ id: 201, date: 'Nov 18, 2025', service: 'Private Event', notes: 'Birthday booking. Very particular about seating.' }
		],
		upcoming: [
			{ id: 202, date: 'Nov 28, 2025', time: '10:00 AM', service: 'Follow-up' }
		],
		finance: [],
		notes: [],
		documents: [],
		reminders: []
	},
	{ id: 3, name: 'Charlie', status: 'L1', tags: [], visits: 1, last_seen: 'Just now', memberSince: 'Nov 2025', isFavorite: false, emails: [{ id: 'e1', value: 'charlie@gigmind.net', isPrimary: true }], phones: [], history: [], upcoming: [], finance: [], notes: [], documents: [], reminders: [] },
	{ id: 4, name: 'Sarah J.', status: 'L1', tags: ['Vegan'], visits: 8, last_seen: '3d ago', memberSince: 'Mar 2024', isFavorite: true, emails: [{ id: 'e1', value: 'sarah.j@gigmind.net', isPrimary: true }], phones: [{ id: 'p1', value: '416-555-3322', isPrimary: true }], history: [], upcoming: [], finance: [], notes: [], documents: [], reminders: [] },
	{ id: 5, name: 'Davina K.', status: 'L1', tags: ['Student'], visits: 22, last_seen: '4h ago', memberSince: 'Sep 2023', isFavorite: false, emails: [{ id: 'e1', value: 'davina@gigmind.net', isPrimary: true }], phones: [], history: [], upcoming: [], finance: [], notes: [], documents: [], reminders: [] },
];

const EXPLORE_LINKS = [
	{ title: "Circles", subtitle: "Network & Map", icon: Layers, color: "text-blue-400" },
	{ title: "Intents", subtitle: "Objectives summary", icon: Target, color: "text-red-400" },
	{ title: "Contacts", subtitle: "Manage connections", icon: Users, color: "text-indigo-400" },
	{ title: "Events", subtitle: "Upcoming activities", icon: CalendarIcon, color: "text-purple-400" },
	{ title: "Business", subtitle: "Business Center Tools", icon: Briefcase, color: "text-emerald-400" },
	{ title: "Wallet", subtitle: "Payment methods", icon: CreditCard, color: "text-pink-400" },
	{ title: "Profile", subtitle: "Your account", icon: User, color: "text-cyan-400" },
	{ title: "Settings", subtitle: "App preferences", icon: Sliders, color: "text-slate-400" },
];

const ExploreMenu = ({ onClose, setActiveView }: { onClose: () => void, setActiveView: (view: string) => void }) => {
	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
				onClick={onClose}
			/>

			{/* Center Panel */}
			<div className="relative glass-panel w-full max-w-2xl rounded-3xl p-8 overflow-hidden animate-in zoom-in-95 duration-300">

				{/* Background Splashes */}
				<div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
				<div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

				{/* Header */}
				<div className="flex justify-between items-center mb-10 relative z-10">
					<div>
						<h3 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
							<span className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400 ring-1 ring-indigo-500/30"><Maximize2 size={24} /></span>
							Command Center
						</h3>
						<p className="text-base text-slate-400 mt-2 ml-1">Navigate your GigMind tools</p>
					</div>
					<button
						onClick={onClose}
						className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-slate-300 transition-colors border border-white/5 active:scale-95 cursor-pointer"
					>
						<X size={24} />
					</button>
				</div>

				{/* Grid Links */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
					{EXPLORE_LINKS.map((link) => (
						<button
							key={link.title}
							className="group flex flex-col items-center justify-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5 cursor-pointer active:scale-95"
							onClick={() => {
								if (link.title === 'Business') {
									setActiveView('dashboard');
								} else if (link.title === 'Circles') {
									setActiveView('network_circles');
								} else if (link.title === 'Intents') {
									setActiveView('intents_globe');
								} else {
									// Default fallback or placeholder
								}
								onClose();
							}}
						>
							<div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 shadow-lg`}>
								<link.icon size={32} className={`${link.color} drop-shadow-md`} />
							</div>
							<div className="text-center">
								<div className="text-slate-200 font-semibold text-lg group-hover:text-white transition-colors">{link.title}</div>
								<div className="text-slate-500 text-xs mt-1 group-hover:text-slate-400">{link.subtitle}</div>
							</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};



const IntentsGlobeView = ({ onBack }: { onBack: () => void }) => {
	return (
		<div className="h-full w-full relative animate-in fade-in duration-700 bg-slate-950">
			<div className="absolute top-6 left-6 z-20">
				<button onClick={onBack} className="glass-button">
					<ChevronLeft size={16} /> Back
				</button>
			</div>
			<GlobeWithUI showHeader={false} />
		</div>
	);
};

// --- Main Layout Components ---

const SidebarItem = ({ icon: Icon, label, isActive, onClick, collapsed }: any) => (
	<button
		onClick={onClick}
		className={`
			relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 w-full group cursor-pointer
			${isActive ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}
			${collapsed ? 'justify-center' : ''}
		`}
	>
		{isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_#6366f1]" />}
		<Icon size={22} className={`${isActive ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : ""} transition-all duration-300`} />
		{!collapsed && (
			<span className={`font-medium tracking-wide ${isActive ? "text-indigo-100" : ""}`}>{label}</span>
		)}

		{/* Tooltip for collapsed state */}

	</button>
);

export default function App() {
	const [showExploreMenu, setShowExploreMenu] = useState(false);
	const [activeView, setActiveView] = useState('dashboard');
	const [dashboardTab, setDashboardTab] = useState('overview');
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [selectedChannel, setSelectedChannel] = useState<any>(null);
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

	const renderContent = () => {
		switch (activeView) {
			case 'calls':
				return <CallsModule customers={MOCK_CUSTOMERS} />;
			case 'chats':
				return <ChatsModule selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />;
			case 'channels':
				return <ChannelsModule selectedChannel={selectedChannel} setSelectedChannel={setSelectedChannel} />;
			case 'network_circles':
				return <NetworkCircles onBack={() => setActiveView('dashboard')} setActiveView={setActiveView} setSelectedChannel={setSelectedChannel} />;
			case 'intents_globe':
				return <IntentsGlobeView key="intents-globe-view" onBack={() => setActiveView('dashboard')} />;
			case 'dashboard':
			default:
				return <BusinessDashboard customers={MOCK_CUSTOMERS} initialTab={dashboardTab} />;
		}
	};

	// Determine if we should show the full sidebar or not
	const isFullScreenView = activeView === 'network_circles' || activeView === 'intents_globe';

	return (
		<div className="bg-slate-950 h-screen text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden flex relative">

			{/* Persistent Ambient Background */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				<div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[120px] animate-pulse-slow" />
				<div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/5 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
			</div>

			{/* Sidebar - Desktop */}
			{!isFullScreenView && (
				<aside
					className={`
						hidden md:flex flex-col z-20 border-r border-white/5 bg-slate-950/30 backdrop-blur-md transition-all duration-300
						${sidebarCollapsed ? 'w-20' : 'w-64'}
					`}
				>
					{/* Sidebar Header */}
					<div className="h-20 flex items-center px-6 border-b border-white/5">
						<div className="flex items-center gap-3">
							<div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] ring-1 ring-white/10 shrink-0">
								<Radar className="text-white" size={22} />
							</div>
							{!sidebarCollapsed && (
								<span className="font-extrabold text-xl tracking-tight text-white drop-shadow-md whitespace-nowrap">
									GIGMIND<span className="text-indigo-400">x</span>
								</span>
							)}
						</div>
					</div>

					{/* Navigation */}
					<div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto scrollbar-hide">
						<div className={`px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ${sidebarCollapsed ? 'text-center' : ''}`}>
							{sidebarCollapsed ? 'Menu' : 'Main'}
						</div>

						<SidebarItem
							icon={LayoutDashboard}
							label="Dashboard"
							isActive={activeView === 'dashboard'}
							onClick={() => setActiveView('dashboard')}
							collapsed={sidebarCollapsed}
						/>
						<SidebarItem
							icon={MessageSquare}
							label="Chats"
							isActive={activeView === 'chats'}
							onClick={() => setActiveView('chats')}
							collapsed={sidebarCollapsed}
						/>
						<SidebarItem
							icon={List}
							label="Channels"
							isActive={activeView === 'channels'}
							onClick={() => setActiveView('channels')}
							collapsed={sidebarCollapsed}
						/>
						<SidebarItem
							icon={Phone}
							label="Calls"
							isActive={activeView === 'calls'}
							onClick={() => setActiveView('calls')}
							collapsed={sidebarCollapsed}
						/>

						<div className="my-4 border-t border-white/5 mx-2" />

						<div className={`px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ${sidebarCollapsed ? 'text-center' : ''}`}>
							{sidebarCollapsed ? 'Apps' : 'Explore'}
						</div>

						<SidebarItem
							icon={Search}
							label="Expore Apps"
							isActive={false}
							onClick={() => setShowExploreMenu(true)}
							collapsed={sidebarCollapsed}
						/>
					</div>

					{/* Sidebar Footer */}
					<div className="p-4 border-t border-white/5">
						<button
							onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
							className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
						>
							{sidebarCollapsed ? <ChevronLeft size={20} className="rotate-180" /> : <ChevronLeft size={20} />}
						</button>
					</div>
				</aside>
			)}

			{/* Main Content Area */}
			<main className="flex-1 relative z-10 flex flex-col h-full overflow-hidden">

				{/* Top Bar (Mobile + Desktop Context) */}
				{!isFullScreenView && (
					<header className="h-20 px-6 flex items-center justify-between border-b border-white/5 bg-slate-950/20 backdrop-blur-sm shrink-0">

						{/* Mobile Menu Toggle (Visible only on mobile) */}
						<div className="md:hidden flex items-center gap-3">
							<div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
								<Radar className="text-white" size={16} />
							</div>
							<span className="font-bold text-lg">GIGMIND</span>
						</div>

						{/* Context Title / Breadcrumbs */}
						<div className="hidden md:block">
							<h1 className="text-xl font-semibold text-white capitalize">{activeView.replace('_', ' ')}</h1>
						</div>

						{/* Right Actions */}
						<div className="flex items-center gap-4">
							<button
								onClick={() => setShowExploreMenu(true)}
								className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition-colors"
							>
								<Search size={14} />
								<span className="text-xs font-medium">Search...</span>
								<span className="ml-2 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-400">⌘K</span>
							</button>

							<button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5 active:scale-95">
								<Bell size={20} />
								<span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-950 shadow-[0_0_8px_#f43f5e]"></span>
							</button>

							<div
								className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-[2px] ring-2 ring-transparent hover:ring-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
								onClick={() => setActiveView('dashboard')}
								title="Go to Dashboard"
							>
								<div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center">
									<User size={16} className="text-cyan-400" />
								</div>
							</div>
						</div>
					</header>
				)}

				{/* View Content */}
				<div className="flex-1 overflow-hidden relative">
					{renderContent()}
				</div>

				{/* Mobile Navigation Bar */}
				{!isFullScreenView && !(activeView === 'chats' && selectedChatId) && (
					<div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-around px-2 pb-safe">
						<SidebarItem icon={Phone} label="Calls" isActive={activeView === 'calls'} onClick={() => setActiveView('calls')} collapsed={true} />
						<SidebarItem icon={MessageSquare} label="Chats" isActive={activeView === 'chats'} onClick={() => setActiveView('chats')} collapsed={true} />
						<SidebarItem icon={Search} label="Explore" isActive={showExploreMenu} onClick={() => setShowExploreMenu(true)} collapsed={true} />
						<SidebarItem icon={User} label="Profile" isActive={false} onClick={() => setActiveView('dashboard')} collapsed={true} />
					</div>
				)}
			</main>

			{/* Explore Overlay */}
			{showExploreMenu && <ExploreMenu onClose={() => setShowExploreMenu(false)} setActiveView={setActiveView} />}
		</div>
	);
}