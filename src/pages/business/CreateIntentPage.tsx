import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Calendar, MapPin, Briefcase, AlertCircle, UserPlus, Plus, X } from 'lucide-react';

type IntentPriority = 'low' | 'medium' | 'high';

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
}

export const CreateIntentPage = () => {
    const navigate = useNavigate();

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [priority, setPriority] = useState<IntentPriority>('medium');
    const [parties, setParties] = useState<PartyInput[]>([]);
    const [obligations, setObligations] = useState<ObligationInput[]>([]);

    // Modal states
    const [showAddPartyModal, setShowAddPartyModal] = useState(false);
    const [showAddObligationModal, setShowAddObligationModal] = useState(false);

    // New party form
    const [newPartyName, setNewPartyName] = useState('');
    const [newPartyRole, setNewPartyRole] = useState('');

    // New obligation form
    const [newObligationDesc, setNewObligationDesc] = useState('');
    const [newObligationAssignee, setNewObligationAssignee] = useState('');
    const [newObligationDueDate, setNewObligationDueDate] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!title.trim()) newErrors.title = 'Title is required';
        if (!description.trim()) newErrors.description = 'Description is required';
        if (!category.trim()) newErrors.category = 'Category is required';
        if (!location.trim()) newErrors.location = 'Location is required';
        if (parties.length === 0) newErrors.parties = 'At least one party is required';

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
        setParties(parties.filter(p => p.id !== id));
        // Also remove obligations assigned to this party
        setObligations(obligations.filter(o => o.assignedTo !== id));
    };

    const handleAddObligation = () => {
        if (!newObligationDesc.trim() || !newObligationAssignee) {
            alert('Please fill in all obligation fields');
            return;
        }

        const newObligation: ObligationInput = {
            id: `obligation-${Date.now()}`,
            description: newObligationDesc,
            assignedTo: newObligationAssignee,
            dueDate: newObligationDueDate
        };

        setObligations([...obligations, newObligation]);
        setNewObligationDesc('');
        setNewObligationAssignee('');
        setNewObligationDueDate('');
        setShowAddObligationModal(false);
    };

    const handleRemoveObligation = (id: string) => {
        setObligations(obligations.filter(o => o.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const newIntent = {
            title,
            description,
            category,
            location,
            priority,
            parties,
            obligations,
            createdDate: new Date().toISOString(),
            status: 'in_progress'
        };

        console.log('Creating intent:', newIntent);
        alert('Intent created successfully!');
        navigate('/business/intents');
    };

    const getPriorityColor = (p: IntentPriority) => {
        switch (p) {
            case 'high': return 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300';
            case 'medium': return 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300';
            case 'low': return 'border-slate-500 bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-300';
        }
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-2 md:px-6 pt-0 space-y-2 md:space-y-6 pb-28 max-w-5xl mx-auto">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/business/intents')}
                            className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg border border-slate-200 dark:border-white/10 transition-colors"
                        >
                            <ArrowLeft className="text-slate-600 dark:text-slate-400" size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-rose-100 dark:bg-rose-500/20 rounded-xl border border-rose-200 dark:border-rose-500/30 shadow-lg">
                                <Target className="text-rose-600 dark:text-rose-400" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Intent</h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Define a new business intent with parties and obligations</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="glass-panel p-6 rounded-2xl space-y-5">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Briefcase size={20} className="text-rose-600 dark:text-rose-400" />
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
                                    placeholder="e.g., Root Canal Treatment for Patient"
                                    className={`w-full px-4 py-3 bg-white dark:bg-white/5 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.title ? 'border-red-500' : 'border-slate-300 dark:border-white/10'
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
                                    placeholder="Provide a detailed description of the intent..."
                                    rows={4}
                                    className={`w-full px-4 py-3 bg-white dark:bg-white/5 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none ${errors.description ? 'border-red-500' : 'border-slate-300 dark:border-white/10'
                                        }`}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                        <AlertCircle size={14} /> {errors.description}
                                    </p>
                                )}
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
                                        placeholder="e.g., Dental Service, Service Received"
                                        className={`w-full px-4 py-3 bg-white dark:bg-white/5 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.category ? 'border-red-500' : 'border-slate-300 dark:border-white/10'
                                            }`}
                                    />
                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                            <AlertCircle size={14} /> {errors.category}
                                        </p>
                                    )}
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
                                        placeholder="e.g., Downtown Dental Clinic"
                                        className={`w-full px-4 py-3 bg-white dark:bg-white/5 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.location ? 'border-red-500' : 'border-slate-300 dark:border-white/10'
                                            }`}
                                    />
                                    {errors.location && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                            <AlertCircle size={14} /> {errors.location}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                                    Priority *
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['low', 'medium', 'high'] as IntentPriority[]).map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPriority(p)}
                                            className={`p-3 rounded-xl border-2 font-semibold text-sm transition-all ${priority === p
                                                ? getPriorityColor(p)
                                                : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                                                }`}
                                        >
                                            {p.charAt(0).toUpperCase() + p.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Parties */}
                        <div className="glass-panel p-6 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <UserPlus size={20} className="text-rose-600 dark:text-rose-400" />
                                    Parties Involved
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setShowAddPartyModal(true)}
                                    className="flex items-center gap-2 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    <Plus size={16} />
                                    Add Party
                                </button>
                            </div>

                            {errors.parties && (
                                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle size={14} /> {errors.parties}
                                </p>
                            )}

                            {parties.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                    No parties added yet. Click "Add Party" to get started.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {parties.map((party) => (
                                        <div
                                            key={party.id}
                                            className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
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
                            )}
                        </div>

                        {/* Obligations */}
                        <div className="glass-panel p-6 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Calendar size={20} className="text-rose-600 dark:text-rose-400" />
                                    Obligations & Responsibilities
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setShowAddObligationModal(true)}
                                    disabled={parties.length === 0}
                                    className="flex items-center gap-2 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus size={16} />
                                    Add Obligation
                                </button>
                            </div>

                            {obligations.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                    {parties.length === 0
                                        ? 'Add parties first before adding obligations.'
                                        : 'No obligations added yet. Click "Add Obligation" to get started.'}
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
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveObligation(obligation.id)}
                                                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                                    <span>Assigned to: {assignedParty?.name}</span>
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
                                onClick={() => navigate('/business/intents')}
                                className="flex-1 px-6 py-3 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-semibold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                            >
                                Create Intent
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
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={newPartyName}
                                    onChange={(e) => setNewPartyName(e.target.value)}
                                    placeholder="Enter party name"
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Role *
                                </label>
                                <input
                                    type="text"
                                    value={newPartyRole}
                                    onChange={(e) => setNewPartyRole(e.target.value)}
                                    placeholder="e.g., Service Provider, Client"
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                                    className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl transition-colors"
                                >
                                    Add Party
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Obligation Modal */}
            {showAddObligationModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddObligationModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add Obligation</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={newObligationDesc}
                                    onChange={(e) => setNewObligationDesc(e.target.value)}
                                    placeholder="Describe the obligation..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Assign To *
                                </label>
                                <select
                                    value={newObligationAssignee}
                                    onChange={(e) => setNewObligationAssignee(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    Due Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={newObligationDueDate}
                                    onChange={(e) => setNewObligationDueDate(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowAddObligationModal(false)}
                                    className="flex-1 px-4 py-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddObligation}
                                    className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl transition-colors"
                                >
                                    Add Obligation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
