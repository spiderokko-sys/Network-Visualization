import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Target,
    Calendar,
    MapPin,
    Briefcase,
    User,
    CheckCircle2,
    XCircle,
    Edit3,
    Users,
    ClipboardList
} from 'lucide-react';

type IntentStatus = 'in_progress' | 'completed' | 'cancelled';

interface Party {
    id: string;
    name: string;
    role: string;
    avatar?: string;
}

interface Obligation {
    id: string;
    description: string;
    assignedTo: string; // Party ID
    status: 'pending' | 'in_progress' | 'completed';
    dueDate?: string;
}

interface Intent {
    id: string;
    title: string;
    description: string;
    status: IntentStatus;
    priority: 'low' | 'medium' | 'high';
    category: string;
    location: string;
    createdDate: string;
    completedDate?: string;
    progress: number;
    parties: Party[];
    obligations: Obligation[];
}

// Extended sample data with parties and obligations
const sampleIntents: Intent[] = [
    {
        id: '1',
        title: 'Root Canal Treatment for Patient',
        description: 'Perform comprehensive root canal treatment for patient with severe tooth infection. Includes cleaning, filling, and crown placement.',
        status: 'in_progress',
        priority: 'high',
        category: 'Dental Service',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-11-15',
        progress: 65,
        parties: [
            { id: 'p1', name: 'Dr. Smith', role: 'Dentist (Service Provider)' },
            { id: 'p2', name: 'John Doe', role: 'Patient (Service Recipient)' }
        ],
        obligations: [
            { id: 'o1', description: 'Complete initial examination and X-rays', assignedTo: 'p1', status: 'completed' },
            { id: 'o2', description: 'Perform root canal cleaning and disinfection', assignedTo: 'p1', status: 'in_progress', dueDate: '2024-12-15' },
            { id: 'o3', description: 'Install temporary filling', assignedTo: 'p1', status: 'pending', dueDate: '2024-12-20' },
            { id: 'o4', description: 'Attend follow-up appointment', assignedTo: 'p2', status: 'pending', dueDate: '2024-12-22' },
            { id: 'o5', description: 'Pay treatment fee', assignedTo: 'p2', status: 'pending', dueDate: '2024-12-30' }
        ]
    },
    {
        id: '2',
        title: 'Teeth Whitening Service',
        description: 'Professional teeth whitening treatment for patient preparing for wedding. Using advanced LED whitening technology.',
        status: 'in_progress',
        priority: 'medium',
        category: 'Dental Service',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-10-20',
        progress: 82,
        parties: [
            { id: 'p1', name: 'Dr. Smith', role: 'Dentist (Service Provider)' },
            { id: 'p2', name: 'Sarah Johnson', role: 'Patient (Service Recipient)' }
        ],
        obligations: [
            { id: 'o1', description: 'Conduct teeth assessment and sensitivity test', assignedTo: 'p1', status: 'completed' },
            { id: 'o2', description: 'Apply whitening gel and LED treatment (Session 1)', assignedTo: 'p1', status: 'completed' },
            { id: 'o3', description: 'Apply whitening gel and LED treatment (Session 2)', assignedTo: 'p1', status: 'in_progress', dueDate: '2024-12-12' },
            { id: 'o4', description: 'Provide aftercare instructions', assignedTo: 'p1', status: 'pending', dueDate: '2024-12-12' },
            { id: 'o5', description: 'Complete payment', assignedTo: 'p2', status: 'pending', dueDate: '2024-12-15' }
        ]
    },
    {
        id: '3',
        title: 'Dental Implant Procedure Completed',
        description: 'Successfully completed dental implant surgery for patient. Titanium post placed and healing cap installed. Patient recovering well.',
        status: 'completed',
        priority: 'high',
        category: 'Dental Service',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-10-01',
        completedDate: '2024-12-05',
        progress: 100,
        parties: [
            { id: 'p1', name: 'Dr. Smith', role: 'Dentist (Service Provider)' },
            { id: 'p2', name: 'Michael Brown', role: 'Patient (Service Recipient)' }
        ],
        obligations: [
            { id: 'o1', description: 'Complete pre-surgery consultation and CT scan', assignedTo: 'p1', status: 'completed' },
            { id: 'o2', description: 'Perform implant surgery', assignedTo: 'p1', status: 'completed' },
            { id: 'o3', description: 'Install healing cap', assignedTo: 'p1', status: 'completed' },
            { id: 'o4', description: 'Attend post-surgery follow-ups', assignedTo: 'p2', status: 'completed' },
            { id: 'o5', description: 'Complete payment', assignedTo: 'p2', status: 'completed' }
        ]
    },
    {
        id: '4',
        title: 'Roof Leak Repair at Clinic',
        description: 'Emergency roof repair needed at dental clinic. Water damage detected in waiting area. Roofer to inspect and fix damaged shingles.',
        status: 'in_progress',
        priority: 'high',
        category: 'Service Received',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-11-28',
        progress: 45,
        parties: [
            { id: 'p1', name: 'Dr. Smith', role: 'Client (Service Recipient)' },
            { id: 'p2', name: "Mike's Roofing Co.", role: 'Contractor (Service Provider)' }
        ],
        obligations: [
            { id: 'o1', description: 'Inspect roof and identify leak source', assignedTo: 'p2', status: 'completed' },
            { id: 'o2', description: 'Provide repair estimate', assignedTo: 'p2', status: 'completed' },
            { id: 'o3', description: 'Approve estimate and schedule work', assignedTo: 'p1', status: 'completed' },
            { id: 'o4', description: 'Replace damaged shingles', assignedTo: 'p2', status: 'in_progress', dueDate: '2024-12-10' },
            { id: 'o5', description: 'Test for leaks after repair', assignedTo: 'p2', status: 'pending', dueDate: '2024-12-11' },
            { id: 'o6', description: 'Pay for services', assignedTo: 'p1', status: 'pending', dueDate: '2024-12-15' }
        ]
    },
    {
        id: '5',
        title: 'Clinic Roof Replacement Completed',
        description: 'Full roof replacement completed on dental clinic building. New weatherproof shingles installed with 20-year warranty.',
        status: 'completed',
        priority: 'high',
        category: 'Service Received',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-08-10',
        completedDate: '2024-11-30',
        progress: 100,
        parties: [
            { id: 'p1', name: 'Dr. Smith', role: 'Client (Service Recipient)' },
            { id: 'p2', name: "Mike's Roofing Co.", role: 'Contractor (Service Provider)' }
        ],
        obligations: [
            { id: 'o1', description: 'Conduct full roof inspection', assignedTo: 'p2', status: 'completed' },
            { id: 'o2', description: 'Provide detailed quote', assignedTo: 'p2', status: 'completed' },
            { id: 'o3', description: 'Approve quote and sign contract', assignedTo: 'p1', status: 'completed' },
            { id: 'o4', description: 'Remove old roofing materials', assignedTo: 'p2', status: 'completed' },
            { id: 'o5', description: 'Install new weatherproof shingles', assignedTo: 'p2', status: 'completed' },
            { id: 'o6', description: 'Final inspection and cleanup', assignedTo: 'p2', status: 'completed' },
            { id: 'o7', description: 'Complete payment', assignedTo: 'p1', status: 'completed' }
        ]
    },
    {
        id: '6',
        title: 'Orthodontic Braces Installation',
        description: 'Install metal braces for teenage patient. Complete dental alignment treatment plan spanning 18 months.',
        status: 'in_progress',
        priority: 'medium',
        category: 'Dental Service',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-11-01',
        progress: 58,
        parties: [
            { id: 'p1', name: 'Dr. Smith', role: 'Dentist (Service Provider)' },
            { id: 'p2', name: 'Emily Davis', role: 'Patient (Service Recipient)' },
            { id: 'p3', name: 'Mrs. Davis', role: 'Parent/Guardian' }
        ],
        obligations: [
            { id: 'o1', description: 'Complete orthodontic assessment', assignedTo: 'p1', status: 'completed' },
            { id: 'o2', description: 'Install braces', assignedTo: 'p1', status: 'completed' },
            { id: 'o3', description: 'Monthly adjustment appointments', assignedTo: 'p1', status: 'in_progress', dueDate: '2025-06-01' },
            { id: 'o4', description: 'Attend all scheduled appointments', assignedTo: 'p2', status: 'in_progress', dueDate: '2025-06-01' },
            { id: 'o5', description: 'Follow oral hygiene instructions', assignedTo: 'p2', status: 'in_progress' },
            { id: 'o6', description: 'Make monthly payments', assignedTo: 'p3', status: 'in_progress', dueDate: '2025-06-01' }
        ]
    },
    {
        id: '7',
        title: 'Car Detailing Service Completed',
        description: "Professional car wash and detailing service for dentist's vehicle. Interior deep clean, exterior polish, and wax application completed.",
        status: 'completed',
        priority: 'low',
        category: 'Service Received',
        location: 'Main Street Car Wash',
        createdDate: '2024-09-15',
        completedDate: '2024-11-20',
        progress: 100,
        parties: [
            { id: 'p1', name: 'Dr. Smith', role: 'Customer (Service Recipient)' },
            { id: 'p2', name: 'Premium Auto Wash', role: 'Service Provider' }
        ],
        obligations: [
            { id: 'o1', description: 'Schedule detailing appointment', assignedTo: 'p1', status: 'completed' },
            { id: 'o2', description: 'Perform interior deep cleaning', assignedTo: 'p2', status: 'completed' },
            { id: 'o3', description: 'Perform exterior polish and wax', assignedTo: 'p2', status: 'completed' },
            { id: 'o4', description: 'Quality inspection', assignedTo: 'p2', status: 'completed' },
            { id: 'o5', description: 'Complete payment', assignedTo: 'p1', status: 'completed' }
        ]
    },
    {
        id: '8',
        title: 'Weekly Car Wash Service',
        description: "Regular weekly car wash service for dentist's vehicle. Exterior wash, tire shine, and interior vacuum.",
        status: 'in_progress',
        priority: 'low',
        category: 'Service Received',
        location: 'Main Street Car Wash',
        createdDate: '2024-10-05',
        progress: 73,
        parties: [
            { id: 'p1', name: 'Dr. Smith', role: 'Customer (Service Recipient)' },
            { id: 'p2', name: 'Premium Auto Wash', role: 'Service Provider' }
        ],
        obligations: [
            { id: 'o1', description: 'Set up weekly recurring service', assignedTo: 'p1', status: 'completed' },
            { id: 'o2', description: 'Perform weekly exterior wash', assignedTo: 'p2', status: 'in_progress' },
            { id: 'o3', description: 'Apply tire shine', assignedTo: 'p2', status: 'in_progress' },
            { id: 'o4', description: 'Interior vacuum service', assignedTo: 'p2', status: 'in_progress' },
            { id: 'o5', description: 'Maintain monthly subscription payment', assignedTo: 'p1', status: 'in_progress' }
        ]
    },
    {
        id: '9',
        title: 'Dental Cleaning for Family',
        description: 'Completed routine dental cleaning and checkup for entire family. All members received fluoride treatment and oral health assessment.',
        status: 'completed',
        priority: 'medium',
        category: 'Dental Service',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-09-01',
        completedDate: '2024-11-15',
        progress: 100,
        parties: [
            { id: 'p1', name: 'Dr. Smith', role: 'Dentist (Service Provider)' },
            { id: 'p2', name: 'Smith Family', role: 'Patients (Service Recipients)' }
        ],
        obligations: [
            { id: 'o1', description: 'Schedule family appointments', assignedTo: 'p2', status: 'completed' },
            { id: 'o2', description: 'Perform dental cleaning for all family members', assignedTo: 'p1', status: 'completed' },
            { id: 'o3', description: 'Conduct oral health assessments', assignedTo: 'p1', status: 'completed' },
            { id: 'o4', description: 'Apply fluoride treatments', assignedTo: 'p1', status: 'completed' },
            { id: 'o5', description: 'Complete payment', assignedTo: 'p2', status: 'completed' }
        ]
    },
    {
        id: '10',
        title: 'Roof Gutter Cleaning',
        description: 'Schedule and complete gutter cleaning service for dental clinic roof. Remove debris and ensure proper water drainage.',
        status: 'in_progress',
        priority: 'medium',
        category: 'Service Received',
        location: 'Downtown Dental Clinic',
        createdDate: '2024-11-10',
        progress: 40,
        parties: [
            { id: 'p1', name: 'Dr. Smith', role: 'Client (Service Recipient)' },
            { id: 'p2', name: "Mike's Roofing Co.", role: 'Contractor (Service Provider)' }
        ],
        obligations: [
            { id: 'o1', description: 'Schedule gutter cleaning service', assignedTo: 'p1', status: 'completed' },
            { id: 'o2', description: 'Inspect gutters and downspouts', assignedTo: 'p2', status: 'completed' },
            { id: 'o3', description: 'Remove debris from gutters', assignedTo: 'p2', status: 'in_progress', dueDate: '2024-12-14' },
            { id: 'o4', description: 'Test water drainage', assignedTo: 'p2', status: 'pending', dueDate: '2024-12-14' },
            { id: 'o5', description: 'Complete payment', assignedTo: 'p1', status: 'pending', dueDate: '2024-12-20' }
        ]
    }
];

