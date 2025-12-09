import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Briefcase, AlertCircle, UserPlus, Plus, X, Edit3 } from 'lucide-react';

type IntentPriority = 'low' | 'medium' | 'high';
type IntentStatus = 'in_progress' | 'completed' | 'cancelled';

interface PartyInput {
    id: string;
    name: string;
    role: string;
}

interface ObligationInput {
    id: string;
    description: string;
    assignedTo: string;
    dueDate: string;
    status: 'pending' | 'in_progress' | 'completed';
}

// This would normally come from your data store
const mockIntentData = {
    '1': {
        title: 'Root Canal Treatment for Patient',
        description: 'Perform comprehensive root canal treatment for patient with severe tooth infection. Includes cleaning, filling, and crown placement.',
        category: 'Dental Service',
        location: 'Downtown Dental Clinic',
        priority: 'high' as IntentPriority,
        status: 'in_progress' as IntentStatus,
        parties: [
            { id: 'p1', name: 'Dr. Smith', role: 'Dentist (Service Provider)' },
            { id: 'p2', name: 'John Doe', role: 'Patient (Service Recipient)' }
        ],
        obligations: [
            { id: 'o1', description: 'Complete initial examination and X-rays', assignedTo: 'p1', status: 'completed' as const, dueDate: '' },
            { id: 'o2', description: 'Perform root canal cleaning and disinfection', assignedTo: 'p1', status: 'in_progress' as const, dueDate: '2024-12-15' },
        ]
    }
};

