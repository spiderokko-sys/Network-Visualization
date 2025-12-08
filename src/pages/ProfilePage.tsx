import { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit3,
    Camera,
    Award,
    Activity,
    Share2,
    Settings as SettingsIcon,
    CheckCircle2,
    Briefcase
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export const ProfileScreen = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const navigateToSettings = () => navigate('/settings');


    const currentUser = {
        name: "Alex Morgan",
        role: "Senior Broker",
        location: "Toronto, ON",
        email: "alex.morgan@gigmind.net",
        phone: "+1 (416) 555-0199",
        avatar: null, // Placeholder logic for now
        joined: "March 2023",
        status: "Active",
        level: "Platinum",
        bio: "Connecting people and opportunities. Specialist in commercial real estate and tech startups."
    };

    const stats = [
        { label: "Connections", value: "1,240", icon: User, color: "text-blue-400" },
        { label: "Intents Completed", value: "85", icon: CheckCircle2, color: "text-emerald-400" },
        { label: "Profile Views", value: "3.4k", icon: Activity, color: "text-purple-400" },
        { label: "Reputation", value: "98%", icon: Award, color: "text-amber-400" }
    ];

    return (
        <div className="h-full w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-y-auto custom-scrollbar p-3 md:p-6 pb-24">
            <div className="max-w-5xl mx-auto space-y-4">

                {/* Profile Header Card */}
                <div className="relative group rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 overflow-hidden">
                    {/* Compact Cover Image */}
                    <div className="h-24 w-full bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-slate-900/50 relative">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                    </div>

                    <div className="px-4 md:px-6 pb-4 pt-0 relative -mt-10">
                        {/* Compact Layout: Avatar + Info in one row */}
                        <div className="flex items-end gap-4">
                            {/* Smaller Avatar */}
                            <div className="relative flex-shrink-0">
                                <div className="w-20 h-20 rounded-2xl border-3 border-white/90 dark:border-slate-950 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-xl relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                                    {currentUser.avatar ? (
                                        <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-bold bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent">AM</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/10 dark:bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                        <Camera className="text-slate-900 dark:text-white" size={18} />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" title="Online"></div>
                            </div>

                            {/* Compact Info Section */}
                            <div className="flex-1 pb-1 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{currentUser.name}</h1>
                                            <button
                                                onClick={navigateToSettings}
                                                className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-slate-400 transition-all hover:scale-105 active:scale-95"
                                                title="Settings"
                                            >
                                                <SettingsIcon size={16} />
                                            </button>
                                        </div>
                                        <p className="text-indigo-400 font-medium flex items-center gap-1.5 text-sm mt-0.5">
                                            <Briefcase size={14} />
                                            {currentUser.role}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button onClick={navigateToSettings} className="hidden md:flex px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95 items-center gap-1.5">
                                            <Edit3 size={14} />
                                            Edit
                                        </button>
                                        <button className="p-1.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-white/5 transition-colors">
                                            <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-slate-600 dark:text-slate-400 text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={12} className="text-slate-500 dark:text-slate-500" />
                                        {currentUser.location}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Mail size={12} className="text-slate-500 dark:text-slate-500" />
                                        {currentUser.email}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={12} className="text-slate-500 dark:text-slate-500" />
                                        Joined {currentUser.joined}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Edit Button */}
                        <button onClick={navigateToSettings} className="md:hidden w-full mt-3 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                            <Edit3 size={14} />
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                            <div className="flex items-start justify-between mb-1.5">
                                <div className={`p-1.5 rounded-lg bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={18} />
                                </div>
                                {idx === 3 && <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">+2.4%</span>}
                            </div>
                            <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-500">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Content Tabs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Tab Navigation */}
                        <div className="flex items-center gap-1 border-b border-white/5 pb-2">
                            {['Overview', 'Activity', 'Intents'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${activeTab === tab.toLowerCase()
                                        ? 'text-slate-900 dark:text-white bg-white/5'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-white/5'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab.toLowerCase() && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 mx-4 rounded-t-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'overview' && (
                            <div className="bg-white/50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 rounded-2xl p-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">About</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {currentUser.bio}
                                </p>

                                <div className="mt-5">
                                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3 uppercase tracking-wider">Expertise</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['Negotiation', 'Strategic Planning', 'Market Analysis', 'Leadership', 'Public Speaking'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full text-xs font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'activity' && (
                            <div className="bg-white/50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 rounded-2xl p-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
                                <div className="space-y-6">
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-indigo-500 transition-colors"></div>
                                                <div className="w-0.5 h-full bg-slate-800 my-1 group-last:hidden"></div>
                                            </div>
                                            <div>
                                                <p className="text-slate-600 dark:text-slate-300 text-sm">
                                                    <span className="text-indigo-400 font-medium cursor-pointer hover:underline">Alex Morgan</span> closed a deal with <span className="text-slate-900 dark:text-white font-medium">TechFlow Inc.</span>
                                                </p>
                                                <span className="text-xs text-slate-500 dark:text-slate-500">2 hours ago</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'intents' && (
                            <div className="bg-white/50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 rounded-2xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Completed Intents</h3>
                                    <button className="text-xs text-indigo-400 hover:text-indigo-300">View All</button>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { title: "Acquire Tech Startup", status: "Completed", date: "Oct 12, 2023", value: "$2.5M" },
                                        { title: "Expand Market Reach", status: "Completed", date: "Sep 28, 2023", value: "$500K" },
                                        { title: "Series B Funding", status: "Completed", date: "Aug 15, 2023", value: "$12M" },
                                        { title: "Strategic Partnership", status: "Completed", date: "Jul 03, 2023", value: "N/A" },
                                    ].map((intent, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-slate-700 dark:text-slate-200 font-medium text-sm">{intent.title}</div>
                                                    <div className="text-slate-500 dark:text-slate-500 text-xs">{intent.date}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-slate-900 dark:text-white font-medium text-sm">{intent.value}</div>
                                                <div className="text-emerald-400 text-xs">{intent.status}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-4">


                        {/* Personal Information */}
                        <div className="bg-white/50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 rounded-2xl p-4">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Information</h3>
                            <div className="space-y-4">

                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-500">
                                        <Phone size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-500 dark:text-slate-500">Phone</div>
                                        <div className="text-sm text-slate-600 dark:text-slate-300">+1 (416) 555-0199</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
