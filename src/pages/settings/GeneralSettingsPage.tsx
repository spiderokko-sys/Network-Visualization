import { User, ChevronRight, Globe } from 'lucide-react';

export const GeneralSettingsPage = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">General Settings</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your account information and preferences.</p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden divide-y divide-slate-200 dark:divide-white/5">
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <User size={20} />
                        </div>
                        <div>
                            <div className="text-slate-900 dark:text-white font-medium">Personal Information</div>
                            <div className="text-xs text-slate-500 dark:text-slate-500">Update your name, bio, and contact info</div>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Globe size={20} />
                        </div>
                        <div>
                            <div className="text-slate-900 dark:text-white font-medium">Language & Region</div>
                            <div className="text-xs text-slate-500 dark:text-slate-500">English (US), Timezone: EST</div>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
            </div>
        </div>
    );
};
