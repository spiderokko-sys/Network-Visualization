import { Button } from '../../../components/ui/button';
import { Save, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationsSettingsPage = () => {
    const navigate = useNavigate();

    const notificationCategories = [
        {
            title: 'Customer Activity',
            items: [
                { id: 'new_reviews', label: 'New Reviews', description: 'Get notified when customers leave reviews' },
                { id: 'new_orders', label: 'New Orders', description: 'Receive alerts for new customer orders' },
                { id: 'customer_messages', label: 'Customer Messages', description: 'Notifications for direct messages from customers' },
            ]
        },
        {
            title: 'Business Updates',
            items: [
                { id: 'weekly_reports', label: 'Weekly Reports', description: 'Receive weekly business performance summaries' },
                { id: 'monthly_insights', label: 'Monthly Insights', description: 'Get monthly analytics and insights' },
                { id: 'system_updates', label: 'System Updates', description: 'Important platform updates and announcements' },
            ]
        },
        {
            title: 'Marketing',
            items: [
                { id: 'campaign_results', label: 'Campaign Results', description: 'Updates on marketing campaign performance' },
                { id: 'engagement_alerts', label: 'Engagement Alerts', description: 'High engagement or trending content notifications' },
            ]
        }
    ];

    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <div className="max-w-4xl mx-auto px-4 md:px-6 pb-20 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between pt-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notification Settings</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage how and when you receive notifications</p>
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
                    {notificationCategories.map((category, idx) => (
                        <div key={idx} className="glass-panel p-6 rounded-xl space-y-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Bell size={20} className="text-indigo-500" />
                                {category.title}
                            </h3>

                            <div className="space-y-4 divide-y divide-slate-100 dark:divide-white/5">
                                {category.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between pt-4 first:pt-0">
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-900 dark:text-white">{item.label}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
