
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Tag, Save, Circle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const MOCK_CIRCLES = [
    { id: 'c1', name: 'Weekend Regulars' },
    { id: 'c2', name: 'Local Tech Workers' },
    { id: 'c3', name: 'VIP Clients' },
    { id: 'c4', name: 'Early Adopters' }
];

export const CreateContactPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        tags: '',
        circleId: ''
    });

    const isFormValid = form.name.trim() !== '';

    const handleSave = () => {
        // In a real app, this would make an API call
        console.log('Saving contact:', form);

        // Navigate back to contacts list
        navigate('/business/contacts');
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0 bg-slate-50 dark:bg-slate-900/50">
            <div className="px-4 md:px-6 pt-0 pb-28 max-w-3xl mx-auto">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Header */}
                    <div className="flex items-center gap-4 py-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate('/business/contacts')}
                            className="rounded-full hover:bg-slate-200 dark:hover:bg-white/10"
                        >
                            <ArrowLeft className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                        </Button>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Contact</h1>
                    </div>

                    <div className="glass-panel p-6 md:p-8 space-y-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">

                        {/* Name Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-500" />
                                Basic Information
                            </h3>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Full Name <span className="text-rose-500">*</span>
                                    </label>
                                    <Input
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="e.g. Jane Doe"
                                        className="bg-slate-50 dark:bg-slate-800/50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-100 dark:bg-white/5" />

                        {/* Contact Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Phone className="w-5 h-5 text-emerald-500" />
                                Contact Details
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            placeholder="e.g. 555-0123"
                                            className="pl-10 bg-slate-50 dark:bg-slate-800/50"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            placeholder="e.g. jane@example.com"
                                            className="pl-10 bg-slate-50 dark:bg-slate-800/50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-100 dark:bg-white/5" />

                        {/* Organization & Tags */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <Tag className="w-5 h-5 text-amber-500" />
                                Categorization
                            </h3>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Tags (comma separated)
                                    </label>
                                    <Input
                                        value={form.tags}
                                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                                        placeholder="e.g. VIP, Local, New"
                                        className="bg-slate-50 dark:bg-slate-800/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Circle className="w-4 h-4" /> Add to Custom Circle
                                    </label>
                                    <select
                                        value={form.circleId}
                                        onChange={(e) => setForm({ ...form, circleId: e.target.value })}
                                        className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Select a circle...</option>
                                        {MOCK_CIRCLES.map((circle) => (
                                            <option key={circle.id} value={circle.id}>
                                                {circle.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Assigning a circle adds this contact to a specific distribution group.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 flex items-center justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/business/contacts')}
                                className="px-6"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={!isFormValid}
                                className="px-8 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Contact
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
