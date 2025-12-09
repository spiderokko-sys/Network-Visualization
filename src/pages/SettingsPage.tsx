import {
    Bell,
    Lock,
    User,
    Moon,
    LogOut,
    CreditCard,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

export const SettingsScreen = () => {
    const settingsCategories = [
        { id: 'general', label: 'General', icon: User, path: 'general' },
        { id: 'notifications', label: 'Notifications', icon: Bell, path: 'notifications' },
        { id: 'privacy', label: 'Privacy & Security', icon: Lock, path: 'privacy' },
        { id: 'appearance', label: 'Appearance', icon: Moon, path: 'appearance' },
        { id: 'billing', label: 'Billing', icon: CreditCard, path: 'billing' },
    ];

    return (
        <div className="h-full w-full bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar for Settings */}
            <div className="w-full md:w-64 bg-white dark:bg-slate-900/30 border-r border-slate-200 dark:border-white/5 flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h2>
                </div>
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {settingsCategories.map((category) => (
                        <NavLink
                            key={category.id}
                            to={category.path}
                            className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                                }`}
                        >
                            <category.icon size={18} />
                            {category.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-200 dark:border-white/5 mb-Safe">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Settings Content */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
