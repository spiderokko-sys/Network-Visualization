import { useState } from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

export const NotificationsSettingsPage = () => {
    const [notifications, setNotifications] = useState(true);
    const [emailUpdates, setEmailUpdates] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Notifications</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Choose how you want to be notified.</p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-slate-900 dark:text-white font-medium">Push Notifications</div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">Receive notifications on your device</div>
                    </div>
                    <button onClick={() => setNotifications(!notifications)} className={`transition-colors text-2xl ${notifications ? 'text-indigo-600 dark:text-indigo-500' : 'text-slate-400 dark:text-slate-600'}`}>
                        {notifications ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-slate-900 dark:text-white font-medium">Email Updates</div>
                        <div className="text-xs text-slate-500 dark:text-slate-500">Receive weekly summaries and product updates</div>
                    </div>
                    <button onClick={() => setEmailUpdates(!emailUpdates)} className={`transition-colors text-2xl ${emailUpdates ? 'text-indigo-600 dark:text-indigo-500' : 'text-slate-400 dark:text-slate-600'}`}>
                        {emailUpdates ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
