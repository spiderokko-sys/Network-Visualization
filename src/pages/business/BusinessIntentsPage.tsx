import { useState } from 'react';
import { Target, Activity, TrendingUp, Globe, DollarSign, Plus, ChevronLeft, ChevronRight, X, Calendar, User, MapPin, Briefcase } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

type IntentStatus = 'in_progress' | 'completed';
type FilterStatus = 'all' | IntentStatus;

interface Intent {
    id: string;
    title: string;
    description: string;
    status: IntentStatus;
    priority: 'low' | 'medium' | 'high';
    category: string;
    assignee: string;
    location: string;
    createdDate: string;
    completedDate?: string;
    progress: number;
}

// Sample data
const sampleIntents: Intent[] = [
    {
        id: '1',
        title: 'Expand Market Presence in APAC',
        description: 'Develop strategic partnerships and establish regional offices in key Asian markets including Singapore, Tokyo, and Hong Kong.',
        status: 'in_progress',
        priority: 'high',
        category: 'Business Development',
        assignee: 'Sarah Chen',
        location: 'Singapore',
        createdDate: '2024-11-15',
        progress: 65
    },
    {
        id: '2',
        title: 'Launch New Product Line',
        description: 'Complete development and market launch of the next-generation analytics platform with AI-powered insights.',
        status: 'in_progress',
        priority: 'high',
        category: 'Product',
        assignee: 'Michael Rodriguez',
        location: 'San Francisco',
        createdDate: '2024-10-20',
        progress: 82
    },
    {
        id: '3',
        title: 'Q4 Revenue Target Achievement',
        description: 'Successfully exceeded Q4 revenue targets by 23% through strategic sales initiatives and customer retention programs.',
        status: 'completed',
        priority: 'high',
        category: 'Sales',
        assignee: 'Jennifer Williams',
        location: 'New York',
        createdDate: '2024-10-01',
        completedDate: '2024-12-05',
        progress: 100
    },
    {
        id: '4',
        title: 'Customer Onboarding Optimization',
        description: 'Streamline the customer onboarding process to reduce time-to-value and improve satisfaction scores.',
        status: 'in_progress',
        priority: 'medium',
        category: 'Customer Success',
        assignee: 'David Kim',
        location: 'Austin',
        createdDate: '2024-11-28',
        progress: 45
    },
    {
        id: '5',
        title: 'Security Compliance Certification',
        description: 'Achieved SOC 2 Type II and ISO 27001 certifications for enterprise security standards.',
        status: 'completed',
        priority: 'high',
        category: 'Security',
        assignee: 'Amanda Foster',
        location: 'Boston',
        createdDate: '2024-08-10',
        completedDate: '2024-11-30',
        progress: 100
    },
    {
        id: '6',
        title: 'Mobile App Development',
        description: 'Build native mobile applications for iOS and Android platforms with offline-first capabilities.',
        status: 'in_progress',
        priority: 'medium',
        category: 'Engineering',
        assignee: 'Alex Thompson',
        location: 'Seattle',
        createdDate: '2024-11-01',
        progress: 58
    },
    {
        id: '7',
        title: 'Brand Refresh Campaign',
        description: 'Successfully launched comprehensive brand refresh including new logo, website, and marketing materials.',
        status: 'completed',
        priority: 'medium',
        category: 'Marketing',
        assignee: 'Emily Parker',
        location: 'Los Angeles',
        createdDate: '2024-09-15',
        completedDate: '2024-11-20',
        progress: 100
    },
    {
        id: '8',
        title: 'Data Center Migration',
        description: 'Migrate all infrastructure to cloud-native architecture with improved scalability and reliability.',
        status: 'in_progress',
        priority: 'high',
        category: 'Infrastructure',
        assignee: 'Robert Chen',
        location: 'Dublin',
        createdDate: '2024-10-05',
        progress: 73
    },
    {
        id: '9',
        title: 'Employee Training Program',
        description: 'Completed comprehensive training program for 500+ employees on new systems and processes.',
        status: 'completed',
        priority: 'low',
        category: 'HR',
        assignee: 'Lisa Anderson',
        location: 'Chicago',
        createdDate: '2024-09-01',
        completedDate: '2024-11-15',
        progress: 100
    },
    {
        id: '10',
        title: 'Strategic Partnership with TechCorp',
        description: 'Negotiate and finalize strategic partnership agreement with TechCorp for joint product development.',
        status: 'in_progress',
        priority: 'high',
        category: 'Partnerships',
        assignee: 'James Wilson',
        location: 'London',
        createdDate: '2024-11-10',
        progress: 40
    }
];

