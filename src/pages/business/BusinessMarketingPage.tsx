import { useState } from 'react';
import { Megaphone, Globe, Zap, Target, CheckCircle2, Layers, Circle, Users, Send } from 'lucide-react';
import { Button } from '../../components/ui/button';

const INITIAL_CIRCLES = [
    { id: 'l1', name: 'L1: Inner Orbit', type: 'system', count: 142, color: 'emerald', desc: 'Directly connected customers.' },
    { id: 'l2', name: 'L2: Social Halo', type: 'system', count: 4820, color: 'amber', desc: 'Friends of your customers.' },
    { id: 'l3', name: 'L3: Deep Network', type: 'system', count: 25420, color: 'slate', desc: 'Anonymous reach in region.' },
    { id: 'c1', name: 'Weekend Regulars', type: 'custom', count: 45, color: 'indigo', desc: 'Visit Sat/Sun > 2 times/mo' },
    { id: 'c2', name: 'Local Tech Workers', type: 'custom', count: 850, color: 'cyan', desc: 'Tag: Tech + Geo: <1km' },
];

const BUSINESS_STATS = {
    l1_count: 142,
    l2_reach: 4820,
    l3_reach: 25420,
    trust_score: 94,
};

// Helper to get circle-specific colors that work in both themes
const getCircleColors = (color: string, isSelected: boolean) => {
    const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
        emerald: {
            bg: isSelected ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-white dark:bg-white/5',
            border: isSelected ? 'border-emerald-400 dark:border-emerald-500/50' : 'border-slate-200 dark:border-white/5',
            text: 'text-emerald-600 dark:text-emerald-400',
            icon: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
        },
        amber: {
            bg: isSelected ? 'bg-amber-50 dark:bg-amber-900/30' : 'bg-white dark:bg-white/5',
            border: isSelected ? 'border-amber-400 dark:border-amber-500/50' : 'border-slate-200 dark:border-white/5',
            text: 'text-amber-600 dark:text-amber-400',
            icon: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
        },
        slate: {
            bg: isSelected ? 'bg-slate-100 dark:bg-slate-900/30' : 'bg-white dark:bg-white/5',
            border: isSelected ? 'border-slate-400 dark:border-slate-500/50' : 'border-slate-200 dark:border-white/5',
            text: 'text-slate-600 dark:text-slate-400',
            icon: 'bg-slate-100 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400'
        },
        indigo: {
            bg: isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'bg-white dark:bg-white/5',
            border: isSelected ? 'border-indigo-400 dark:border-indigo-500/50' : 'border-slate-200 dark:border-white/5',
            text: 'text-indigo-600 dark:text-indigo-400',
            icon: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
        },
        cyan: {
            bg: isSelected ? 'bg-cyan-50 dark:bg-cyan-900/30' : 'bg-white dark:bg-white/5',
            border: isSelected ? 'border-cyan-400 dark:border-cyan-500/50' : 'border-slate-200 dark:border-white/5',
            text: 'text-cyan-600 dark:text-cyan-400',
            icon: 'bg-cyan-100 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400'
        },
    };
    return colorMap[color] || colorMap.slate;
};

