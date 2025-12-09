import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Clock, ChevronRight, Star, Award, AlertTriangle, Zap, CheckCircle2, Settings } from 'lucide-react';
import { QRModal } from '../../components/modals/QRModal';
import { Button } from '../../components/ui/button';

const BUSINESS_STATS = {
    l1_count: 142,
    l2_reach: 4820,
    l3_reach: 25420,
    trust_score: 94,
};

const RECENT_ACTIVITY = [
    { id: 1, type: 'tether', msg: 'New customer connected via QR', time: '2m ago', icon: QrCode, color: 'emerald' },
    { id: 2, type: 'review', msg: 'Positive feedback received (5★)', time: '15m ago', icon: Star, color: 'amber' },
    { id: 3, type: 'milestone', msg: 'Reached 150 L1 Nodes! 🎉', time: '1h ago', icon: Award, color: 'purple' },
    { id: 4, type: 'ping', msg: 'Retention Campaign sent to 45 nodes', time: '2h ago', icon: Zap, color: 'blue' },
    { id: 5, type: 'alert', msg: 'Unusual activity detected in L2', time: '4h ago', icon: AlertTriangle, color: 'rose' },
];

// Helper to get activity icon colors that work in both themes
const getActivityColors = (color: string) => {
    const colorMap: Record<string, string> = {
        emerald: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
        amber: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20',
        purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20',
        blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20',
        rose: 'bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20',
    };
    return colorMap[color] || colorMap.emerald;
};

export const BusinessOverviewPage = () => {
    const navigate = useNavigate();
    const [showLargeQR, setShowLargeQR] = useState(false);

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-2 md:px-6 pt-0 space-y-2 md:space-y-6 pb-28 max-w-7xl mx-auto">
                <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Hero Card */}
                    <div className="glass-panel rounded-2xl p-4 relative overflow-hidden group">
                        {/* Decorative BG */}
                        <div className="absolute -top-10 -right-10 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                            <QrCode size={180} className="text-slate-900 dark:text-white rotate-12" />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                            {/* Left: Identity */}
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg ring-1 ring-white/20 shrink-0">
                                    <span className="text-xl font-bold">J</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Joe's Coffee</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                                            <CheckCircle2 size={10} /> Verified
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Stats & Action */}
                            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-white/5">
                                {/* Compact Stats */}
                                <div className="flex items-center gap-4">
                                    <div>
                                        <div className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-wider">L1 Direct</div>
                                        <div className="text-lg font-bold text-slate-900 dark:text-white leading-none">{BUSINESS_STATS.l1_count}</div>
                                    </div>
                                    <div className="w-px h-6 bg-slate-200 dark:bg-white/10"></div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-wider">Network</div>
                                        <div className="text-lg font-bold text-slate-900 dark:text-white leading-none">25.4k</div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-10 px-4 font-bold border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                                        onClick={() => navigate('/business/settings')}
                                    >
                                        <Settings size={16} className="mr-2" />
                                        <span className="hidden sm:inline">Edit </span>Business
                                    </Button>

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
                    </div>

                    {/* Feed */}
                    <div>
                        <h3 className="text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider font-bold mb-4 pl-1">Live Feed</h3>
                        <div className="space-y-3">
                            {RECENT_ACTIVITY.map(item => (
                                <div key={item.id} className="glass-card p-4 flex items-center gap-4 group cursor-pointer">
                                    <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 ${getActivityColors(item.color)}`}>
                                        <item.icon size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-slate-900 dark:text-white font-medium mb-0.5">{item.msg}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1">
                                            <Clock size={12} /> {item.time}
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-400 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {showLargeQR && <QRModal onClose={() => setShowLargeQR(false)} />}
            </div>
        </div>
    );
};
