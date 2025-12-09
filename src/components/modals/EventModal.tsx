import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, MapPin, Users, FileText } from 'lucide-react';

export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    date: Date;
    startTime: string;
    endTime: string;
    location: string;
    attendees: string;
    color: string;
    type?: string;
    priority?: string;
    category?: string;
}

interface EventModalProps {
    onClose: () => void;
    onSave: (data: CalendarEvent) => void;
    onDelete?: (id: string) => void;
    initialData?: CalendarEvent | null;
}

const EVENT_COLORS = [
    { name: 'Blue', value: 'bg-blue-500' },
    { name: 'Green', value: 'bg-emerald-500' },
    { name: 'Purple', value: 'bg-purple-500' },
    { name: 'Orange', value: 'bg-orange-500' },
    { name: 'Pink', value: 'bg-pink-500' },
    { name: 'Red', value: 'bg-red-500' },
];

export const EventModal: React.FC<EventModalProps> = ({ onClose, onSave, onDelete, initialData = null }) => {
    const [form, setForm] = useState<Omit<CalendarEvent, 'id'>>({
        title: '',
        description: '',
        date: new Date(),
        startTime: '09:00',
        endTime: '10:00',
        location: '',
        attendees: '',
        color: 'bg-blue-500',
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                title: initialData.title,
                description: initialData.description,
                date: initialData.date,
                startTime: initialData.startTime,
                endTime: initialData.endTime,
                location: initialData.location,
                attendees: initialData.attendees,
                color: initialData.color,
            });
        }
    }, [initialData]);

    const handleSubmit = () => {
        if (!form.title.trim()) {
            alert('Please enter an event title');
            return;
        }

        const eventData: CalendarEvent = {
            id: initialData?.id || crypto.randomUUID(),
            ...form,
        };
        onSave(eventData);
    };

    const handleDelete = () => {
        if (initialData && onDelete) {
            if (confirm('Are you sure you want to delete this event?')) {
                onDelete(initialData.id);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {initialData ? 'Edit Event' : 'Create Event'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-2 block">
                            Event Title *
                        </label>
                        <input
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            placeholder="Team Meeting"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-2 flex items-center gap-2">
                            <FileText size={14} />
                            Description
                        </label>
                        <textarea
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all min-h-[100px] resize-y"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            placeholder="Add event details..."
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-2 flex items-center gap-2">
                            <CalendarIcon size={14} />
                            Date
                        </label>
                        <input
                            type="date"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                            value={form.date.toISOString().split('T')[0]}
                            onChange={e => setForm({ ...form, date: new Date(e.target.value) })}
                        />
                    </div>

                    {/* Time Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-2 flex items-center gap-2">
                                <Clock size={14} />
                                Start Time
                            </label>
                            <input
                                type="time"
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                                value={form.startTime}
                                onChange={e => setForm({ ...form, startTime: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-2 flex items-center gap-2">
                                <Clock size={14} />
                                End Time
                            </label>
                            <input
                                type="time"
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                                value={form.endTime}
                                onChange={e => setForm({ ...form, endTime: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-2 flex items-center gap-2">
                            <MapPin size={14} />
                            Location
                        </label>
                        <input
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                            value={form.location}
                            onChange={e => setForm({ ...form, location: e.target.value })}
                            placeholder="Conference Room A"
                        />
                    </div>

                    {/* Attendees */}
                    <div>
                        <label className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-2 flex items-center gap-2">
                            <Users size={14} />
                            Attendees
                        </label>
                        <input
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                            value={form.attendees}
                            onChange={e => setForm({ ...form, attendees: e.target.value })}
                            placeholder="john@example.com, jane@example.com"
                        />
                    </div>

                    {/* Color Picker */}
                    <div>
                        <label className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold mb-2 block">
                            Event Color
                        </label>
                        <div className="flex gap-3">
                            {EVENT_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setForm({ ...form, color: color.value })}
                                    className={`w-10 h-10 rounded-full ${color.value} transition-all ${form.color === color.value
                                        ? 'ring-4 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-slate-300 dark:ring-slate-600 scale-110'
                                        : 'hover:scale-105'
                                        }`}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-6 flex gap-3">
                    {initialData && onDelete && (
                        <button
                            onClick={handleDelete}
                            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold shadow-lg transition-all hover:shadow-xl"
                        >
                            Delete Event
                        </button>
                    )}
                    <div className="flex-1" />
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-bold transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg transition-all hover:shadow-xl"
                    >
                        {initialData ? 'Save Changes' : 'Create Event'}
                    </button>
                </div>
            </div>
        </div>
    );
};
