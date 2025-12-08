import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Target, CalendarDays, Users, Layers, Megaphone } from 'lucide-react';

const TabButton = ({ icon: Icon, label, path, currentPath }: any) => {
    const navigate = useNavigate();
    const isActive = currentPath === path;

    return (
        <button
            onClick={() => navigate(path)}
            className={`
				px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap flex-shrink-0
				${isActive
                    ? 'bg-indigo-600/80 text-slate-900 dark:text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}
			`}
        >
            <Icon size={14} className="inline mr-1.5" />
            {label}
        </button>
    );
};

export default function BusinessLayout() {
    const location = useLocation();

    const tabs = [
        { path: '/business', label: 'Overview', icon: LayoutDashboard },
        { path: '/business/intents', label: 'Intents', icon: Target },
        { path: '/business/calendar', label: 'Calendar', icon: CalendarDays },
        { path: '/business/contacts', label: 'Contacts', icon: Users },
        { path: '/business/circles', label: 'Circles', icon: Layers },
        { path: '/business/marketing', label: 'Marketing', icon: Megaphone },
    ];

    return (
        <div className="h-full flex flex-col">
            {/* Tabs Navigation */}
            <div className="glass-panel p-1 rounded-xl flex overflow-x-auto no-scrollbar gap-1 mb-4 md:mb-6 sticky top-0 z-20 w-full sm:static mx-4 md:mx-6 mt-4">
                {tabs.map(tab => (
                    <TabButton
                        key={tab.path}
                        icon={tab.icon}
                        label={tab.label}
                        path={tab.path}
                        currentPath={location.pathname}
                    />
                ))}
            </div>

            {/* Page Content */}
            <div className="flex-1 overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
}