export const BusinessMarketingPage = () => {
    const [campaignMode, setCampaignMode] = useState('retention');
    const [selectedMarketingCircles, setSelectedMarketingCircles] = useState(['l1']);
    const [geoScope] = useState<string | null>('city');
    const [selectedInterests] = useState<string[]>([]);
    const [messagePayload, setMessagePayload] = useState('');
    const circles = INITIAL_CIRCLES;

    const toggleMarketingCircle = (id: string) => setSelectedMarketingCircles(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

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

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-4 md:px-6 pt-0 space-y-3 md:space-y-4 pb-28 max-w-7xl mx-auto">
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Campaign Mode Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={() => setCampaignMode('retention')}
                            className={`
								p-3 rounded-lg border transition-all duration-300 flex flex-col items-center text-center gap-1.5 group
								${campaignMode === 'retention'
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-500/50 text-emerald-600 dark:text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                                    : 'glass-card opacity-60 hover:opacity-100'}
							`}
                        >
                            <Megaphone size={24} className="group-hover:scale-110 transition-transform" />
                            <div>
                                <div className="font-bold text-sm">RETENTION</div>
                                <div className="text-xs opacity-70">Free • Existing L1</div>
                            </div>
                        </button>
                        <button
                            onClick={() => setCampaignMode('growth')}
                            className={`
								p-3 rounded-lg border transition-all duration-300 flex flex-col items-center text-center gap-1.5 group
								${campaignMode === 'growth'
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-400 dark:border-indigo-500/50 text-indigo-600 dark:text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                                    : 'glass-card opacity-60 hover:opacity-100'}
							`}
                        >
                            <Globe size={24} className="group-hover:scale-110 transition-transform" />
                            <div>
                                <div className="font-bold text-sm">GROWTH</div>
                                <div className="text-xs opacity-70">Paid • Targeted</div>
                            </div>
                        </button>
                    </div>

                    {/* Campaign Configuration Panel */}
                    <div className="glass-panel p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-white/5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {campaignMode === 'retention' ? <Zap size={18} className="text-emerald-500 dark:text-emerald-400" /> : <Target size={18} className="text-indigo-500 dark:text-indigo-400" />}
                                {campaignMode === 'retention' ? 'Direct Blast' : 'Targeted Signal'}
                            </h3>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase">{campaignMode === 'retention' ? 'L1 Only' : 'L2/L3 Reach'}</span>
                        </div>

                        {campaignMode === 'retention' ? (
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg flex gap-3 items-start mb-4">
                                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-300 mb-0.5">Free for Business Nodes</h4>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-200/70">Send unlimited status updates to customers who have physically tethered.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase mb-2 block">Target Circles</label>
                                    <div className="grid gap-2 max-h-48 overflow-y-auto pr-2">
                                        {circles.map(c => {
                                            const isSelected = selectedMarketingCircles.includes(c.id);
                                            const colors = getCircleColors(c.color, isSelected);
                                            return (
                                                <div
                                                    key={c.id}
                                                    onClick={() => toggleMarketingCircle(c.id)}
                                                    className={`
														p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition-all
														${colors.bg} ${colors.border}
														${!isSelected && 'hover:bg-slate-50 dark:hover:bg-white/10'}
													`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${colors.icon}`}>
                                                            {c.type === 'system' ? <Layers size={16} /> : <Circle size={16} />}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900 dark:text-white">{c.name}</div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-500">{c.count.toLocaleString()} Nodes</div>
                                                        </div>
                                                    </div>
                                                    {isSelected && <CheckCircle2 size={18} className={colors.text} />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Message Payload */}
                        <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-white/5">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Message Payload</label>
                            <textarea
                                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none h-24"
                                placeholder={campaignMode === 'retention' ? "Write your update here..." : "Describe your offer..."}
                                value={messagePayload}
                                onChange={(e) => setMessagePayload(e.target.value)}
                            />
                        </div>

                        {/* Summary Section */}
                        <div className="mt-4 flex items-center justify-between bg-slate-50 dark:bg-black/40 rounded-lg p-3 border border-slate-200 dark:border-white/10">
                            <div>
                                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase">Est. Reach</div>
                                <div className="text-lg font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                    {getTotalReach()} <Users size={14} className="text-slate-500 dark:text-slate-600" />
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase">Total Cost</div>
                                <div className={`text-xl font-mono font-bold ${campaignMode === 'retention' ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                    {getTotalPrice()}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            className={`w-full h-12 mt-4 text-base font-bold shadow-xl ${campaignMode === 'retention' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'glass-button-primary'}`}
                        >
                            <Send className="mr-2" /> {campaignMode === 'retention' ? 'Post Update' : 'Broadcast Signal'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