export const IntentDetailsPage = () => {
    const { intentId } = useParams<{ intentId: string }>();
    const navigate = useNavigate();
    const [showModifyDialog, setShowModifyDialog] = useState(false);

    const intent = sampleIntents.find(i => i.id === intentId);

    if (!intent) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Intent Not Found</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">The intent you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/business/intents')}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl transition-colors"
                    >
                        Back to Intents
                    </button>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status: IntentStatus) => {
        if (status === 'in_progress') {
            return (
                <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                    In Progress
                </span>
            );
        }
        if (status === 'cancelled') {
            return (
                <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30">
                    Cancelled
                </span>
            );
        }
        return (
            <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
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
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${styles[priority as keyof typeof styles]}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
            </span>
        );
    };

    const getObligationStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-500/30',
            in_progress: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
            completed: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
        };
        const labels = {
            pending: 'Pending',
            in_progress: 'In Progress',
            completed: 'Completed'
        };
        return (
            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    const handleComplete = () => {
        // TODO: Implement complete functionality
        console.log('Mark as completed:', intentId);
        alert('Intent marked as completed!');
        navigate('/business/intents');
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel this intent? This action cannot be undone.')) {
            // TODO: Implement cancel functionality
            console.log('Cancel intent:', intentId);
            alert('Intent cancelled!');
            navigate('/business/intents');
        }
    };

    const handleModify = () => {
        setShowModifyDialog(true);
    };

    const getPartyName = (partyId: string) => {
        const party = intent.parties.find(p => p.id === partyId);
        return party?.name || 'Unknown';
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-4 md:px-6 pt-0 space-y-4 md:space-y-6 pb-28 max-w-7xl mx-auto">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            <button
                                onClick={() => navigate('/business/intents')}
                                className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 transition-colors"
                            >
                                <ArrowLeft className="text-slate-600 dark:text-slate-400" size={20} />
                            </button>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-3 bg-rose-100 dark:bg-rose-500/20 rounded-xl border border-rose-200 dark:border-rose-500/30 shadow-lg">
                                        <Target className="text-rose-600 dark:text-rose-400" size={24} />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{intent.title}</h1>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Intent Details</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {getStatusBadge(intent.status)}
                                    {getPriorityBadge(intent.priority)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {intent.status === 'in_progress' && (
                        <div className="flex gap-3 flex-wrap">
                            <button
                                onClick={handleComplete}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl"
                            >
                                <CheckCircle2 size={20} />
                                <span>Mark as Completed</span>
                            </button>
                            <button
                                onClick={handleModify}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl"
                            >
                                <Edit3 size={20} />
                                <span>Modify Intent</span>
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl"
                            >
                                <XCircle size={20} />
                                <span>Cancel Intent</span>
                            </button>
                        </div>
                    )}

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Description */}
                            <div className="glass-panel p-6 rounded-2xl">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Briefcase size={20} className="text-rose-600 dark:text-rose-400" />
                                    Description
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{intent.description}</p>
                            </div>

                            {/* Progress */}
                            {intent.status === 'in_progress' && (
                                <div className="glass-panel p-6 rounded-2xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Overall Progress</h2>
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{intent.progress}%</span>
                                    </div>
                                    <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                            style={{ width: `${intent.progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Parties Involved */}
                            <div className="glass-panel p-6 rounded-2xl">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Users size={20} className="text-rose-600 dark:text-rose-400" />
                                    Parties Involved
                                </h2>
                                <div className="space-y-3">
                                    {intent.parties.map((party) => (
                                        <div
                                            key={party.id}
                                            className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {party.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white">{party.name}</h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">{party.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Obligations */}
                            <div className="glass-panel p-6 rounded-2xl">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <ClipboardList size={20} className="text-rose-600 dark:text-rose-400" />
                                    Obligations & Responsibilities
                                </h2>
                                <div className="space-y-3">
                                    {intent.obligations.map((obligation) => (
                                        <div
                                            key={obligation.id}
                                            className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <p className="text-slate-900 dark:text-white font-medium flex-1">
                                                    {obligation.description}
                                                </p>
                                                {getObligationStatusBadge(obligation.status)}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <User size={14} />
                                                    <span>{getPartyName(obligation.assignedTo)}</span>
                                                </div>
                                                {obligation.dueDate && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        <span>Due: {new Date(obligation.dueDate).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Metadata */}
                        <div className="space-y-6">
                            {/* Key Information */}
                            <div className="glass-panel p-6 rounded-2xl space-y-4">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Key Information</h2>

                                <div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                                        <Briefcase size={16} />
                                        <span className="text-xs font-medium">Category</span>
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{intent.category}</div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                                        <MapPin size={16} />
                                        <span className="text-xs font-medium">Location</span>
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{intent.location}</div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                                        <Calendar size={16} />
                                        <span className="text-xs font-medium">Created</span>
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {new Date(intent.createdDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>

                                {intent.completedDate && (
                                    <div>
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                                            <Calendar size={16} />
                                            <span className="text-xs font-medium">Completed</span>
                                        </div>
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {new Date(intent.completedDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Statistics */}
                            <div className="glass-panel p-6 rounded-2xl">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Statistics</h2>
                                <div className="space-y-4">
                                    <div className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{intent.parties.length}</div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">Total Parties</div>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{intent.obligations.length}</div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">Total Obligations</div>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                            {intent.obligations.filter(o => o.status === 'completed').length}
                                        </div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">Completed</div>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {intent.obligations.filter(o => o.status === 'in_progress').length}
                                        </div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">In Progress</div>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                                        <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                                            {intent.obligations.filter(o => o.status === 'pending').length}
                                        </div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">Pending</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modify Dialog */}
            {showModifyDialog && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModifyDialog(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Modify Intent</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Intent modification functionality will be implemented here. This will allow you to update parties, obligations, and other details.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModifyDialog(false)}
                                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium rounded-xl transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    alert('Modify functionality coming soon!');
                                    setShowModifyDialog(false);
                                }}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
