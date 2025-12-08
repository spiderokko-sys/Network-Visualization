import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    User,
    MessageSquare,
    Bell,
    Search,
    Target,
    List,
    Phone,
    ChevronLeft,
    Radar,
    LayoutDashboard,
    Layers,
    Sun,
    Moon
} from 'lucide-react';
import { ExploreMenu } from '../components/ExploreMenu';
import { useTheme } from '../components/ThemeProvider';

const SidebarItem = ({ icon: Icon, label, isActive, onClick, collapsed }: any) => (
    <button
        onClick={onClick}
        className={`
			relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300 w-full group cursor-pointer
			${isActive ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}
			${collapsed ? 'justify-center' : ''}
		`}
        title={collapsed ? label : undefined}
    >
        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_#6366f1]" />}
        <Icon size={22} className={`${isActive ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : ""} transition-all duration-300`} />
        {!collapsed && (
            <span className={`font-medium tracking-wide ${isActive ? "text-indigo-100" : ""}`}>{label}</span>
        )}
    </button>
);

export default function MainLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showExploreMenu, setShowExploreMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const isActive = (path: string) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const getTitle = () => {
        const path = location.pathname.substring(1);
        if (!path) return 'Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1).replace('_', ' ');
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 h-screen text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden flex relative transition-colors duration-300">

            {/* Persistent Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/5 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            {/* Sidebar - Desktop */}
            <aside
                className={`
                    hidden md:flex flex-col z-20 border-r border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-950/30 backdrop-blur-md transition-all duration-300
                    ${sidebarCollapsed ? 'w-20' : 'w-64'}
                `}
            >
                {/* Sidebar Header */}
                <div className="h-20 flex items-center px-6 border-b border-white/5">
                    <div
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate('/business')}
                    >
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
                        isActive={isActive('/business')}
                        onClick={() => navigate('/business')}
                        collapsed={sidebarCollapsed}
                    />
                    <SidebarItem
                        icon={MessageSquare}
                        label="Chats"
                        isActive={isActive('/chats')}
                        onClick={() => navigate('/chats')}
                        collapsed={sidebarCollapsed}
                    />
                    <SidebarItem
                        icon={Layers}
                        label="Circles"
                        isActive={isActive('/circles')}
                        onClick={() => navigate('/circles')}
                        collapsed={sidebarCollapsed}
                    />
                    <SidebarItem
                        icon={Target}
                        label="Intents"
                        isActive={isActive('/intents')}
                        onClick={() => navigate('/intents')}
                        collapsed={sidebarCollapsed}
                    />
                    <SidebarItem
                        icon={List}
                        label="Channels"
                        isActive={isActive('/channels')}
                        onClick={() => navigate('/channels')}
                        collapsed={sidebarCollapsed}
                    />
                    <SidebarItem
                        icon={Phone}
                        label="Calls"
                        isActive={isActive('/calls')}
                        onClick={() => navigate('/calls')}
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

            {/* Main Content Area */}
            <main className="flex-1 relative z-10 flex flex-col h-full overflow-hidden">

                {/* Top Bar (Mobile + Desktop Context) */}
                <header className="h-16 md:h-20 px-4 md:px-6 flex items-center justify-between border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-950/20 backdrop-blur-sm shrink-0 transition-colors duration-300">

                    {/* Mobile Menu Toggle (Visible only on mobile) */}
                    <div
                        className="md:hidden flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate('/business')}
                    >
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Radar className="text-white" size={16} />
                        </div>
                        <span className="font-bold text-lg">GIGMIND</span>
                    </div>

                    {/* Context Title / Breadcrumbs */}
                    <div className="hidden md:block">
                        <h1 className="text-xl font-semibold text-slate-800 dark:text-white capitalize transition-colors duration-300">{getTitle()}</h1>
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

                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-200/50 dark:hover:bg-white/5 active:scale-95"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-200/50 dark:hover:bg-white/5 active:scale-95">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-50 dark:border-slate-950 shadow-[0_0_8px_#f43f5e]"></span>
                        </button>

                        <div
                            className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-[2px] ring-2 ring-transparent hover:ring-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                            onClick={() => navigate('/profile')}
                            title="Go to Profile"
                        >
                            <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center">
                                <User size={16} className="text-cyan-400" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* View Content */}
                <div className="flex-1 overflow-hidden relative">
                    <Outlet />
                </div>

                {/* Mobile Navigation Bar */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-50 flex items-center justify-around pb-safe pt-2 transition-colors duration-300">

                    <button
                        onClick={() => navigate('/chats')}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${isActive('/chats') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                    >
                        <MessageSquare size={20} />
                        <span className="text-[10px] font-medium mt-1">Chats</span>
                    </button>
                    <button
                        onClick={() => navigate('/channels')}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${isActive('/channels') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                    >
                        <List size={20} />
                        <span className="text-[10px] font-medium mt-1">Channels</span>
                    </button>
                    <button
                        onClick={() => navigate('/circles')}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${isActive('/circles') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                    >
                        <Layers size={20} />
                        <span className="text-[10px] font-medium mt-1">Circles</span>
                    </button>
                    <button
                        onClick={() => navigate('/calls')}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${isActive('/calls') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                    >
                        <Phone size={20} />
                        <span className="text-[10px] font-medium mt-1">Calls</span>
                    </button>
                    <button
                        onClick={() => setShowExploreMenu(true)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${showExploreMenu ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                    >
                        <Search size={20} />
                        <span className="text-[10px] font-medium mt-1">Explore</span>
                    </button>
                </div>
            </main>

            {/* Explore Overlay */}
            {showExploreMenu && <ExploreMenu onClose={() => setShowExploreMenu(false)} />}
        </div>
    );
}
