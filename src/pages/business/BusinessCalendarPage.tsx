import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CalendarDays, Plus, ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react';
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
            type: 'Meeting',
            priority: 'Medium',
            category: 'Team',
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
            type: 'Presentation',
            priority: 'High',
            category: 'Client',
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
            type: 'Review',
            priority: 'Medium',
            category: 'Product',
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
            type: 'Social',
            priority: 'Low',
            category: 'Marketing',
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
            type: 'Planning',
            priority: 'High',
            category: 'Development',
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
            type: 'Meeting',
            priority: 'Critical',
            category: 'Executive',
        },
    ];
    return events;
};

// Load events from localStorage or use sample data
const loadEvents = (): CalendarEvent[] => {
    const stored = localStorage.getItem('calendar_events');
    if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((e: any) => ({
            ...e,
            date: new Date(e.date)
        }));
    }
    return generateSampleEvents();
};

// Save events to localStorage
const saveEvents = (events: CalendarEvent[]) => {
    localStorage.setItem('calendar_events', JSON.stringify(events));
};

export const BusinessCalendarPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [events, setEvents] = useState<CalendarEvent[]>(loadEvents());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

    // Check if we need to open edit modal from URL params
    useEffect(() => {
        const editId = searchParams.get('edit');
        if (editId) {
            const eventToEdit = events.find(e => e.id === editId);
            if (eventToEdit) {
                setEditingEvent(eventToEdit);
                setShowEventModal(true);
            }
            // Clear the URL param
            setSearchParams({});
        }
    }, [searchParams, events, setSearchParams]);

    // Save events to localStorage whenever they change
    useEffect(() => {
        saveEvents(events);
    }, [events]);

    // Get events for selected date
    const eventsForSelectedDate = useMemo(() => {
        return events.filter(event =>
            event.date.toDateString() === selectedDate.toDateString()
        ).sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [events, selectedDate]);

    // Get all upcoming events sorted by date
    const upcomingEvents = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
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

    const handleEventClick = (event: CalendarEvent) => {
        navigate(`/business/calendar/${event.id}`);
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

    // Helper function to get priority badge styling
    const getPriorityBadge = (priority?: string) => {
        if (!priority) return null;

        const styles = {
            'Critical': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
            'High': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
            'Medium': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
            'Low': 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
        };

        return styles[priority as keyof typeof styles] || styles['Medium'];
    };

    // Helper function to get type badge styling
    const getTypeBadge = (type?: string) => {
        if (!type) return null;

        const styles = {
            'Meeting': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
            'Presentation': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
            'Review': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
            'Social': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
            'Planning': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
        };

        return styles[type as keyof typeof styles] || 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    };

    // Helper function to get category badge styling
    const getCategoryBadge = (category?: string) => {
        if (!category) return null;

        return 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800';
    };

    // Helper function to determine event status
    const getEventStatus = (event: CalendarEvent) => {
        const now = new Date();
        const eventDate = new Date(event.date);
        const eventStart = new Date(eventDate);
        const [startHour, startMin] = event.startTime.split(':').map(Number);
        eventStart.setHours(startHour, startMin, 0, 0);

        const eventEnd = new Date(eventDate);
        const [endHour, endMin] = event.endTime.split(':').map(Number);
        eventEnd.setHours(endHour, endMin, 0, 0);

        if (now >= eventStart && now <= eventEnd) {
            return { label: 'In Progress', style: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' };
        } else if (eventDate.toDateString() === now.toDateString()) {
            return { label: 'Today', style: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
        } else if (eventDate > now) {
            const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntil === 1) {
                return { label: 'Tomorrow', style: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
            }
            return { label: 'Upcoming', style: 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' };
        }
        return null;
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-2 md:px-6 pt-0 space-y-2 md:space-y-6 pb-28 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Calendar</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your appointments and events</p>
                    </div>
                    <button
                        onClick={handleCreateEvent}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-lg transition-all hover:shadow-xl"
                    >
                        <Plus size={20} />
                        <span>New Event</span>
                    </button>
                </div>

                {/* Upcoming Events Section */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Events</h2>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {upcomingEvents.length > 0 ? (
                            upcomingEvents.map((event) => {
                                const status = getEventStatus(event);
                                const attendeeCount = event.attendees ? event.attendees.split(',').length : 0;

                                return (
                                    <div
                                        key={event.id}
                                        onClick={() => handleEventClick(event)}
                                        className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-2 h-full ${event.color} rounded-full flex-shrink-0`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                                                            {event.title}
                                                        </h3>
                                                        {/* Pills and Badges Row */}
                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                            {/* Status Badge */}
                                                            {status && (
                                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${status.style}`}>
                                                                    {status.label}
                                                                </span>
                                                            )}

                                                            {/* Priority Badge */}
                                                            {event.priority && (
                                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityBadge(event.priority)}`}>
                                                                    {event.priority}
                                                                </span>
                                                            )}

                                                            {/* Type Badge */}
                                                            {event.type && (
                                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getTypeBadge(event.type)}`}>
                                                                    {event.type}
                                                                </span>
                                                            )}

                                                            {/* Category Badge */}
                                                            {event.category && (
                                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryBadge(event.category)}`}>
                                                                    {event.category}
                                                                </span>
                                                            )}

                                                            {/* Attendee Count Badge */}
                                                            {attendeeCount > 0 && (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800">
                                                                    <Users size={12} />
                                                                    {attendeeCount}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
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
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-16">
                                <CalendarDays size={64} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                                <p className="text-slate-500 dark:text-slate-400">No upcoming events</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Calendar Section */}
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
                                    {eventsForSelectedDate.map((event) => {
                                        const status = getEventStatus(event);
                                        const attendeeCount = event.attendees ? event.attendees.split(',').length : 0;

                                        return (
                                            <div
                                                key={event.id}
                                                onClick={() => handleEventClick(event)}
                                                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer transition-all hover:shadow-md group"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-1 h-full ${event.color} rounded-full flex-shrink-0`} />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                            {event.title}
                                                        </h4>

                                                        {/* Pills and Badges */}
                                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                                            {status && (
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${status.style}`}>
                                                                    {status.label}
                                                                </span>
                                                            )}

                                                            {event.priority && (
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityBadge(event.priority)}`}>
                                                                    {event.priority}
                                                                </span>
                                                            )}

                                                            {event.type && (
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getTypeBadge(event.type)}`}>
                                                                    {event.type}
                                                                </span>
                                                            )}

                                                            {attendeeCount > 0 && (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800">
                                                                    <Users size={10} />
                                                                    {attendeeCount}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-1">
                                                            <Clock size={14} />
                                                            <span>{event.startTime} - {event.endTime}</span>
                                                        </div>
                                                        {event.location && (
                                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                                <MapPin size={14} />
                                                                <span className="truncate">{event.location}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
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
