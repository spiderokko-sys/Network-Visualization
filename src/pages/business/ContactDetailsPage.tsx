import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Heart,
    Edit2,
    FileText,
    Clock,
    DollarSign,
    StickyNote,
    Bell,
    Tag,
    User,
    CheckCircle2,
    Circle,
    Plus,
    Upload,
    X,
    Target
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { MOCK_CUSTOMERS } from '../../data/mockData';

export const ContactDetailsPage = () => {
    const { contactId } = useParams<{ contactId: string }>();
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);

    // Modal states
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);
    const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
    const [showCreateIntentModal, setShowCreateIntentModal] = useState(false);
    const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
    const [showAddReminderModal, setShowAddReminderModal] = useState(false);

    // Note form state
    const [noteText, setNoteText] = useState('');

    // Document form state
    const [documentName, setDocumentName] = useState('');
    const [documentFile, setDocumentFile] = useState<File | null>(null);

    // Intent form state
    const [intentTitle, setIntentTitle] = useState('');
    const [intentDescription, setIntentDescription] = useState('');
    const [intentCategory, setIntentCategory] = useState('');
    const [intentPriority, setIntentPriority] = useState<'low' | 'medium' | 'high'>('medium');

    // Appointment form state
    const [appointmentService, setAppointmentService] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');

    // Reminder form state
    const [reminderText, setReminderText] = useState('');
    const [reminderDate, setReminderDate] = useState('');

    const contact = MOCK_CUSTOMERS.find(c => c.id === Number(contactId));

    if (!contact) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Contact Not Found</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">The contact you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/business/contacts')}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl transition-colors"
                    >
                        Back to Contacts
                    </button>
                </div>
            </div>
        );
    }

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    const handleAddNote = () => {
        if (!noteText.trim()) return;
        console.log('Adding note:', noteText);
        alert(`Note added: ${noteText}`);
        setNoteText('');
        setShowAddNoteModal(false);
    };

    const handleAddDocument = () => {
        if (!documentName.trim() && !documentFile) return;
        console.log('Adding document:', { name: documentName, file: documentFile });
        alert(`Document added: ${documentName || documentFile?.name}`);
        setDocumentName('');
        setDocumentFile(null);
        setShowAddDocumentModal(false);
    };

    const handleCreateIntent = () => {
        if (!intentTitle.trim()) return;
        console.log('Creating intent:', { title: intentTitle, description: intentDescription, category: intentCategory, priority: intentPriority });
        alert(`Intent created: ${intentTitle}`);
        setIntentTitle('');
        setIntentDescription('');
        setIntentCategory('');
        setIntentPriority('medium');
        setShowCreateIntentModal(false);
    };

    const handleAddAppointment = () => {
        if (!appointmentService.trim() || !appointmentDate || !appointmentTime) return;
        console.log('Adding appointment:', { service: appointmentService, date: appointmentDate, time: appointmentTime });
        alert(`Appointment added: ${appointmentService} on ${appointmentDate} at ${appointmentTime}`);
        setAppointmentService('');
        setAppointmentDate('');
        setAppointmentTime('');
        setShowAddAppointmentModal(false);
    };

    const handleAddReminder = () => {
        if (!reminderText.trim() || !reminderDate) return;
        console.log('Adding reminder:', { text: reminderText, date: reminderDate });
        alert(`Reminder added: ${reminderText} on ${reminderDate}`);
        setReminderText('');
        setReminderDate('');
        setShowAddReminderModal(false);
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-2 md:px-6 pt-0 space-y-2 md:space-y-6 pb-28 max-w-7xl mx-auto">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <button
                                onClick={() => navigate('/business/contacts')}
                                className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg border border-slate-200 dark:border-white/10 transition-colors flex-shrink-0"
                            >
                                <ArrowLeft className="text-slate-600 dark:text-slate-400" size={18} />
                            </button>
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-white/10 flex items-center justify-center text-2xl font-bold text-indigo-700 dark:text-white shadow-md flex-shrink-0">
                                {contact.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white truncate">{contact.name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Member since {contact.memberSince}</span>
                                    {contact.isFavorite && <Heart size={14} className="text-rose-500 fill-rose-500" />}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 flex-shrink-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-slate-500 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                onClick={toggleFavorite}
                            >
                                <Heart size={20} className={isFavorite || contact.isFavorite ? "fill-rose-500 text-rose-500" : ""} />
                            </Button>
                            <Button
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={() => navigate(`/business/contacts/${contactId}/edit`)}
                            >
                                <Edit2 size={16} />
                                <span>Edit Contact</span>
                            </Button>
                        </div>
                    </div>

                    {/* Quick Actions Toolbar - Desktop Only */}
                    <div className="hidden lg:block glass-panel p-4 rounded-2xl">
                        <div className="flex items-center gap-3 flex-wrap">
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                <DollarSign size={16} className="mr-2" />
                                Record Payment
                            </Button>
                            <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <FileText size={16} className="mr-2" />
                                Send Invoice
                            </Button>
                            <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                onClick={() => setShowAddAppointmentModal(true)}
                            >
                                <Calendar size={16} className="mr-2" />
                                Schedule Appointment
                            </Button>
                            <Button
                                size="sm"
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                                onClick={() => setShowAddReminderModal(true)}
                            >
                                <Bell size={16} className="mr-2" />
                                Add Reminder
                            </Button>
                            <Button
                                size="sm"
                                className="bg-rose-600 hover:bg-rose-700 text-white"
                                onClick={() => setShowCreateIntentModal(true)}
                            >
                                <Target size={16} className="mr-2" />
                                Create Intent
                            </Button>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Contact Info & Stats */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Information */}
                            <div className="glass-panel p-6 rounded-2xl">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <User size={20} className="text-rose-600 dark:text-rose-400" />
                                    Contact Information
                                </h2>
                                <div className="space-y-4">
                                    {/* Emails */}
                                    {contact.emails && contact.emails.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                                                <Mail size={16} />
                                                <span className="text-xs font-medium">Email</span>
                                            </div>
                                            <div className="space-y-2">
                                                {contact.emails.map((email) => (
                                                    <div key={email.id} className="flex items-center gap-2">
                                                        <a
                                                            href={`mailto:${email.value}`}
                                                            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                                                        >
                                                            {email.value}
                                                        </a>
                                                        {email.isPrimary && (
                                                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                                                                Primary
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Phones */}
                                    {contact.phones && contact.phones.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                                                <Phone size={16} />
                                                <span className="text-xs font-medium">Phone</span>
                                            </div>
                                            <div className="space-y-2">
                                                {contact.phones.map((phone) => (
                                                    <div key={phone.id} className="flex items-center gap-2">
                                                        <a
                                                            href={`tel:${phone.value}`}
                                                            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                                                        >
                                                            {phone.value}
                                                        </a>
                                                        {phone.isPrimary && (
                                                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                                                                Primary
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    {contact.tags && contact.tags.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                                                <Tag size={16} />
                                                <span className="text-xs font-medium">Tags</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {contact.tags.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-xs px-2 py-1 rounded border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-medium"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* History */}
                            {contact.history && contact.history.length > 0 && (
                                <div className="glass-panel p-6 rounded-2xl">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Clock size={20} className="text-rose-600 dark:text-rose-400" />
                                        History
                                    </h2>
                                    <div className="space-y-3">
                                        {contact.history.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"
                                            >
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-slate-900 dark:text-white">{item.service}</h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.notes}</p>
                                                    </div>
                                                    <span className="text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap">
                                                        {item.date}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upcoming */}
                            {contact.upcoming && contact.upcoming.length > 0 && (
                                <div className="glass-panel p-6 rounded-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Calendar size={20} className="text-rose-600 dark:text-rose-400" />
                                            Upcoming Appointments
                                        </h2>
                                        <Button
                                            size="sm"
                                            className="bg-purple-600 hover:bg-purple-700 text-white"
                                            onClick={() => setShowAddAppointmentModal(true)}
                                        >
                                            <Plus size={16} className="mr-1" />
                                            Add Appointment
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        {contact.upcoming.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-slate-900 dark:text-white">{item.service}</h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                            {item.date} at {item.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Finance */}
                            {contact.finance && contact.finance.length > 0 && (
                                <div className="glass-panel p-6 rounded-2xl">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                        <DollarSign size={20} className="text-rose-600 dark:text-rose-400" />
                                        Financial Records
                                    </h2>
                                    <div className="space-y-3">
                                        {contact.finance.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-slate-900 dark:text-white">
                                                                ${item.amount.toFixed(2)}
                                                            </h3>
                                                            <span className={`text-xs px-2 py-0.5 rounded border ${item.status === 'completed'
                                                                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                                                                : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
                                                                }`}>
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{item.date}</p>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded font-medium ${item.type === 'payment'
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                                        : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                                                        }`}>
                                                        {item.type}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            <div className="glass-panel p-6 rounded-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <StickyNote size={20} className="text-rose-600 dark:text-rose-400" />
                                        Notes
                                    </h2>
                                    <Button
                                        size="sm"
                                        className="bg-rose-600 hover:bg-rose-700 text-white"
                                        onClick={() => setShowAddNoteModal(true)}
                                    >
                                        <Plus size={16} className="mr-1" />
                                        Add Note
                                    </Button>
                                </div>
                                {contact.notes && contact.notes.length > 0 ? (
                                    <div className="space-y-3">
                                        {contact.notes.map((note) => (
                                            <div
                                                key={note.id}
                                                className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"
                                            >
                                                <p className="text-sm text-slate-900 dark:text-white mb-2">{note.text}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-500">{note.date}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No notes yet. Add your first note above.</p>
                                )}
                            </div>

                            {/* Documents */}
                            <div className="glass-panel p-6 rounded-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <FileText size={20} className="text-rose-600 dark:text-rose-400" />
                                        Documents
                                    </h2>
                                    <Button
                                        size="sm"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                        onClick={() => setShowAddDocumentModal(true)}
                                    >
                                        <Upload size={16} className="mr-1" />
                                        Upload
                                    </Button>
                                </div>
                                {contact.documents && contact.documents.length > 0 ? (
                                    <div className="space-y-3">
                                        {contact.documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <FileText size={20} className="text-indigo-600 dark:text-indigo-400" />
                                                        <div>
                                                            <h3 className="font-medium text-slate-900 dark:text-white">{doc.name}</h3>
                                                            <p className="text-xs text-slate-500 dark:text-slate-500">
                                                                {doc.date} • {doc.size}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No documents yet. Upload your first document above.</p>
                                )}
                            </div>

                            {/* Reminders */}
                            <div className="glass-panel p-6 rounded-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Bell size={20} className="text-rose-600 dark:text-rose-400" />
                                        Reminders
                                    </h2>
                                    <Button
                                        size="sm"
                                        className="bg-amber-600 hover:bg-amber-700 text-white"
                                        onClick={() => setShowAddReminderModal(true)}
                                    >
                                        <Plus size={16} className="mr-1" />
                                        Add Reminder
                                    </Button>
                                </div>
                                {contact.reminders && contact.reminders.length > 0 ? (
                                    <div className="space-y-3">
                                        {contact.reminders.map((reminder) => (
                                            <div
                                                key={reminder.id}
                                                className="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10"
                                            >
                                                <div className="flex items-start gap-3">
                                                    {reminder.done ? (
                                                        <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                                                    ) : (
                                                        <Circle size={20} className="text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
                                                    )}
                                                    <div className="flex-1">
                                                        <p className={`text-sm ${reminder.done ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                                                            {reminder.text}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{reminder.date}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No reminders yet. Add your first reminder above.</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Stats */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="glass-panel p-6 rounded-2xl lg:hidden">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    <Button
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white justify-start"
                                    >
                                        <DollarSign size={16} className="mr-2" />
                                        Record Payment
                                    </Button>
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
                                    >
                                        <FileText size={16} className="mr-2" />
                                        Send Invoice
                                    </Button>
                                    <Button
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-start"
                                        onClick={() => setShowAddAppointmentModal(true)}
                                    >
                                        <Calendar size={16} className="mr-2" />
                                        Schedule Appointment
                                    </Button>
                                    <Button
                                        className="w-full bg-amber-600 hover:bg-amber-700 text-white justify-start"
                                        onClick={() => setShowAddReminderModal(true)}
                                    >
                                        <Bell size={16} className="mr-2" />
                                        Add Reminder
                                    </Button>
                                    <Button
                                        className="w-full bg-rose-600 hover:bg-rose-700 text-white justify-start"
                                        onClick={() => setShowCreateIntentModal(true)}
                                    >
                                        <Target size={16} className="mr-2" />
                                        Create Intent
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Note Modal */}
            {showAddNoteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddNoteModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <StickyNote size={24} className="text-rose-600 dark:text-rose-400" />
                                    Add Note
                                </h2>
                                <button
                                    onClick={() => setShowAddNoteModal(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-slate-500 dark:text-slate-400" />
                                </button>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                Add a note about {contact.name}
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Note *
                                    </label>
                                    <textarea
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        placeholder="Enter your note here..."
                                        rows={6}
                                        className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddNoteModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddNote}
                                    disabled={!noteText.trim()}
                                    className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                                >
                                    Add Note
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Document Modal */}
            {showAddDocumentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddDocumentModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <FileText size={24} className="text-indigo-600 dark:text-indigo-400" />
                                    Upload Document
                                </h2>
                                <button
                                    onClick={() => setShowAddDocumentModal(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-slate-500 dark:text-slate-400" />
                                </button>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                Upload a document for {contact.name}
                            </p>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Document Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={documentName}
                                        onChange={(e) => setDocumentName(e.target.value)}
                                        placeholder="e.g., Contract_2024.pdf"
                                        className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Upload File
                                    </label>
                                    <div className="border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl p-6 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                                        <Upload size={32} className="mx-auto mb-3 text-slate-400 dark:text-slate-500" />
                                        <input
                                            type="file"
                                            onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                                        >
                                            Click to upload
                                        </label>
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                            or drag and drop
                                        </p>
                                        {documentFile && (
                                            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-3 font-medium">
                                                Selected: {documentFile.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddDocumentModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddDocument}
                                    disabled={!documentName.trim() && !documentFile}
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                                >
                                    Upload Document
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Intent Modal */}
            {showCreateIntentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateIntentModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Target size={24} className="text-rose-600 dark:text-rose-400" />
                                    Create Intent
                                </h2>
                                <button
                                    onClick={() => setShowCreateIntentModal(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-slate-500 dark:text-slate-400" />
                                </button>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                Create a new intent with {contact.name}
                            </p>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Intent Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={intentTitle}
                                        onChange={(e) => setIntentTitle(e.target.value)}
                                        placeholder="e.g., Provide consulting services"
                                        className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={intentDescription}
                                        onChange={(e) => setIntentDescription(e.target.value)}
                                        placeholder="Describe the intent in detail..."
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        value={intentCategory}
                                        onChange={(e) => setIntentCategory(e.target.value)}
                                        placeholder="e.g., Service Provided, Service Received"
                                        className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                                        Priority
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => setIntentPriority('low')}
                                            className={`p-3 rounded-xl border-2 transition-all font-medium ${intentPriority === 'low'
                                                ? 'border-slate-500 bg-slate-50 dark:bg-slate-500/10 text-slate-900 dark:text-white'
                                                : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-600 dark:text-slate-400'
                                                }`}
                                        >
                                            Low
                                        </button>
                                        <button
                                            onClick={() => setIntentPriority('medium')}
                                            className={`p-3 rounded-xl border-2 transition-all font-medium ${intentPriority === 'medium'
                                                ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300'
                                                : 'border-slate-200 dark:border-white/10 hover:border-amber-300 dark:hover:border-amber-500/50 text-slate-600 dark:text-slate-400'
                                                }`}
                                        >
                                            Medium
                                        </button>
                                        <button
                                            onClick={() => setIntentPriority('high')}
                                            className={`p-3 rounded-xl border-2 transition-all font-medium ${intentPriority === 'high'
                                                ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-900 dark:text-red-300'
                                                : 'border-slate-200 dark:border-white/10 hover:border-red-300 dark:hover:border-red-500/50 text-slate-600 dark:text-slate-400'
                                                }`}
                                        >
                                            High
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreateIntentModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateIntent}
                                    disabled={!intentTitle.trim()}
                                    className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                                >
                                    Create Intent
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Appointment Modal */}
            {showAddAppointmentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddAppointmentModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Calendar size={24} className="text-purple-600 dark:text-purple-400" />
                                    Schedule Appointment
                                </h2>
                                <button
                                    onClick={() => setShowAddAppointmentModal(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-slate-500 dark:text-slate-400" />
                                </button>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                Schedule a new appointment with {contact.name}
                            </p>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Service/Purpose *
                                    </label>
                                    <input
                                        type="text"
                                        value={appointmentService}
                                        onChange={(e) => setAppointmentService(e.target.value)}
                                        placeholder="e.g., Consultation, Meeting, Review"
                                        className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                            Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={appointmentDate}
                                            onChange={(e) => setAppointmentDate(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                            Time *
                                        </label>
                                        <input
                                            type="time"
                                            value={appointmentTime}
                                            onChange={(e) => setAppointmentTime(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddAppointmentModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddAppointment}
                                    disabled={!appointmentService.trim() || !appointmentDate || !appointmentTime}
                                    className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                                >
                                    Schedule Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Reminder Modal */}
            {showAddReminderModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddReminderModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Bell size={24} className="text-amber-600 dark:text-amber-400" />
                                    Add Reminder
                                </h2>
                                <button
                                    onClick={() => setShowAddReminderModal(false)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-slate-500 dark:text-slate-400" />
                                </button>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                                Create a reminder for {contact.name}
                            </p>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Reminder *
                                    </label>
                                    <textarea
                                        value={reminderText}
                                        onChange={(e) => setReminderText(e.target.value)}
                                        placeholder="What do you want to be reminded about?"
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Due Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={reminderDate}
                                        onChange={(e) => setReminderDate(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddReminderModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddReminder}
                                    disabled={!reminderText.trim() || !reminderDate}
                                    className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                                >
                                    Add Reminder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
