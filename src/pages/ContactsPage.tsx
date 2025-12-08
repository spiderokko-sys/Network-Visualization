
import { useState, useMemo } from 'react';
import {
    Search,
    Plus,
    MoreHorizontal,
    Phone,
    Mail,
    MessageSquare,
    Star,
    ChevronRight,
    X,
    CreditCard,
    User,
    Hash
} from 'lucide-react';


// Interface matching the mock data structure
export interface Contact {
    id: number;
    name: string;
    status: string;
    tags: string[];
    visits: number;
    last_seen: string;
    memberSince: string;
    isFavorite: boolean;
    emails: { id: string; value: string; isPrimary: boolean }[];
    phones: { id: string; value: string; isPrimary: boolean }[];
    history: any[];
    upcoming: any[];
    finance: any[];
    notes: any[];
    documents: any[];
    reminders: any[];
    company?: string;
    role?: string;
}

interface ContactsScreenProps {
    contacts?: Contact[];
}

// ... imports
import { ContactForm } from '../components/ContactForm';
import { Pencil, Trash2 } from 'lucide-react';

// ... interfaces

export function ContactsScreen({ contacts: initialContacts = [] }: ContactsScreenProps) {
    const [contacts, setContacts] = useState<Contact[]>(initialContacts);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [filterType, setFilterType] = useState<'all' | 'favorites' | 'recent'>('all');

    // Filter contacts
    const filteredContacts = useMemo(() => {
        return contacts.filter(contact => {
            const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesFilter = filterType === 'all'
                ? true
                : filterType === 'favorites'
                    ? contact.isFavorite
                    : true;
            return matchesSearch && matchesFilter;
        });
    }, [contacts, searchTerm, filterType]);

    const handleSaveContact = (updatedContact: Contact) => {
        if (contacts.find(c => c.id === updatedContact.id)) {
            // Update existing
            setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
        } else {
            // Add new
            setContacts(prev => [...prev, updatedContact]);
        }
        setSelectedContact(updatedContact); // Keep/Set selected
        setIsEditing(false);
    };

    const handleDeleteContact = (id: number) => {
        setContacts(prev => prev.filter(c => c.id !== id));
        setSelectedContact(null);
        setIsEditing(false);
    };

    const startNewContact = () => {
        setSelectedContact(null); // Clear selection to indicate "new" context effectively relative to the detail view, but we are using a dual-purpose state or similar. 
        // Actually, logic: if selectedContact is null, and isEditing is true, it's "New". If selectedContact is set and isEditing is true, it's "Edit".
        // Wait, if I set selectedContact to null, the drawer closes.
        // I need a way to open the drawer for "New".
        // Let's use a separate state `isAdding` OR simply allow `selectedContact` to be a partial placeholder? 
        // Better: `selectedContact` drives the drawer visibility. 
        // If I want to add, I should set `selectedContact` to a valid empty object? Or use a separate mode.
        // Let's keep `selectedContact` for viewing. 
        // If I click Add, I'll set `isEditing` to true and `selectedContact` to null? 
        // But the drawer checks `selectedContact`.
        // Let's change the drawer condition: `{ (selectedContact || isEditing) && ... }`
        setIsEditing(true);
        setSelectedContact(null);
    };

    const ContactCard = ({ contact }: { contact: Contact }) => (
        <div
            onClick={() => { setSelectedContact(contact); setIsEditing(false); }}
            className="group relative flex flex-col p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm"
        >
            {/* Hover Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 group-hover:via-indigo-500/5 group-hover:to-indigo-500/10 transition-all duration-500" />

            <div className="flex items-start justify-between relative z-10 mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 p-[2px]">
                        <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-lg font-bold text-white">
                            {contact.name.charAt(0)}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">{contact.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            {contact.status === 'L1' ? <Star size={10} className="text-amber-400 fill-amber-400" /> : null}
                            {contact.status} Member
                        </p>
                    </div>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            <div className="space-y-2 relative z-10 mb-4 flex-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Mail size={14} className="text-slate-500" />
                    <span className="truncate">{contact.emails.find(e => e.isPrimary)?.value || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Phone size={14} className="text-slate-500" />
                    <span className="truncate">{contact.phones.find(p => p.isPrimary)?.value || 'No phone'}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 relative z-10 mt-auto">
                {contact.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-md bg-white/5 text-[10px] uppercase font-medium tracking-wider text-slate-400 border border-white/5">
                        {tag}
                    </span>
                ))}
                {contact.tags.length > 2 && (
                    <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-slate-400 border border-white/5">
                        +{contact.tags.length - 2}
                    </span>
                )}
            </div>

            {contact.isFavorite && (
                <div className="absolute top-4 right-12 text-amber-500/20 group-hover:text-amber-500/40 transition-colors">
                    <Star size={64} className="fill-current rotate-12" />
                </div>
            )}
        </div>
    );

    return (
        <div className="h-full w-full flex flex-col bg-slate-950 relative overflow-hidden">

            {/* Top Bar */}
            <div className="h-20 px-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-slate-950/50 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Contacts</h2>
                    <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/5">
                        <button
                            onClick={() => setFilterType('all')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterType === 'all' ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterType('favorites')}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filterType === 'favorites' ? 'bg-amber-500/20 text-amber-300 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            Favorites
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64 bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <button
                        onClick={startNewContact}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] active:scale-95"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Add Contact</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Contacts Grid */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                        {filteredContacts.map(contact => (
                            <ContactCard key={contact.id} contact={contact} />
                        ))}
                        {filteredContacts.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
                                <User size={48} className="mb-4 opacity-20" />
                                <p className="text-lg font-medium">No contacts found</p>
                                <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail/Edit Slide-over */}
                <div className={`
            fixed inset-y-0 right-0 w-full md:w-[450px] bg-slate-900/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-30
            ${(selectedContact || isEditing) ? 'translate-x-0' : 'translate-x-full'}
         `}>
                    {isEditing ? (
                        <ContactForm
                            contact={selectedContact}
                            onSave={handleSaveContact}
                            onCancel={() => { setIsEditing(false); if (!selectedContact?.id) setSelectedContact(null); }}
                        />
                    ) : selectedContact && (
                        <div className="h-full flex flex-col overflow-y-auto custom-scrollbar">
                            {/* Header Image/Banner */}
                            <div className="h-32 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 relative">
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Profile Info */}
                            <div className="px-8 -mt-12 mb-6">
                                <div className="h-24 w-24 rounded-2xl bg-slate-900 p-1 shadow-xl ring-1 ring-white/10">
                                    <div className="h-full w-full rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-inner">
                                        {selectedContact.name.charAt(0)}
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                            {selectedContact.name}
                                            {selectedContact.isFavorite && <Star size={20} className="text-amber-400 fill-amber-400" />}
                                        </h2>
                                        <div className="flex items-center gap-2 mt-1 text-slate-400">
                                            <span className="px-2 py-0.5 rounded text-xs bg-white/5 border border-white/5 text-slate-300">
                                                {selectedContact.status}
                                            </span>
                                            <span className="text-sm">Member since {selectedContact.memberSince}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
                                            title="Edit Contact"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteContact(selectedContact.id)}
                                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                            title="Delete Contact"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="px-8 grid grid-cols-4 gap-2 mb-8">
                                <ActionButton icon={Phone} label="Call" color="emerald" />
                                <ActionButton icon={MessageSquare} label="Message" color="indigo" />
                                <ActionButton icon={Mail} label="Email" color="blue" />
                                <ActionButton icon={CreditCard} label="Pay" color="pink" />
                            </div>

                            {/* Details Sections */}
                            <div className="px-8 space-y-6 pb-12">
                                {/* Contact Info */}
                                <Section title="Contact Information">
                                    <div className="space-y-3">
                                        {selectedContact.emails.map(email => (
                                            <InfoRow key={email.id} icon={Mail} label="Email" value={email.value} sub={email.isPrimary ? 'Primary' : 'Secondary'} />
                                        ))}
                                        {selectedContact.phones.map(phone => (
                                            <InfoRow key={phone.id} icon={Phone} label="Phone" value={phone.value} sub={phone.isPrimary ? 'Mobile' : 'Work'} />
                                        ))}
                                    </div>
                                </Section>

                                {/* Tags */}
                                <Section title="Tags">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedContact.tags.map(tag => (
                                            <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-sm text-slate-300 border border-white/5">
                                                <Hash size={12} className="text-slate-500" />
                                                {tag}
                                            </span>
                                        ))}
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 text-sm text-slate-400 border border-white/5 border-dashed transition-colors"
                                        >
                                            <Plus size={14} /> Add
                                        </button>
                                    </div>
                                </Section>

                                {/* Activity Timeline */}
                                <Section title="Recent Activity">
                                    <div className="relative space-y-4 pl-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                                        {selectedContact.history.length > 0 ? (
                                            selectedContact.history.map((item: any) => (
                                                <div key={item.id} className="relative">
                                                    <div className="absolute -left-[21px] top-1 h-3.5 w-3.5 rounded-full bg-slate-900 border-2 border-indigo-500" />
                                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h5 className="font-medium text-slate-200">{item.service}</h5>
                                                            <span className="text-xs text-slate-500">{item.date}</span>
                                                        </div>
                                                        <p className="text-sm text-slate-400">{item.notes}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-sm text-slate-500 italic px-2">No recent history</div>
                                        )}
                                    </div>
                                </Section>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

// Sub-components
const ActionButton = ({ icon: Icon, label, color }: any) => {
    const colorStyles: any = {
        emerald: "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
        indigo: "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20",
        blue: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
        pink: "bg-pink-500/10 text-pink-400 hover:bg-pink-500/20",
    };

    return (
        <button className={`flex flex-col items-center justify-center p-3 rounded-xl gap-2 transition-all active:scale-95 ${colorStyles[color] || colorStyles.indigo}`}>
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
};

// ... Section, InfoRow, DropdownActions unchanged


const Section = ({ title, children }: any) => (
    <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            {title}
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </h4>
        {children}
    </div>
);

const InfoRow = ({ icon: Icon, label, value, sub }: any) => (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
        <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-slate-200 transition-colors">
            <Icon size={20} />
        </div>
        <div>
            <div className="text-sm text-slate-200 font-medium">{value}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1">{label} • {sub}</div>
        </div>
        <button className="ml-auto opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-white transition-all">
            <ChevronRight size={16} />
        </button>
    </div>
);