export const BusinessIntentsPage = () => {
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
    const itemsPerPage = 5;

    const handleCreateIntent = () => {
        // TODO: Implement create intent functionality
        console.log('Create Intent clicked');
    };

    // Filter intents based on status
    const filteredIntents = sampleIntents.filter(intent => {
        if (filterStatus === 'all') return true;
        return intent.status === filterStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredIntents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedIntents = filteredIntents.slice(startIndex, startIndex + itemsPerPage);

    // Reset to page 1 when filter changes
    const handleFilterChange = (status: FilterStatus) => {
        setFilterStatus(status);
        setCurrentPage(1);
    };

    const getStatusBadge = (status: IntentStatus) => {
        if (status === 'in_progress') {
            return (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                    In Progress
                </span>
            );
        }
        return (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                Completed
            </span>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const styles = {
            high: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30',
            medium: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
            low: 'bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-500/30'
        };
        return (
            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[priority as keyof typeof styles]}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
        );
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-4 md:px-6 pt-0 space-y-4 md:space-y-6 pb-28 max-w-7xl mx-auto">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-rose-100 dark:bg-rose-500/20 rounded-xl border border-rose-200 dark:border-rose-500/30 shadow-lg">
                                <Target className="text-rose-600 dark:text-rose-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Global Intents</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Network statistics and activity</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCreateIntent}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl"
                        >
                            <Plus size={20} />
                            <span>Create Intent</span>
                        </button>
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

                    {/* Intents List */}
                    <div className="glass-panel p-6 rounded-2xl">
                        {/* Filter Tabs */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleFilterChange('all')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${filterStatus === 'all'
                                            ? 'bg-rose-600 text-white shadow-lg'
                                            : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                                        }`}
                                >
                                    All ({sampleIntents.length})
                                </button>
                                <button
                                    onClick={() => handleFilterChange('in_progress')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${filterStatus === 'in_progress'
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                                        }`}
                                >
                                    In Progress ({sampleIntents.filter(i => i.status === 'in_progress').length})
                                </button>
                                <button
                                    onClick={() => handleFilterChange('completed')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${filterStatus === 'completed'
                                            ? 'bg-emerald-600 text-white shadow-lg'
                                            : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                                        }`}
                                >
                                    Completed ({sampleIntents.filter(i => i.status === 'completed').length})
                                </button>
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredIntents.length)} of {filteredIntents.length}
                            </div>
                        </div>

                        {/* Intent Cards */}
                        <div className="space-y-3">
                            {paginatedIntents.map((intent) => (
                                <div
                                    key={intent.id}
                                    onClick={() => setSelectedIntent(intent)}
                                    className="p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/30 hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                                    {intent.title}
                                                </h4>
                                                {getStatusBadge(intent.status)}
                                                {getPriorityBadge(intent.priority)}
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                                {intent.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <Briefcase size={14} />
                                                    <span>{intent.category}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User size={14} />
                                                    <span>{intent.assignee}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    <span>{intent.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>{new Date(intent.createdDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {intent.status === 'in_progress' && (
                                            <div className="flex flex-col items-end gap-1 min-w-[80px]">
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">{intent.progress}%</div>
                                                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                                                        style={{ width: `${intent.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${currentPage === page
                                                    ? 'bg-rose-600 text-white shadow-lg'
                                                    : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Intent Detail Modal */}
            {selectedIntent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedIntent(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 p-6 flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    {getStatusBadge(selectedIntent.status)}
                                    {getPriorityBadge(selectedIntent.priority)}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedIntent.title}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedIntent(null)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-slate-600 dark:text-slate-400" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Description</h3>
                                <p className="text-slate-600 dark:text-slate-400">{selectedIntent.description}</p>
                            </div>

                            {selectedIntent.status === 'in_progress' && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Progress</h3>
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">{selectedIntent.progress}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                                            style={{ width: `${selectedIntent.progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass-panel p-4 rounded-xl">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                                        <Briefcase size={16} />
                                        <span className="text-xs font-medium">Category</span>
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedIntent.category}</div>
                                </div>
                                <div className="glass-panel p-4 rounded-xl">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                                        <User size={16} />
                                        <span className="text-xs font-medium">Assignee</span>
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedIntent.assignee}</div>
                                </div>
                                <div className="glass-panel p-4 rounded-xl">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                                        <MapPin size={16} />
                                        <span className="text-xs font-medium">Location</span>
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedIntent.location}</div>
                                </div>
                                <div className="glass-panel p-4 rounded-xl">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                                        <Calendar size={16} />
                                        <span className="text-xs font-medium">Created</span>
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {new Date(selectedIntent.createdDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                                {selectedIntent.completedDate && (
                                    <div className="glass-panel p-4 rounded-xl col-span-2">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
                                            <Calendar size={16} />
                                            <span className="text-xs font-medium">Completed</span>
                                        </div>
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {new Date(selectedIntent.completedDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
