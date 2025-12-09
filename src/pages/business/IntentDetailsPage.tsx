import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Briefcase,
    User,
    CheckCircle2,
    XCircle,
    Edit3,
    Users,
    ClipboardList,
    UserPlus,
    DollarSign,
    Package,
    Clock
} from 'lucide-react';

type IntentStatus = 'in_progress' | 'completed' | 'cancelled';

type ContributionType = 'services' | 'monetary' | 'goods';

interface Party {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    contributionType?: ContributionType;
    contributionDescription?: string;
    wantsInReturn?: string;
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
            { id: 'p1', name: 'Dr. Smith', role: 'Dentist (Service Provider)', contributionType: 'services', contributionDescription: 'Professional dental treatment and expertise', wantsInReturn: 'Payment of $1,200' },
            { id: 'p2', name: 'John Doe', role: 'Patient (Service Recipient)', contributionType: 'monetary', contributionDescription: 'Payment for services', wantsInReturn: 'Healthy teeth and pain relief' }
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
    const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);

    // Add Participant Form State
    const [newParticipantName, setNewParticipantName] = useState('');
    const [newParticipantRole, setNewParticipantRole] = useState('');
    const [contributionType, setContributionType] = useState<ContributionType>('services');
    const [contributionDescription, setContributionDescription] = useState('');
    const [wantsInReturn, setWantsInReturn] = useState('');

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
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                    In Progress
                </span>
            );
        }
        if (status === 'cancelled') {
            return (
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30">
                    Cancelled
                </span>
            );
        }
        return (
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
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
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${styles[priority as keyof typeof styles]}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
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
        navigate(`/business/intents/${intentId}/edit`);
    };

    const handleAddParticipant = () => {
        // TODO: Implement add participant functionality
        console.log('Adding participant:', {
            name: newParticipantName,
            role: newParticipantRole,
            contributionType,
            contributionDescription,
            wantsInReturn
        });
        alert('Participant added successfully!');
        // Reset form
        setNewParticipantName('');
        setNewParticipantRole('');
        setContributionType('services');
        setContributionDescription('');
        setWantsInReturn('');
        setShowAddParticipantModal(false);
    };

    const getContributionIcon = (type?: ContributionType) => {
        switch (type) {
            case 'services':
                return <Clock size={16} className="text-blue-600 dark:text-blue-400" />;
            case 'monetary':
                return <DollarSign size={16} className="text-emerald-600 dark:text-emerald-400" />;
            case 'goods':
                return <Package size={16} className="text-purple-600 dark:text-purple-400" />;
            default:
                return null;
        }
    };

    const getContributionLabel = (type?: ContributionType) => {
        switch (type) {
            case 'services':
                return 'Services';
            case 'monetary':
                return 'Monetary';
            case 'goods':
                return 'Goods';
            default:
                return '';
        }
    };

    const getPartyName = (partyId: string) => {
        const party = intent.parties.find(p => p.id === partyId);
        return party?.name || 'Unknown';
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-2 md:px-6 pt-0 space-y-2 md:space-y-6 pb-28 max-w-7xl mx-auto">
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Compact Header */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <button
                                onClick={() => navigate('/business/intents')}
                                className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg border border-slate-200 dark:border-white/10 transition-colors flex-shrink-0"
                            >
                                <ArrowLeft className="text-slate-600 dark:text-slate-400" size={18} />
                            </button>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate">{intent.title}</h1>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {getStatusBadge(intent.status)}
                                {getPriorityBadge(intent.priority)}
                            </div>
                        </div>

                        {/* Action Buttons - Inline */}
                        {intent.status === 'in_progress' && (
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={handleComplete}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                                    title="Mark as Completed"
                                >
                                    <CheckCircle2 size={16} />
                                    <span className="hidden sm:inline">Complete</span>
                                </button>
                                <button
                                    onClick={handleModify}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                    title="Modify Intent"
                                >
                                    <Edit3 size={16} />
                                    <span className="hidden sm:inline">Modify</span>
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                                    title="Cancel Intent"
                                >
                                    <XCircle size={16} />
                                    <span className="hidden sm:inline">Cancel</span>
                                </button>
                            </div>
                        )}
                    </div>

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

                            {/* Parties Involved */}
                            <div className="glass-panel p-6 rounded-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Users size={20} className="text-rose-600 dark:text-rose-400" />
                                        Parties Involved
                                    </h2>
                                    <button
                                        onClick={() => setShowAddParticipantModal(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                        <UserPlus size={16} />
                                        <span>Add Participant</span>
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {intent.parties.map((party) => (
                                        <div
                                            key={party.id}
                                            className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                    {party.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-slate-900 dark:text-white">{party.name}</h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{party.role}</p>

                                                    {party.contributionType && (
                                                        <div className="space-y-2 mt-3">
                                                            <div className="flex items-start gap-2">
                                                                {getContributionIcon(party.contributionType)}
                                                                <div className="flex-1">
                                                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                                        {getContributionLabel(party.contributionType)} Contribution
                                                                    </p>
                                                                    {party.contributionDescription && (
                                                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                                                            {party.contributionDescription}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {party.wantsInReturn && (
                                                                <div className="flex items-start gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                                                                    <div className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400"></div>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                                            Wants in Return
                                                                        </p>
                                                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                                                            {party.wantsInReturn}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
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


            {/* Add Participant Modal */}
            {showAddParticipantModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddParticipantModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Add Participant</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                Add a new participant to this intent and define their contribution
                            </p>

                            <div className="space-y-5">
                                {/* Basic Info */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Participant Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newParticipantName}
                                        onChange={(e) => setNewParticipantName(e.target.value)}
                                        placeholder="Enter participant name"
                                        className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Role *
                                    </label>
                                    <input
                                        type="text"
                                        value={newParticipantRole}
                                        onChange={(e) => setNewParticipantRole(e.target.value)}
                                        placeholder="e.g., Service Provider, Client, Partner"
                                        className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>

                                {/* Contribution Type */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                                        Step 1: Define Contribution Type *
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <button
                                            onClick={() => setContributionType('services')}
                                            className={`p-4 rounded-xl border-2 transition-all ${contributionType === 'services'
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                                                : 'border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={`p-3 rounded-lg ${contributionType === 'services'
                                                    ? 'bg-blue-100 dark:bg-blue-500/20'
                                                    : 'bg-slate-100 dark:bg-white/5'
                                                    }`}>
                                                    <Clock size={24} className={
                                                        contributionType === 'services'
                                                            ? 'text-blue-600 dark:text-blue-400'
                                                            : 'text-slate-600 dark:text-slate-400'
                                                    } />
                                                </div>
                                                <div className="text-center">
                                                    <p className={`font-bold text-sm ${contributionType === 'services'
                                                        ? 'text-blue-900 dark:text-blue-300'
                                                        : 'text-slate-900 dark:text-white'
                                                        }`}>
                                                        Services
                                                    </p>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                        Time or effort pledged
                                                    </p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setContributionType('monetary')}
                                            className={`p-4 rounded-xl border-2 transition-all ${contributionType === 'monetary'
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                                                : 'border-slate-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-emerald-500/50'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={`p-3 rounded-lg ${contributionType === 'monetary'
                                                    ? 'bg-emerald-100 dark:bg-emerald-500/20'
                                                    : 'bg-slate-100 dark:bg-white/5'
                                                    }`}>
                                                    <DollarSign size={24} className={
                                                        contributionType === 'monetary'
                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                            : 'text-slate-600 dark:text-slate-400'
                                                    } />
                                                </div>
                                                <div className="text-center">
                                                    <p className={`font-bold text-sm ${contributionType === 'monetary'
                                                        ? 'text-emerald-900 dark:text-emerald-300'
                                                        : 'text-slate-900 dark:text-white'
                                                        }`}>
                                                        Monetary Instruments
                                                    </p>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                        Cash, gift cards, bill covering
                                                    </p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setContributionType('goods')}
                                            className={`p-4 rounded-xl border-2 transition-all ${contributionType === 'goods'
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10'
                                                : 'border-slate-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/50'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <div className={`p-3 rounded-lg ${contributionType === 'goods'
                                                    ? 'bg-purple-100 dark:bg-purple-500/20'
                                                    : 'bg-slate-100 dark:bg-white/5'
                                                    }`}>
                                                    <Package size={24} className={
                                                        contributionType === 'goods'
                                                            ? 'text-purple-600 dark:text-purple-400'
                                                            : 'text-slate-600 dark:text-slate-400'
                                                    } />
                                                </div>
                                                <div className="text-center">
                                                    <p className={`font-bold text-sm ${contributionType === 'goods'
                                                        ? 'text-purple-900 dark:text-purple-300'
                                                        : 'text-slate-900 dark:text-white'
                                                        }`}>
                                                        Goods
                                                    </p>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                        Specific physical item
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Contribution Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Contribution Description
                                    </label>
                                    <textarea
                                        value={contributionDescription}
                                        onChange={(e) => setContributionDescription(e.target.value)}
                                        placeholder="Describe what this participant is contributing..."
                                        rows={3}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                                    />
                                </div>

                                {/* Wants in Return */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        What They Want in Return
                                    </label>
                                    <textarea
                                        value={wantsInReturn}
                                        onChange={(e) => setWantsInReturn(e.target.value)}
                                        placeholder="What does this participant expect to receive in return?"
                                        rows={3}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                                <button
                                    onClick={() => {
                                        setShowAddParticipantModal(false);
                                        // Reset form
                                        setNewParticipantName('');
                                        setNewParticipantRole('');
                                        setContributionType('services');
                                        setContributionDescription('');
                                        setWantsInReturn('');
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddParticipant}
                                    disabled={!newParticipantName || !newParticipantRole}
                                    className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                                >
                                    Add Participant
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
