import { Target, Activity, TrendingUp, Globe, DollarSign } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export const BusinessIntentsPage = () => {
    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-4 md:px-6 pt-0 space-y-4 md:space-y-6 pb-28 max-w-7xl mx-auto">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-rose-100 dark:bg-rose-500/20 rounded-xl border border-rose-200 dark:border-rose-500/30 shadow-lg">
                            <Target className="text-rose-600 dark:text-rose-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Global Intents</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Network statistics and activity</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/5 border-emerald-200 dark:border-emerald-500/20">
                            <CardContent className="p-5">
                                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">12.5k</div>
                                <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1.5 mb-2"><Activity size={16} /> Active Nodes</div>
                                <div className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-200 dark:bg-emerald-900/40 px-2 py-1 rounded w-fit"><TrendingUp size={12} /><span>+12% growth</span></div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-900/5 border-indigo-200 dark:border-indigo-500/20">
                            <CardContent className="p-5">
                                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">148</div>
                                <div className="text-sm text-indigo-700 dark:text-indigo-300 font-medium flex items-center gap-1.5 mb-2"><Globe size={16} /> Countries</div>
                                <div className="text-xs text-indigo-700 dark:text-indigo-400 bg-indigo-200 dark:bg-indigo-900/40 px-2 py-1 rounded w-fit">8 major cities</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/5 border-amber-200 dark:border-amber-500/20">
                            <CardContent className="p-5">
                                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">$2.4M</div>
                                <div className="text-sm text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1.5 mb-2"><DollarSign size={16} /> Value Flow</div>
                                <div className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 bg-amber-200 dark:bg-amber-900/40 px-2 py-1 rounded w-fit"><TrendingUp size={12} /><span>+8% volume</span></div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* List */}
                    <div className="glass-panel p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-slate-900 dark:text-white font-bold text-lg">Top Active Cities</h4>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-500 bg-slate-200 dark:bg-slate-800/50 px-2 py-1 rounded">24h</span>
                        </div>
                        <div className="space-y-3">
                            {[
                                { city: 'New York', country: 'USA', users: 3850, activity: 'Very High' },
                                { city: 'Tokyo', country: 'Japan', users: 2890, activity: 'High' },
                                { city: 'London', country: 'UK', users: 2120, activity: 'High' },
                                { city: 'Mumbai', country: 'India', users: 1980, activity: 'High' },
                                { city: 'Toronto', country: 'Canada', users: 1240, activity: 'Medium' }
                            ].map((city, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-white/5 transition-colors border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-all">{idx + 1}</div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">{city.city}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-500">{city.country}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-slate-900 dark:text-slate-200">{city.users.toLocaleString()}</div>
                                            <div className="text-[10px] text-slate-500 dark:text-slate-500 uppercase">Users</div>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold ${city.activity.includes('High') ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'}`}>
                                            {city.activity}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
