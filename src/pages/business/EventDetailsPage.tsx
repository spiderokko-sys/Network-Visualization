import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CalendarEvent } from '../../components/modals/EventModal';

// This would normally come from a context or API
// For now, we'll use localStorage to share data between pages
const getEventFromStorage = (id: string): CalendarEvent | null => {
    const eventsJson = localStorage.getItem('calendar_events');
    if (!eventsJson) return null;

    const events: CalendarEvent[] = JSON.parse(eventsJson);
    return events.find(e => e.id === id) || null;
};

export const EventDetailsPage = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<CalendarEvent | null>(null);

    useEffect(() => {
        if (eventId) {
            const foundEvent = getEventFromStorage(eventId);
            setEvent(foundEvent);
        }
    }, [eventId]);

    if (!event) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <Calendar size={64} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Event Not Found</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">The event you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/business/calendar')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all"
                    >
                        Back to Calendar
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleEdit = () => {
        // Navigate back to calendar with edit mode
        navigate(`/business/calendar?edit=${event.id}`);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            const eventsJson = localStorage.getItem('calendar_events');
            if (eventsJson) {
                const events: CalendarEvent[] = JSON.parse(eventsJson);
                const updatedEvents = events.filter(e => e.id !== event.id);
                localStorage.setItem('calendar_events', JSON.stringify(updatedEvents));
            }
            navigate('/business/calendar');
        }
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-4 md:px-6 pt-0 space-y-6 pb-28 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between animate-in fade-in">
                    <button
                        onClick={() => navigate('/business/calendar')}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Calendar</span>
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold transition-all"
                        >
                            <Edit size={18} />
                            <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-semibold transition-all"
                        >
                            <Trash2 size={18} />
                            <span className="hidden sm:inline">Delete</span>
                        </button>
                    </div>
                </div>

                {/* Event Details Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    {/* Color Bar */}
                    <div className={`h-2 ${event.color}`} />

                    {/* Content */}
                    <div className="p-8">
                        {/* Title */}
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            {event.title}
                        </h1>

                        {/* Description */}
                        {event.description && (
                            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                                {event.description}
                            </p>
                        )}

                        {/* Details Grid */}
                        <div className="space-y-6">
                            {/* Date */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <Calendar size={24} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Date</h3>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {formatDate(event.date)}
                                    </p>
                                </div>
                            </div>

                            {/* Time */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                    <Clock size={24} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Time</h3>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {event.startTime} - {event.endTime}
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            {event.location && (
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                                        <MapPin size={24} className="text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Location</h3>
                                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {event.location}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Attendees */}
                            {event.attendees && (
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                        <Users size={24} className="text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Attendees</h3>
                                        <div className="space-y-1">
                                            {event.attendees.split(',').map((attendee, index) => (
                                                <p key={index} className="text-lg font-semibold text-slate-900 dark:text-white">
                                                    {attendee.trim()}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
