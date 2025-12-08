
import { useState, useEffect } from 'react';
import { X, Save, Trash, Plus } from 'lucide-react';
import { Contact } from './ContactsScreen';

interface ContactFormProps {
    contact?: Contact | null;
    onSave: (contact: Contact) => void;
    onCancel: () => void;
}

const EMPTY_CONTACT: Contact = {
    id: 0,
    name: '',
    status: 'L1',
    tags: [],
    visits: 0,
    last_seen: 'Just now',
    memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    isFavorite: false,
    emails: [{ id: 'e1', value: '', isPrimary: true }],
    phones: [{ id: 'p1', value: '', isPrimary: true }],
    history: [],
    upcoming: [],
    finance: [],
    notes: [],
    documents: [],
    reminders: []
};

export const ContactForm = ({ contact, onSave, onCancel }: ContactFormProps) => {
    const [formData, setFormData] = useState<Contact>(contact || { ...EMPTY_CONTACT, id: Date.now() });

    useEffect(() => {
        if (contact) {
            setFormData(contact);
        } else {
            setFormData({ ...EMPTY_CONTACT, id: Date.now() });
        }
    }, [contact]);

    const updateField = (field: keyof Contact, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateEmail = (id: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            emails: prev.emails.map(e => e.id === id ? { ...e, value } : e)
        }));
    };

    const addEmail = () => {
        setFormData(prev => ({
            ...prev,
            emails: [...prev.emails, { id: `e${Date.now()}`, value: '', isPrimary: false }]
        }));
    };

    const removeEmail = (id: string) => {
        setFormData(prev => ({
            ...prev,
            emails: prev.emails.filter(e => e.id !== id)
        }));
    };

    const updatePhone = (id: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            phones: prev.phones.map(p => p.id === id ? { ...p, value } : p)
        }));
    };

    const addPhone = () => {
        setFormData(prev => ({
            ...prev,
            phones: [...prev.phones, { id: `p${Date.now()}`, value: '', isPrimary: false }]
        }));
    };

    const removePhone = (id: string) => {
        setFormData(prev => ({
            ...prev,
            phones: prev.phones.filter(p => p.id !== id)
        }));
    };

    return (
        <div className="h-full flex flex-col bg-slate-950/50">
            {/* Header */}
            <div className="h-20 border-b border-white/5 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white">
                    {contact ? 'Edit Contact' : 'New Contact'}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                {/* Basic Info */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider">Basic Info</label>
                    <div className="space-y-3">
                        <div>
                            <span className="text-xs text-slate-500 block mb-1">Full Name</span>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                placeholder="e.g. Alice Smith"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-slate-500 block mb-1">Status</span>
                                <select
                                    value={formData.status}
                                    onChange={(e) => updateField('status', e.target.value)}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                >
                                    <option value="L1">L1 Member</option>
                                    <option value="VIP">VIP</option>
                                    <option value="Guest">Guest</option>
                                </select>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 block mb-1">Tags (comma separated)</span>
                                <input
                                    type="text"
                                    value={formData.tags.join(', ')}
                                    onChange={(e) => updateField('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                    placeholder="e.g. VIP, Regular"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider">Contact Details</label>
                    </div>

                    {/* Emails */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">Emails</span>
                            <button onClick={addEmail} className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1"><Plus size={12} /> Add</button>
                        </div>
                        {formData.emails.map((email, idx) => (
                            <div key={email.id} className="flex gap-2">
                                <input
                                    type="email"
                                    value={email.value}
                                    onChange={(e) => updateEmail(email.id, e.target.value)}
                                    className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                    placeholder="Email address"
                                />
                                {idx > 0 && (
                                    <button onClick={() => removeEmail(email.id)} className="p-2 text-slate-500 hover:text-red-400">
                                        <Trash size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Phones */}
                    <div className="space-y-3 mt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">Phones</span>
                            <button onClick={addPhone} className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1"><Plus size={12} /> Add</button>
                        </div>
                        {formData.phones.map((phone, idx) => (
                            <div key={phone.id} className="flex gap-2">
                                <input
                                    type="tel"
                                    value={phone.value}
                                    onChange={(e) => updatePhone(phone.id, e.target.value)}
                                    className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                    placeholder="Phone number"
                                />
                                {idx > 0 && (
                                    <button onClick={() => removePhone(phone.id)} className="p-2 text-slate-500 hover:text-red-400">
                                        <Trash size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={() => onSave(formData)}
                    disabled={!formData.name}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save size={18} />
                    <span>Save Contact</span>
                </button>
            </div>
        </div>
    );
};
