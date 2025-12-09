import { useState, useMemo } from 'react';
import { CalendarDays, Plus, ChevronLeft, ChevronRight, Clock, MapPin, Users, List, Grid } from 'lucide-react';
import { Calendar } from '../../components/ui/calendar';
import { EventModal, CalendarEvent } from '../../components/modals/EventModal';

// Sample events data
const generateSampleEvents = (): CalendarEvent[] => {
    const today = new Date();
    const events: CalendarEvent[] = [
        {
            id: '1',
            title: 'Team Standup',
            description: 'Daily team sync-up meeting',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            startTime: '09:00',
            endTime: '09:30',
            location: 'Conference Room A',
            attendees: 'team@example.com',
            color: 'bg-blue-500',
        },
        {
            id: '2',
            title: 'Client Presentation',
            description: 'Q4 results presentation for key stakeholders',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
            startTime: '14:00',
            endTime: '15:30',
            location: 'Virtual - Zoom',
            attendees: 'client@example.com, sales@example.com',
            color: 'bg-purple-500',
        },
        {
            id: '3',
            title: 'Product Review',
            description: 'Review new feature implementations',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
            startTime: '10:00',
            endTime: '11:00',
            location: 'Building B - Room 301',
            attendees: 'product@example.com, dev@example.com',
            color: 'bg-emerald-500',
        },
        {
            id: '4',
            title: 'Lunch with Marketing',
            description: 'Discuss upcoming campaign strategies',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
            startTime: '12:00',
            endTime: '13:00',
            location: 'Downtown Cafe',
            attendees: 'marketing@example.com',
            color: 'bg-orange-500',
        },
        {
            id: '5',
            title: 'Sprint Planning',
            description: 'Plan next sprint objectives and tasks',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
            startTime: '13:00',
            endTime: '15:00',
            location: 'Conference Room B',
            attendees: 'dev@example.com, pm@example.com',
            color: 'bg-pink-500',
        },
        {
            id: '6',
            title: 'Board Meeting',
            description: 'Monthly board meeting - financial review',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14),
            startTime: '16:00',
            endTime: '18:00',
            location: 'Executive Boardroom',
            attendees: 'board@example.com',
            color: 'bg-red-500',
        },
    ];
    return events;
};

type ViewMode = 'month' | 'list';

export const BusinessCalendarPage = () => {
    const [events, setEvents] = useState<CalendarEvent[]>(generateSampleEvents());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

    // Get events for selected date
    const eventsForSelectedDate = useMemo(() => {
        return events.filter(event =>
            event.date.toDateString() === selectedDate.toDateString()
        ).sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [events, selectedDate]);

    // Get all upcoming events sorted by date
    const upcomingEvents = useMemo(() => {
        const now = new Date();
        return events
            .filter(event => event.date >= now)
            .sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [events]);

    // Get dates that have events
    const datesWithEvents = useMemo(() => {
        return events.map(event => event.date);
    }, [events]);

    const handleSaveEvent = (eventData: CalendarEvent) => {
        if (editingEvent) {
            // Update existing event
            setEvents(events.map(e => e.id === eventData.id ? eventData : e));
        } else {
            // Add new event
            setEvents([...events, eventData]);
        }
        setShowEventModal(false);
        setEditingEvent(null);
    };

    const handleDeleteEvent = (id: string) => {
        setEvents(events.filter(e => e.id !== id));
        setShowEventModal(false);
        setEditingEvent(null);
    };

    const handleEditEvent = (event: CalendarEvent) => {
        setEditingEvent(event);
        setShowEventModal(true);
    };

    const handleCreateEvent = () => {
        setEditingEvent(null);
        setShowEventModal(true);
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(selectedDate);
        if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setSelectedDate(newDate);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatEventDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-4 md:px-6 pt-0 space-y-4 md:space-y-6 pb-28 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Calendar</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your appointments and events</p>
                    </div>
                    <div className="flex gap-2">
                        {/* View Toggle */}
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('month')}
                                className={`px-3 py-2 rounded-md transition-all ${viewMode === 'month'
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-2 rounded-md transition-all ${viewMode === 'list'
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <List size={18} />
                            </button>
                        </div>

                        {/* Create Event Button */}
                        <button
                            onClick={handleCreateEvent}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-lg transition-all hover:shadow-xl"
                        >
                            <Plus size={20} />
                            <span className="hidden sm:inline">New Event</span>
                        </button>
                    </div>
                </div>

                {viewMode === 'month' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Calendar View */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6">
                                {/* Month Navigation */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigateMonth('prev')}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
                                        </button>
                                        <button
                                            onClick={() => setSelectedDate(new Date())}
                                            className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium text-slate-600 dark:text-slate-400"
                                        >
                                            Today
                                        </button>
                                        <button
                                            onClick={() => navigateMonth('next')}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            <ChevronRight size={20} className="text-slate-600 dark:text-slate-400" />
                                        </button>
                                    </div>
                                </div>

                                {/* Calendar Component */}
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => date && setSelectedDate(date)}
                                    month={selectedDate}
                                    onMonthChange={setSelectedDate}
                                    className="rounded-lg"
                                    modifiers={{
                                        hasEvent: datesWithEvents,
                                    }}
                                    modifiersClassNames={{
                                        hasEvent: 'font-bold relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-blue-500 after:rounded-full',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Events for Selected Date */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                    {formatDate(selectedDate)}
                                </h3>

                                {eventsForSelectedDate.length > 0 ? (
                                    <div className="space-y-3">
                                        {eventsForSelectedDate.map((event) => (
                                            <div
                                                key={event.id}
                                                onClick={() => handleEditEvent(event)}
                                                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer transition-all hover:shadow-md group"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-1 h-full ${event.color} rounded-full`} />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                            {event.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                            <Clock size={14} />
                                                            <span>{event.startTime} - {event.endTime}</span>
                                                        </div>
                                                        {event.location && (
                                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                                <MapPin size={14} />
                                                                <span className="truncate">{event.location}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CalendarDays size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">No events scheduled</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* List View */
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Events</h2>
                        </div>
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={() => handleEditEvent(event)}
                                        className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-2 h-full ${event.color} rounded-full`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {event.title}
                                                    </h3>
                                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                        {formatEventDate(event.date)}
                                                    </span>
                                                </div>
                                                {event.description && (
                                                    <p className="text-slate-600 dark:text-slate-300 mb-3">{event.description}</p>
                                                )}
                                                <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} />
                                                        <span>{event.startTime} - {event.endTime}</span>
                                                    </div>
                                                    {event.location && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin size={16} />
                                                            <span>{event.location}</span>
                                                        </div>
                                                    )}
                                                    {event.attendees && (
                                                        <div className="flex items-center gap-2">
                                                            <Users size={16} />
                                                            <span>{event.attendees.split(',').length} attendees</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16">
                                    <CalendarDays size={64} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                                    <p className="text-slate-500 dark:text-slate-400">No upcoming events</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Event Modal */}
            {showEventModal && (
                <EventModal
                    onClose={() => {
                        setShowEventModal(false);
                        setEditingEvent(null);
                    }}
                    onSave={handleSaveEvent}
                    onDelete={handleDeleteEvent}
                    initialData={editingEvent}
                />
            )}
        </div>
    );
};
