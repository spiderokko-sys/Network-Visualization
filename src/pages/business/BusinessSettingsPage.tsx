import { Building2, MapPin, Palette, Bell, Shield, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BusinessSettingsPage = () => {
    const navigate = useNavigate();

    const settingsCards = [
        {
            id: 'general',
            title: 'General Information',
            description: 'Manage your business name, industry, and basic details',
            icon: Building2,
            path: '/business/settings/general',
            color: 'indigo'
        },
        {
            id: 'locations',
            title: 'Locations',
            description: 'Add and manage your business locations and addresses',
            icon: MapPin,
            path: '/business/settings/locations',
            color: 'emerald'
        },
        {
            id: 'branding',
            title: 'Branding & Theme',
            description: 'Customize your brand colors, logo, and visual identity',
            icon: Palette,
            path: '/business/settings/branding',
            color: 'purple'
        },
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Configure how and when you receive notifications',
            icon: Bell,
            path: '/business/settings/notifications',
            color: 'amber'
        },
        {
            id: 'security',
            title: 'Security',
            description: 'Manage passwords, 2FA, and account security settings',
            icon: Shield,
            path: '/business/settings/security',
            color: 'rose'
        }
    ];

    const getColorClasses = (color: string) => {
        const colorMap: Record<string, { bg: string; text: string; border: string }> = {
            indigo: {
                bg: 'bg-indigo-100 dark:bg-indigo-500/20',
                text: 'text-indigo-600 dark:text-indigo-400',
                border: 'border-indigo-200 dark:border-indigo-500/30'
            },
            emerald: {
                bg: 'bg-emerald-100 dark:bg-emerald-500/20',
                text: 'text-emerald-600 dark:text-emerald-400',
                border: 'border-emerald-200 dark:border-emerald-500/30'
            },
            purple: {
                bg: 'bg-purple-100 dark:bg-purple-500/20',
                text: 'text-purple-600 dark:text-purple-400',
                border: 'border-purple-200 dark:border-purple-500/30'
            },
            amber: {
                bg: 'bg-amber-100 dark:bg-amber-500/20',
                text: 'text-amber-600 dark:text-amber-400',
                border: 'border-amber-200 dark:border-amber-500/30'
            },
            rose: {
                bg: 'bg-rose-100 dark:bg-rose-500/20',
                text: 'text-rose-600 dark:text-rose-400',
                border: 'border-rose-200 dark:border-rose-500/30'
            }
        };
        return colorMap[color] || colorMap.indigo;
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <div className="max-w-5xl mx-auto px-2 md:px-6 pb-20 space-y-6">

                {/* Header */}
                <div className="pt-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Business Settings</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your business profile and preferences</p>
                </div>

                {/* Settings Cards Grid */}
                <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {settingsCards.map((card) => {
                        const colors = getColorClasses(card.color);
                        return (
                            <button
                                key={card.id}
                                onClick={() => navigate(card.path)}
                                className="glass-panel p-6 rounded-xl text-left group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${colors.bg} ${colors.text} border ${colors.border} group-hover:scale-110 transition-transform duration-300`}>
                                        <card.icon size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                {card.title}
                                            </h3>
                                            <ChevronRight
                                                size={20}
                                                className="text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0"
                                            />
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {card.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Quick Info */}
                <div className="glass-panel p-6 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg ring-1 ring-white/20 shrink-0">
                            <span className="text-lg font-bold">J</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Joe's Coffee</h3>
                            <p className="text-sm text-slate-500 mt-0.5">Food & Beverage • New York, NY</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                                    Verified Business
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
