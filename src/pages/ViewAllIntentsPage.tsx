import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Calendar, DollarSign, Filter, Search } from 'lucide-react';

interface CompletedIntent {
    id: string;
    title: string;
    status: string;
    date: string;
    value: string;
    category: string;
}

const MOCK_COMPLETED_INTENTS: CompletedIntent[] = [
    { id: '1', title: 'Acquire Tech Startup', status: 'Completed', date: 'Oct 12, 2023', value: '$2.5M', category: 'Acquisition' },
    { id: '2', title: 'Expand Market Reach', status: 'Completed', date: 'Sep 28, 2023', value: '$500K', category: 'Expansion' },
    { id: '3', title: 'Series B Funding', status: 'Completed', date: 'Aug 15, 2023', value: '$12M', category: 'Funding' },
    { id: '4', title: 'Strategic Partnership', status: 'Completed', date: 'Jul 03, 2023', value: 'N/A', category: 'Partnership' },
    { id: '5', title: 'Product Launch Campaign', status: 'Completed', date: 'Jun 20, 2023', value: '$750K', category: 'Marketing' },
    { id: '6', title: 'Office Lease Agreement', status: 'Completed', date: 'May 15, 2023', value: '$2.1M', category: 'Real Estate' },
    { id: '7', title: 'Hire Senior Developer', status: 'Completed', date: 'Apr 30, 2023', value: '$150K', category: 'Recruitment' },
    { id: '8', title: 'Cloud Infrastructure Setup', status: 'Completed', date: 'Apr 10, 2023', value: '$300K', category: 'Technology' },
    { id: '9', title: 'Legal Compliance Audit', status: 'Completed', date: 'Mar 25, 2023', value: '$50K', category: 'Legal' },
    { id: '10', title: 'Brand Redesign Project', status: 'Completed', date: 'Mar 05, 2023', value: '$200K', category: 'Branding' },
    { id: '11', title: 'Customer Retention Program', status: 'Completed', date: 'Feb 18, 2023', value: '$400K', category: 'Customer Success' },
    { id: '12', title: 'International Expansion', status: 'Completed', date: 'Jan 30, 2023', value: '$5M', category: 'Expansion' },
];

export const ViewAllIntentsPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'date' | 'value'>('date');

    // Get unique categories
    const categories = ['all', ...Array.from(new Set(MOCK_COMPLETED_INTENTS.map(i => i.category)))];

    // Filter and sort intents
    const filteredIntents = MOCK_COMPLETED_INTENTS
        .filter(intent => {
            const matchesSearch = intent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                intent.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || intent.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            } else {
                // Sort by value (handle N/A)
                const aVal = a.value === 'N/A' ? 0 : parseFloat(a.value.replace(/[$,MK]/g, '')) * (a.value.includes('M') ? 1000000 : a.value.includes('K') ? 1000 : 1);
                const bVal = b.value === 'N/A' ? 0 : parseFloat(b.value.replace(/[$,MK]/g, '')) * (b.value.includes('M') ? 1000000 : b.value.includes('K') ? 1000 : 1);
                return bVal - aVal;
            }
        });

    // Calculate statistics
    const totalValue = MOCK_COMPLETED_INTENTS.reduce((sum, intent) => {
        if (intent.value === 'N/A') return sum;
        const value = parseFloat(intent.value.replace(/[$,MK]/g, ''));
        const multiplier = intent.value.includes('M') ? 1000000 : intent.value.includes('K') ? 1000 : 1;
        return sum + (value * multiplier);
    }, 0);

    const formatValue = (val: number) => {
        if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
        return `$${val.toFixed(0)}`;
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-2 md:px-6 pt-0 space-y-2 md:space-y-6 pb-28 max-w-7xl mx-auto">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/profile')}
                            className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg border border-slate-200 dark:border-white/10 transition-colors"
                        >
                            <ArrowLeft className="text-slate-600 dark:text-slate-400" size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl border border-emerald-200 dark:border-emerald-500/30 shadow-lg">
                                <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Completed Intents</h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {MOCK_COMPLETED_INTENTS.length} total completed • {formatValue(totalValue)} total value
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-panel p-3 md:p-5 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Completed</span>
                                <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">{MOCK_COMPLETED_INTENTS.length}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">All time</div>
                        </div>
                        <div className="glass-panel p-5 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Value</span>
                                <DollarSign size={20} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">{formatValue(totalValue)}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">Cumulative</div>
                        </div>
                        <div className="glass-panel p-5 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">This Year</span>
                                <Calendar size={20} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">
                                {MOCK_COMPLETED_INTENTS.filter(i => i.date.includes('2023')).length}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">2023</div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="glass-panel p-3 md:p-4 rounded-xl">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search intents..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-slate-400" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat === 'all' ? 'All Categories' : cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSortBy('date')}
                                    className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${sortBy === 'date'
                                        ? 'bg-emerald-600 text-white shadow-lg'
                                        : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                                        }`}
                                >
                                    By Date
                                </button>
                                <button
                                    onClick={() => setSortBy('value')}
                                    className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${sortBy === 'value'
                                        ? 'bg-emerald-600 text-white shadow-lg'
                                        : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                                        }`}
                                >
                                    By Value
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        Showing {filteredIntents.length} of {MOCK_COMPLETED_INTENTS.length} intents
                    </div>

                    {/* Intents List */}
                    <div className="space-y-3">
                        {filteredIntents.length === 0 ? (
                            <div className="glass-panel p-12 rounded-xl text-center">
                                <p className="text-slate-500 dark:text-slate-400">No intents found matching your criteria</p>
                            </div>
                        ) : (
                            filteredIntents.map((intent) => (
                                <div
                                    key={intent.id}
                                    className="glass-panel p-3 md:p-5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-emerald-500/30"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                                    <CheckCircle2 size={18} />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                    {intent.title}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {intent.date}
                                                </span>
                                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded text-xs font-medium">
                                                    {intent.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                                {intent.value}
                                            </div>
                                            <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                                                {intent.status}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
