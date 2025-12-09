import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Save, Building2, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GeneralSettingsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <div className="max-w-4xl mx-auto px-2 md:px-6 pb-20 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between pt-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">General Settings</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage your business profile and basic information</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/business/settings')}
                            className="text-slate-600 dark:text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                            <Save size={16} />
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="glass-panel p-6 rounded-xl space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Building2 size={20} className="text-indigo-500" />
                            Basic Information
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Business Name</label>
                                <Input defaultValue="Joe's Coffee" placeholder="Enter business name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Industry</label>
                                <Input defaultValue="Food & Beverage" placeholder="e.g. Retail, Technology" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Description</label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                                    placeholder="Tell us about your business..."
                                    defaultValue="Premium coffee shop serving artisanal blends and pastries in a cozy atmosphere."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Globe size={20} className="text-indigo-500" />
                            Online Presence
                        </h3>
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Website</label>
                                <Input defaultValue="https://joescoffee.com" placeholder="https://" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Public Email</label>
                                <Input defaultValue="contact@joescoffee.com" placeholder="Email address" type="email" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
