import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Star, X, Search, UserPlus, Phone, Mail, Video
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

// Mock data - in a real app, this would come from a global state or API
const MOCK_ALL_CONTACTS = [
    { id: 1, name: 'Alice Morgan', email: 'alice@example.com', phone: '+1 234-567-8901', isFavorite: true, avatar: 'A' },
    { id: 2, name: 'Bob Davis', email: 'bob@example.com', phone: '+1 234-567-8902', isFavorite: true, avatar: 'B' },
    { id: 3, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 234-567-8903', isFavorite: true, avatar: 'S' },
    { id: 4, name: 'Charlie Wilson', email: 'charlie@example.com', phone: '+1 234-567-8904', isFavorite: false, avatar: 'C' },
    { id: 5, name: 'Diana Prince', email: 'diana@example.com', phone: '+1 234-567-8905', isFavorite: false, avatar: 'D' },
    { id: 6, name: 'Ethan Hunt', email: 'ethan@example.com', phone: '+1 234-567-8906', isFavorite: false, avatar: 'E' },
    { id: 7, name: 'Fiona Green', email: 'fiona@example.com', phone: '+1 234-567-8907', isFavorite: false, avatar: 'F' },
    { id: 8, name: 'George Clark', email: 'george@example.com', phone: '+1 234-567-8908', isFavorite: false, avatar: 'G' },
];

export const ManageFavoritesPage = () => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState(MOCK_ALL_CONTACTS);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleFavorite = (contactId: number) => {
        setContacts(contacts.map(contact =>
            contact.id === contactId
                ? { ...contact, isFavorite: !contact.isFavorite }
                : contact
        ));
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
    );

    const favorites = filteredContacts.filter(c => c.isFavorite);
    const nonFavorites = filteredContacts.filter(c => !c.isFavorite);

    return (
        <div className="h-full overflow-y-auto no-scrollbar pt-2 px-4 md:p-6 space-y-6 animate-in fade-in slide-in-from-right-4 pb-28 bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/calls')}
                    className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Favorites</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Add or remove contacts from your favorites</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="glass-panel p-4 border border-slate-200 dark:border-white/5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        type="text"
                        placeholder="Search contacts by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="glass-panel p-4 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg">
                            <Star size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{favorites.length}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Favorites</p>
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-4 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <UserPlus size={20} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{contacts.length}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Total Contacts</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Favorites */}
            {favorites.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">
                        Current Favorites ({favorites.length})
                    </h3>
                    <div className="glass-panel rounded-xl overflow-hidden border border-slate-200 dark:border-white/5">
                        {favorites.map((contact, idx) => (
                            <div
                                key={contact.id}
                                className={`p-4 flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group ${idx !== favorites.length - 1 ? 'border-b border-slate-200 dark:border-white/5' : ''
                                    }`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-lg font-bold text-white shadow-lg border border-white/20">
                                        {contact.avatar}
                                    </div>
                                    <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1 shadow-lg border-2 border-white dark:border-slate-950">
                                        <Star size={10} className="text-white fill-white" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{contact.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        <Mail size={12} />
                                        <span className="truncate">{contact.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        <Phone size={12} />
                                        <span>{contact.phone}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleFavorite(contact.id)}
                                        className="p-2 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors border border-red-200 dark:border-red-500/30"
                                        title="Remove from favorites"
                                    >
                                        <X size={16} />
                                    </button>
                                    <button
                                        className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors border border-emerald-200 dark:border-emerald-500/30"
                                        title="Start video call"
                                    >
                                        <Video size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add to Favorites */}
            {nonFavorites.length > 0 && (
                <div>
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 px-1">
                        Add to Favorites ({nonFavorites.length})
                    </h3>
                    <div className="glass-panel rounded-xl overflow-hidden border border-slate-200 dark:border-white/5">
                        {nonFavorites.map((contact, idx) => (
                            <div
                                key={contact.id}
                                className={`p-4 flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group ${idx !== nonFavorites.length - 1 ? 'border-b border-slate-200 dark:border-white/5' : ''
                                    }`}
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-lg border border-white/20">
                                    {contact.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{contact.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        <Mail size={12} />
                                        <span className="truncate">{contact.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        <Phone size={12} />
                                        <span>{contact.phone}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleFavorite(contact.id)}
                                        className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors border border-amber-200 dark:border-amber-500/30 group/star"
                                        title="Add to favorites"
                                    >
                                        <Star size={16} className="group-hover/star:fill-amber-600 dark:group-hover/star:fill-amber-400 transition-all" />
                                    </button>
                                    <button
                                        className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors border border-emerald-200 dark:border-emerald-500/30"
                                        title="Start video call"
                                    >
                                        <Video size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Results */}
            {filteredContacts.length === 0 && (
                <div className="glass-panel p-12 border border-slate-200 dark:border-white/5 text-center">
                    <Search size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No contacts found</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Try adjusting your search terms
                    </p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    className="flex-1 h-12 text-slate-900 dark:text-white border-slate-300 dark:border-white/10"
                    onClick={() => navigate('/calls')}
                >
                    Cancel
                </Button>
                <Button
                    className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20"
                    onClick={() => navigate('/calls')}
                >
                    <Star className="mr-2" size={18} />
                    Done
                </Button>
            </div>
        </div>
    );
};
