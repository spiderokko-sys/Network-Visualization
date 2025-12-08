import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Maximize2,
    X,
    Layers,
    Target,
    Users,
    Calendar as CalendarIcon,
    Briefcase,
    CreditCard,
    User,
    Sliders
} from 'lucide-react';

const EXPLORE_LINKS = [
    { title: "Circles", subtitle: "Network & Map", icon: Layers, color: "text-blue-400", path: "/circles" },
    { title: "Intents", subtitle: "Objectives summary", icon: Target, color: "text-red-400", path: "/intents" },
    { title: "Contacts", subtitle: "Manage connections", icon: Users, color: "text-indigo-400", path: "/contacts" },
    { title: "Events", subtitle: "Upcoming activities", icon: CalendarIcon, color: "text-purple-400", path: "/events" },
    { title: "Business", subtitle: "Business Center Tools", icon: Briefcase, color: "text-emerald-400", path: "/" },
    { title: "Wallet", subtitle: "Payment methods", icon: CreditCard, color: "text-pink-400", path: "/wallet" },
    { title: "Profile", subtitle: "Your account", icon: User, color: "text-cyan-400", path: "/profile" },
    { title: "Settings", subtitle: "App preferences", icon: Sliders, color: "text-slate-400", path: "/settings" },
];

interface ExploreMenuProps {
    onClose: () => void;
}

export const ExploreMenu = ({ onClose }: ExploreMenuProps) => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Center Panel */}
            <div className="relative glass-panel w-full max-w-lg rounded-2xl p-6 overflow-y-auto max-h-[85vh] animate-in zoom-in-95 duration-300">

                {/* Background Splashes */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />

                {/* Header */}
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2 tracking-tight">
                            <span className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400 ring-1 ring-indigo-500/30"><Maximize2 size={18} /></span>
                            Command Center
                        </h3>
                        <p className="text-sm text-slate-400 mt-1 ml-1">Navigate your GigMind tools</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-slate-300 transition-colors border border-white/5 active:scale-95 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Grid Links */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
                    {EXPLORE_LINKS.map((link) => (
                        <button
                            key={link.title}
                            className="group flex flex-col items-center justify-center gap-2.5 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5 cursor-pointer active:scale-95"
                            onClick={() => handleNavigation(link.path)}
                        >
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 shadow-lg`}>
                                <link.icon size={24} className={`${link.color} drop-shadow-md`} />
                            </div>
                            <div className="text-center">
                                <div className="text-slate-200 font-semibold text-sm group-hover:text-white transition-colors">{link.title}</div>
                                <div className="text-slate-500 text-[10px] mt-0.5 group-hover:text-slate-400">{link.subtitle}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
