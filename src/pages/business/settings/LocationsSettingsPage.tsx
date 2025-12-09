import { Button } from '../../../components/ui/button';
import { MapPin, Mail, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LocationsSettingsPage = () => {
    const navigate = useNavigate();

    const locations = [
        {
            id: 1,
            name: 'Main Street Branch',
            address: '123 Main St, New York, NY 10001',
            email: 'store1@joescoffee.com',
            phone: '(555) 123-4567',
            isPrimary: true
        },
        {
            id: 2,
            name: 'Downtown Location',
            address: '456 Park Ave, New York, NY 10022',
            email: 'downtown@joescoffee.com',
            phone: '(555) 987-6543',
            isPrimary: false
        }
    ];

    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <div className="max-w-4xl mx-auto px-4 md:px-6 pb-20 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between pt-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Locations</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage your business locations and addresses</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/business/settings')}
                            className="text-slate-600 dark:text-slate-300"
                        >
                            Back
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                            <Plus size={16} />
                            Add Location
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="glass-panel p-6 rounded-xl space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <MapPin size={20} className="text-indigo-500" />
                                All Locations
                            </h3>
                            <span className="text-sm text-slate-500">{locations.length} location{locations.length !== 1 ? 's' : ''}</span>
                        </div>

                        <div className="space-y-4">
                            {locations.map(location => (
                                <div key={location.id} className="p-4 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 space-y-3 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">{location.name}</div>
                                            <div className="text-sm text-slate-500 mt-1">{location.address}</div>
                                        </div>
                                        {location.isPrimary && (
                                            <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Primary</span>
                                        )}
                                    </div>
                                    <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Mail size={12} /> {location.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            📞 {location.phone}
                                        </span>
                                    </div>
                                    <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex gap-2">
                                        <Button variant="outline" size="sm" className="text-xs">Edit</Button>
                                        {!location.isPrimary && (
                                            <Button variant="outline" size="sm" className="text-xs text-red-600 hover:text-red-700">Remove</Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
