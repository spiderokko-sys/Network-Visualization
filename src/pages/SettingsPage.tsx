import { useState } from 'react';
import {
    Bell,
    Lock,
    User,
    Moon,
    Globe,
    LogOut,
    ChevronRight,
    ToggleLeft,
    ToggleRight,
    CreditCard,
    Settings as SettingsIcon
} from 'lucide-react';

export const SettingsScreen = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [notifications, setNotifications] = useState(true);
    const [emailUpdates, setEmailUpdates] = useState(false);

    const settingsCategories = [
        { id: 'general', label: 'General', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy & Security', icon: Lock },
        { id: 'appearance', label: 'Appearance', icon: Moon },
        { id: 'billing', label: 'Billing', icon: CreditCard },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold text-white">General Settings</h2>
                            <p className="text-slate-400 text-sm">Manage your account information and preferences.</p>
                        </div>

                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                            <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                                <div className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">Personal Information</div>
                                        <div className="text-xs text-slate-500">Update your name, bio, and contact info</div>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-600 group-hover:text-slate-300 transition-colors" />
                            </div>

                            <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                                <div className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">Language & Region</div>
                                        <div className="text-xs text-slate-500">English (US), Timezone: EST</div>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-600 group-hover:text-slate-300 transition-colors" />
                            </div>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold text-white">Notifications</h2>
                            <p className="text-slate-400 text-sm">Choose how you want to be notified.</p>
                        </div>

                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-white font-medium">Push Notifications</div>
                                    <div className="text-xs text-slate-500">Receive notifications on your device</div>
                                </div>
                                <button onClick={() => setNotifications(!notifications)} className={`transition-colors text-2xl ${notifications ? 'text-indigo-500' : 'text-slate-600'}`}>
                                    {notifications ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-white font-medium">Email Updates</div>
                                    <div className="text-xs text-slate-500">Receive weekly summaries and product updates</div>
                                </div>
                                <button onClick={() => setEmailUpdates(!emailUpdates)} className={`transition-colors text-2xl ${emailUpdates ? 'text-indigo-500' : 'text-slate-600'}`}>
                                    {emailUpdates ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500 animate-in fade-in duration-300">
                        <SettingsIcon size={48} className="mb-4 opacity-20" />
                        <p>This section is under construction</p>
                    </div>
                );
        }
    };

    return (
        <div className="h-full w-full bg-slate-950 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar for Settings */}
            <div className="w-full md:w-64 bg-slate-900/30 border-r border-white/5 flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Settings</h2>
                </div>
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {settingsCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveTab(category.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === category.id
                                ? 'bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                }`}
                        >
                            <category.icon size={18} />
                            {category.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/5 mb-Safe">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Settings Content */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
