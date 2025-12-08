import { CalendarDays } from 'lucide-react';

export const BusinessCalendarPage = () => {
    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-4 md:px-6 pt-0 space-y-4 md:space-y-6 pb-28 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
                    <div className="h-24 w-24 rounded-full bg-indigo-100 dark:bg-slate-900/50 flex items-center justify-center mb-6 border border-indigo-200 dark:border-white/5 shadow-lg">
                        <CalendarDays size={48} className="text-indigo-600 dark:text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Calendar</h3>
                    <p className="text-slate-500 dark:text-slate-500">Upcoming appointments feature coming soon.</p>
                </div>
            </div>
        </div>
    );
};
