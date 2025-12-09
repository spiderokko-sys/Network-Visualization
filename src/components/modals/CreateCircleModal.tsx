import { useState } from 'react';
import { X, Circle, AlertCircle, Users, Tag, MapPin } from 'lucide-react';

interface CreateCircleModalProps {
    onClose: () => void;
    onSave: (circleData: CircleData) => void;
}

export interface CircleData {
    name: string;
    description: string;
    color: string;
    criteria: {
        tags?: string[];
        location?: string;
        visitFrequency?: string;
    };
}

const CIRCLE_COLORS = [
    { name: 'Emerald', value: 'emerald', class: 'bg-emerald-500' },
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
    { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
    { name: 'Amber', value: 'amber', class: 'bg-amber-500' },
    { name: 'Rose', value: 'rose', class: 'bg-rose-500' },
    { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' },
    { name: 'Cyan', value: 'cyan', class: 'bg-cyan-500' },
    { name: 'Teal', value: 'teal', class: 'bg-teal-500' },
    { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
];

export const CreateCircleModal = ({ onClose, onSave }: CreateCircleModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState('indigo');
    const [tags, setTags] = useState('');
    const [location, setLocation] = useState('');
    const [visitFrequency, setVisitFrequency] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = 'Circle name is required';
        }
        if (!description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const circleData: CircleData = {
            name,
            description,
            color: selectedColor,
            criteria: {
                tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : undefined,
                location: location || undefined,
                visitFrequency: visitFrequency || undefined
            }
        };

        onSave(circleData);
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-900 p-6 border-b border-slate-200 dark:border-white/10 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
                                <Circle className="text-indigo-600 dark:text-indigo-400" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Circle</h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                    Define a custom circle with specific criteria
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X className="text-slate-600 dark:text-slate-400" size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Users size={20} className="text-indigo-600 dark:text-indigo-400" />
                            Basic Information
                        </h3>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                Circle Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Weekend Regulars, Local Tech Workers"
                                className={`w-full px-4 py-3 bg-white dark:bg-white/5 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-white/10'
                                    }`}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle size={14} /> {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                Description *
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the purpose and criteria for this circle..."
                                rows={3}
                                className={`w-full px-4 py-3 bg-white dark:bg-white/5 border rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${errors.description ? 'border-red-500' : 'border-slate-300 dark:border-white/10'
                                    }`}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <AlertCircle size={14} /> {errors.description}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                                Circle Color *
                            </label>
                            <div className="grid grid-cols-5 gap-3">
                                {CIRCLE_COLORS.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setSelectedColor(color.value)}
                                        className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${selectedColor === color.value
                                                ? 'border-slate-900 dark:border-white shadow-lg'
                                                : 'border-slate-200 dark:border-white/10'
                                            }`}
                                    >
                                        <div className={`w-full h-8 rounded-lg ${color.class}`}></div>
                                        <p className="text-xs font-medium text-slate-900 dark:text-white mt-2 text-center">
                                            {color.name}
                                        </p>
                                        {selectedColor === color.value && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Criteria (Optional) */}
                    <div className="space-y-5 pt-6 border-t border-slate-200 dark:border-white/10">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Tag size={20} className="text-indigo-600 dark:text-indigo-400" />
                            Filtering Criteria (Optional)
                        </h3>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="e.g., Tech, Coffee Lover, Regular (comma-separated)"
                                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                                Separate multiple tags with commas
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                <MapPin size={14} className="inline mr-1" />
                                Location
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g., Within 1km, Downtown area"
                                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                Visit Frequency
                            </label>
                            <select
                                value={visitFrequency}
                                onChange={(e) => setVisitFrequency(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select frequency...</option>
                                <option value="daily">Daily visitors</option>
                                <option value="weekly">Weekly visitors</option>
                                <option value="monthly">Monthly visitors</option>
                                <option value="occasional">Occasional visitors</option>
                            </select>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
                            Preview
                        </p>
                        <div className="flex items-center gap-4">
                            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center bg-${selectedColor}-500/20 text-${selectedColor}-400 border border-${selectedColor}-500/30 shadow-lg`}>
                                <Circle size={28} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                                    {name || 'Circle Name'}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                    {description || 'Circle description will appear here'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-semibold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                        >
                            Create Circle
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
