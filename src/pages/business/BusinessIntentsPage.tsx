import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Plus, ChevronLeft, ChevronRight, Calendar, User, MapPin, Briefcase } from 'lucide-react';

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

// Sample data - Dentist providing services and receiving services
const sampleIntents: Intent[] = [
    {
        id: '1',
        title: 'Root Canal Treatment for Patient',
        description: 'Perform comprehensive root canal treatment for patient with severe tooth infection. Includes cleaning, filling, and crown placement.',
        status: 'in_progress',
        priority: 'high',
        category: 'Dental Service',
        assignee: 'Dr. Smith (Dentist)',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-11-15',
        progress: 65
    },
    {
        id: '2',
        title: 'Teeth Whitening Service',
        description: 'Professional teeth whitening treatment for patient preparing for wedding. Using advanced LED whitening technology.',
        status: 'in_progress',
        priority: 'medium',
        category: 'Dental Service',
        assignee: 'Dr. Smith (Dentist)',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-10-20',
        progress: 82
    },
    {
        id: '3',
        title: 'Dental Implant Procedure Completed',
        description: 'Successfully completed dental implant surgery for patient. Titanium post placed and healing cap installed. Patient recovering well.',
        status: 'completed',
        priority: 'high',
        category: 'Dental Service',
        assignee: 'Dr. Smith (Dentist)',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-10-01',
        completedDate: '2024-12-05',
        progress: 100
    },
    {
        id: '4',
        title: 'Roof Leak Repair at Clinic',
        description: 'Emergency roof repair needed at dental clinic. Water damage detected in waiting area. Roofer to inspect and fix damaged shingles.',
        status: 'in_progress',
        priority: 'high',
        category: 'Service Received',
        assignee: 'Mike\'s Roofing Co.',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-11-28',
        progress: 45
    },
    {
        id: '5',
        title: 'Clinic Roof Replacement Completed',
        description: 'Full roof replacement completed on dental clinic building. New weatherproof shingles installed with 20-year warranty.',
        status: 'completed',
        priority: 'high',
        category: 'Service Received',
        assignee: 'Mike\'s Roofing Co.',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-08-10',
        completedDate: '2024-11-30',
        progress: 100
    },
    {
        id: '6',
        title: 'Orthodontic Braces Installation',
        description: 'Install metal braces for teenage patient. Complete dental alignment treatment plan spanning 18 months.',
        status: 'in_progress',
        priority: 'medium',
        category: 'Dental Service',
        assignee: 'Dr. Smith (Dentist)',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-11-01',
        progress: 58
    },
    {
        id: '7',
        title: 'Car Detailing Service Completed',
        description: 'Professional car wash and detailing service for dentist\'s vehicle. Interior deep clean, exterior polish, and wax application completed.',
        status: 'completed',
        priority: 'low',
        category: 'Service Received',
        assignee: 'Premium Auto Wash',
        location: 'Main Street Car Wash',
        createdDate: '2024-09-15',
        completedDate: '2024-11-20',
        progress: 100
    },
    {
        id: '8',
        title: 'Weekly Car Wash Service',
        description: 'Regular weekly car wash service for dentist\'s vehicle. Exterior wash, tire shine, and interior vacuum.',
        status: 'in_progress',
        priority: 'low',
        category: 'Service Received',
        assignee: 'Premium Auto Wash',
        location: 'Main Street Car Wash',
        createdDate: '2024-10-05',
        progress: 73
    },
    {
        id: '9',
        title: 'Dental Cleaning for Family',
        description: 'Completed routine dental cleaning and checkup for entire family. All members received fluoride treatment and oral health assessment.',
        status: 'completed',
        priority: 'medium',
        category: 'Dental Service',
        assignee: 'Dr. Smith (Dentist)',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-09-01',
        completedDate: '2024-11-15',
        progress: 100
    },
    {
        id: '10',
        title: 'Roof Gutter Cleaning',
        description: 'Schedule and complete gutter cleaning service for dental clinic roof. Remove debris and ensure proper water drainage.',
        status: 'in_progress',
        priority: 'medium',
        category: 'Service Received',
        assignee: 'Mike\'s Roofing Co.',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-11-10',
        progress: 40
    }
];

export const BusinessIntentsPage = () => {
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleCreateIntent = () => {
        navigate('/business/intents/new');
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
            <div className="px-2 md:px-6 pt-0 space-y-2 md:space-y-6 pb-28 max-w-7xl mx-auto">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-rose-100 dark:bg-rose-500/20 rounded-xl border border-rose-200 dark:border-rose-500/30 shadow-lg">
                                <Target className="text-rose-600 dark:text-rose-400" size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Intents</h3>
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



                    {/* Intents List */}
                    <div className="glass-panel p-3 md:p-6 rounded-2xl">
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
                                    onClick={() => navigate(`/business/intents/${intent.id}`)}
                                    className="p-3 md:p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/30 hover:shadow-md transition-all cursor-pointer group"
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
        </div>
    );
};