export const ModifyIntentPage = () => {
    const { intentId } = useParams<{ intentId: string }>();
    const navigate = useNavigate();

    // Load existing intent data
    const existingIntent = intentId ? mockIntentData[intentId as keyof typeof mockIntentData] : null;

    // Form state
    const [title, setTitle] = useState(existingIntent?.title || '');
    const [description, setDescription] = useState(existingIntent?.description || '');
    const [category, setCategory] = useState(existingIntent?.category || '');
    const [location, setLocation] = useState(existingIntent?.location || '');
    const [priority, setPriority] = useState<IntentPriority>(existingIntent?.priority || 'medium');
    const [status, setStatus] = useState<IntentStatus>(existingIntent?.status || 'in_progress');
    const [parties, setParties] = useState<PartyInput[]>(existingIntent?.parties || []);
    const [obligations, setObligations] = useState<ObligationInput[]>(existingIntent?.obligations || []);

    // Modal states
    const [showAddPartyModal, setShowAddPartyModal] = useState(false);
    const [showAddObligationModal, setShowAddObligationModal] = useState(false);
    const [showEditObligationModal, setShowEditObligationModal] = useState(false);
    const [editingObligation, setEditingObligation] = useState<ObligationInput | null>(null);

    // New party form
    const [newPartyName, setNewPartyName] = useState('');
    const [newPartyRole, setNewPartyRole] = useState('');

    // New/Edit obligation form
    const [obligationDesc, setObligationDesc] = useState('');
    const [obligationAssignee, setObligationAssignee] = useState('');
    const [obligationDueDate, setObligationDueDate] = useState('');
    const [obligationStatus, setObligationStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');

    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!existingIntent) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Intent Not Found</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">The intent you're trying to modify doesn't exist.</p>
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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) newErrors.title = 'Title is required';
        if (!description.trim()) newErrors.description = 'Description is required';
        if (!category.trim()) newErrors.category = 'Category is required';
        if (!location.trim()) newErrors.location = 'Location is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddParty = () => {
        if (!newPartyName.trim() || !newPartyRole.trim()) {
            alert('Please fill in all party fields');
            return;
        }

        const newParty: PartyInput = {
            id: `party-${Date.now()}`,
            name: newPartyName,
            role: newPartyRole
        };

        setParties([...parties, newParty]);
        setNewPartyName('');
        setNewPartyRole('');
        setShowAddPartyModal(false);
    };

    const handleRemoveParty = (id: string) => {
        if (window.confirm('Are you sure? This will also remove all obligations assigned to this party.')) {
            setParties(parties.filter(p => p.id !== id));
            setObligations(obligations.filter(o => o.assignedTo !== id));
        }
    };

    const handleAddObligation = () => {
        if (!obligationDesc.trim() || !obligationAssignee) {
            alert('Please fill in all required obligation fields');
            return;
        }

        const newObligation: ObligationInput = {
            id: `obligation-${Date.now()}`,
            description: obligationDesc,
            assignedTo: obligationAssignee,
            dueDate: obligationDueDate,
            status: obligationStatus
        };

        setObligations([...obligations, newObligation]);
        resetObligationForm();
        setShowAddObligationModal(false);
    };

    const handleEditObligation = (obligation: ObligationInput) => {
        setEditingObligation(obligation);
        setObligationDesc(obligation.description);
        setObligationAssignee(obligation.assignedTo);
        setObligationDueDate(obligation.dueDate);
        setObligationStatus(obligation.status);
        setShowEditObligationModal(true);
    };

    const handleUpdateObligation = () => {
        if (!editingObligation) return;

        setObligations(obligations.map(o =>
            o.id === editingObligation.id
                ? { ...o, description: obligationDesc, assignedTo: obligationAssignee, dueDate: obligationDueDate, status: obligationStatus }
                : o
        ));

        resetObligationForm();
        setEditingObligation(null);
        setShowEditObligationModal(false);
    };

    const resetObligationForm = () => {
        setObligationDesc('');
        setObligationAssignee('');
        setObligationDueDate('');
        setObligationStatus('pending');
    };

    const handleRemoveObligation = (id: string) => {
        if (window.confirm('Are you sure you want to remove this obligation?')) {
            setObligations(obligations.filter(o => o.id !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const updatedIntent = {
            title,
            description,
            category,
            location,
            priority,
            status,
            parties,
            obligations
        };

        console.log('Updating intent:', updatedIntent);
        alert('Intent updated successfully!');
        navigate(`/business/intents/${intentId}`);
    };

    const getPriorityColor = (p: IntentPriority) => {
        switch (p) {
            case 'high': return 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300';
            case 'medium': return 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300';
            case 'low': return 'border-slate-500 bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-300';
        }
    };

    const getStatusColor = (s: IntentStatus) => {
        switch (s) {
            case 'in_progress': return 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300';
            case 'completed': return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
            case 'cancelled': return 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300';
        }
    };

    const getObligationStatusColor = (s: 'pending' | 'in_progress' | 'completed') => {
        switch (s) {
            case 'pending': return 'border-slate-500 bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-300';
            case 'in_progress': return 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300';
            case 'completed': return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
        }
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-2 md:px-6 pt-0 space-y-2 md:space-y-6 pb-28 max-w-5xl mx-auto">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(`/business/intents/${intentId}`)}
                            className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg border border-slate-200 dark:border-white/10 transition-colors"
                        >
                            <ArrowLeft className="text-slate-600 dark:text-slate-400" size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl border border-blue-200 dark:border-blue-500/30 shadow-lg">
                                <Edit3 className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Modify Intent</h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Update intent details, parties, and obligations</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="glass-panel p-6 rounded-2xl space-y-5">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Briefcase size={20} className="text-blue-600 dark:text-blue-400" />
                                Basic Information
                            </h2>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Intent Title *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={`w-full px-4 py-3 bg-white dark:bg-white/5 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-slate-300 dark:border-white/10'
                                        }`}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                        <AlertCircle size={14} /> {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className={`w-full px-4 py-3 bg-white dark:bg-white/5 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? 'border-red-500' : 'border-slate-300 dark:border-white/10'
                                        }`}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Category *
                                    </label>
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className={`w-full px-4 py-3 bg-white dark:bg-white/5 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-slate-300 dark:border-white/10'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        <MapPin size={14} className="inline mr-1" />
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className={`w-full px-4 py-3 bg-white dark:bg-white/5 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500' : 'border-slate-300 dark:border-white/10'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                                        Priority *
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['low', 'medium', 'high'] as IntentPriority[]).map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setPriority(p)}
                                                className={`p-2 rounded-lg border-2 font-semibold text-xs transition-all ${priority === p
                                                    ? getPriorityColor(p)
                                                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400'
                                                    }`}
                                            >
                                                {p.charAt(0).toUpperCase() + p.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                                        Status *
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['in_progress', 'completed', 'cancelled'] as IntentStatus[]).map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setStatus(s)}
                                                className={`p-2 rounded-lg border-2 font-semibold text-xs transition-all ${status === s
                                                    ? getStatusColor(s)
                                                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400'
                                                    }`}
                                            >
                                                {s.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Parties */}
                        <div className="glass-panel p-6 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <UserPlus size={20} className="text-blue-600 dark:text-blue-400" />
                                    Parties Involved
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setShowAddPartyModal(true)}
                                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    <Plus size={16} />
                                    Add Party
                                </button>
                            </div>

                            <div className="space-y-3">
                                {parties.map((party) => (
                                    <div
                                        key={party.id}
                                        className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {party.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white">{party.name}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{party.role}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveParty(party.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Obligations */}
                        <div className="glass-panel p-6 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
                                    Obligations & Responsibilities
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setShowAddObligationModal(true)}
                                    disabled={parties.length === 0}
                                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus size={16} />
                                    Add Obligation
                                </button>
                            </div>

                            {obligations.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                    No obligations added yet.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {obligations.map((obligation) => {
                                        const assignedParty = parties.find(p => p.id === obligation.assignedTo);
                                        return (
                                            <div
                                                key={obligation.id}
                                                className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"
                                            >
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <p className="font-medium text-slate-900 dark:text-white flex-1">
                                                        {obligation.description}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getObligationStatusColor(obligation.status)}`}>
                                                            {obligation.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditObligation(obligation)}
                                                            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors"
                                                        >
                                                            <Edit3 size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveObligation(obligation.id)}
                                                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                                    <span>Assigned to: {assignedParty?.name || 'Unknown'}</span>
                                                    {obligation.dueDate && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={14} />
                                                            Due: {new Date(obligation.dueDate).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/business/intents/${intentId}`)}
                                className="flex-1 px-6 py-3 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-semibold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Add Party Modal */}
            {showAddPartyModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddPartyModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add Party</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={newPartyName}
                                    onChange={(e) => setNewPartyName(e.target.value)}
                                    placeholder="Enter party name"
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Role *</label>
                                <input
                                    type="text"
                                    value={newPartyRole}
                                    onChange={(e) => setNewPartyRole(e.target.value)}
                                    placeholder="e.g., Service Provider, Client"
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowAddPartyModal(false)}
                                    className="flex-1 px-4 py-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddParty}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                                >
                                    Add Party
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Obligation Modal */}
            {(showAddObligationModal || showEditObligationModal) && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => {
                    setShowAddObligationModal(false);
                    setShowEditObligationModal(false);
                    resetObligationForm();
                }}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            {showEditObligationModal ? 'Edit Obligation' : 'Add Obligation'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Description *</label>
                                <textarea
                                    value={obligationDesc}
                                    onChange={(e) => setObligationDesc(e.target.value)}
                                    placeholder="Describe the obligation..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Assign To *</label>
                                <select
                                    value={obligationAssignee}
                                    onChange={(e) => setObligationAssignee(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a party...</option>
                                    {parties.map((party) => (
                                        <option key={party.id} value={party.id}>
                                            {party.name} ({party.role})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Status *</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['pending', 'in_progress', 'completed'] as const).map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setObligationStatus(s)}
                                            className={`p-2 rounded-lg border-2 font-semibold text-xs transition-all ${obligationStatus === s
                                                ? getObligationStatusColor(s)
                                                : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400'
                                                }`}
                                        >
                                            {s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Due Date (Optional)</label>
                                <input
                                    type="date"
                                    value={obligationDueDate}
                                    onChange={(e) => setObligationDueDate(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setShowAddObligationModal(false);
                                        setShowEditObligationModal(false);
                                        resetObligationForm();
                                    }}
                                    className="flex-1 px-4 py-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={showEditObligationModal ? handleUpdateObligation : handleAddObligation}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                                >
                                    {showEditObligationModal ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
