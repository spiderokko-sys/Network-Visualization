import React, { useState } from 'react';
import {
    CalendarDays, MapPin, Users, Edit2, Trash2, X, Target, Layers, Circle, CheckCircle2, PlusCircle, Image as ImageIcon, Upload,
    Bell, Share2, Heart, MessageSquare, Send, ChevronLeft, Clock, MoreHorizontal, Search, Filter, AlertTriangle
} from 'lucide-react';
import { Button } from './ui/button';

// Mock Data (Reused from BusinessDashboard structure)
const INITIAL_CIRCLES = [
    { id: 'l1', name: 'L1: Inner Orbit', type: 'system', count: 142, color: 'emerald', desc: 'Directly connected customers.' },
    { id: 'l2', name: 'L2: Social Halo', type: 'system', count: 4820, color: 'amber', desc: 'Friends of your customers.' },
    { id: 'l3', name: 'L3: Deep Network', type: 'system', count: 25420, color: 'slate', desc: 'Anonymous reach in region.' },
    { id: 'c1', name: 'Weekend Regulars', type: 'custom', count: 45, color: 'indigo', desc: 'Visit Sat/Sun > 2 times/mo' },
    { id: 'c2', name: 'Local Tech Workers', type: 'custom', count: 850, color: 'cyan', desc: 'Tag: Tech + Geo: <1km' },
];

const EVENT_TYPES = [
    'Social Mixer',
    'Product Launch',
    'Workshop / Class',
    'Networking',
    'Exclusive Access',
    'Celebration',
    'Community Gathering'
];

const INITIAL_EVENTS = [
    {
        id: 1,
        title: 'Summer Tasting Menu Launch',
        type: 'Product Launch',
        date: '2025-06-15',
        time: '19:00',
        location: 'Main Dining Room',
        description: 'Exclusive first taste of our new seasonal menu. Join us for an evening of culinary delight as we unveil our latest creations.',
        targetCircles: ['l1', 'c1'],
        rsvpCount: 12,
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000',
        updates: [
            { id: 101, text: 'The menu has been finalized! Vegetarian options will include the truffle risotto.', date: '2h ago', author: 'Chef' }
        ],
        isInterested: true,
        hasReminder: false,
        geoScope: 'walkable',
        status: 'scheduled'
    },
    {
        id: 2,
        title: 'Tech Networking Night',
        type: 'Networking',
        date: '2025-06-20',
        time: '18:00',
        location: 'Lounge Area',
        description: 'Monthly meetup for local tech professionals. A great opportunity to connect with developers, designers, and founders in the area.',
        targetCircles: ['c2', 'l2'],
        rsvpCount: 45,
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1000',
        updates: [],
        isInterested: false,
        hasReminder: true,
        geoScope: 'city',
        status: 'scheduled'
    },
];

export const EventsScreen = () => {
    const [circles] = useState(INITIAL_CIRCLES);
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEventId, setEditingEventId] = useState<number | null>(null);
    const [newUpdateText, setNewUpdateText] = useState('');

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All Types');
    const [filterDate, setFilterDate] = useState('');
    const [filterRadius, setFilterRadius] = useState('Any Distance');
    const [filterCircle, setFilterCircle] = useState('All Circles');

    const [eventForm, setEventForm] = useState({
        title: '',
        type: 'Social Mixer',
        date: '',
        time: '',
        location: '',
        description: '',
        targetCircles: ['l1'],
        image: '',
        status: 'scheduled'
    });

    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        action: 'delete' | 'cancel' | 'reschedule' | 'update' | null;
        title: string;
        description: string;
    }>({ isOpen: false, action: null, title: '', description: '' });
    const [notifyUsers, setNotifyUsers] = useState(false);

    // Handlers
    const handleOpenCreateEvent = () => {
        setEditingEventId(null);
        setEventForm({
            title: '',
            type: 'Social Mixer',
            date: '',
            time: '',
            location: '',
            description: '',
            targetCircles: ['l1'],
            image: '',
            status: 'scheduled'
        });
        setShowEventModal(true);
    };

    const handleOpenEditEvent = (evt: any) => {
        setEditingEventId(evt.id);
        setEventForm({
            title: evt.title,
            type: evt.type || 'Social Mixer',
            date: evt.date,
            time: evt.time,
            location: evt.location,
            description: evt.description,
            targetCircles: evt.targetCircles || [],
            image: evt.image || '',
            status: evt.status || 'scheduled'
        });
        setShowEventModal(true);
    };

    const handleRequestDelete = () => {
        setConfirmState({
            isOpen: true,
            action: 'delete',
            title: 'Delete Event',
            description: 'Are you sure you want to delete this event? This action will permanently remove it from the calendar.'
        });
        setNotifyUsers(true); // Default to notify on delete
    };

    const handleRequestCancel = () => {
        setConfirmState({
            isOpen: true,
            action: 'cancel',
            title: 'Cancel Event',
            description: 'Are you sure you want to cancel this event? It will remain on the list but marked as Cancelled.'
        });
        setNotifyUsers(true);
    };

    const handleRequestSave = () => {
        if (!eventForm.title || !eventForm.date) return;

        if (!editingEventId) {
            // New Event - Direct Save
            executeAction('create');
            return;
        }

        // Edit Mode - Detect Type of Change
        const originalEvent = events.find(e => e.id === editingEventId);
        if (!originalEvent) return;

        const isReschedule = originalEvent.date !== eventForm.date || originalEvent.time !== eventForm.time;

        setConfirmState({
            isOpen: true,
            action: isReschedule ? 'reschedule' : 'update',
            title: isReschedule ? 'Reschedule Event' : 'Update Event Details',
            description: isReschedule
                ? 'You are changing the date or time of this event. Would you like to notify attendees?'
                : 'You are making changes to this event. Would you like to notify attendees?'
        });
        setNotifyUsers(isReschedule); // Default true for reschedule
    };

    const executeAction = (actionType: string) => {
        if (actionType === 'create') {
            const newEvent = {
                id: Date.now(),
                ...eventForm,
                rsvpCount: 0,
                updates: [],
                isInterested: false,
                hasReminder: false,
                status: 'scheduled'
            };
            setEvents(prev => [newEvent as any, ...prev]);
            setShowEventModal(false);
            return;
        }

        if (confirmState.action === 'delete' && editingEventId) {
            setEvents(prev => prev.filter(e => e.id !== editingEventId));
            setSelectedEventId(null); // Return to list view
            setShowEventModal(false);
            // In a real app, we would trigger a backend notification here if notifyUsers is true
        } else if (confirmState.action === 'cancel' && editingEventId) {
            setEvents(prev => prev.map(e => e.id === editingEventId ? { ...e, status: 'cancelled' } : e));
            // Trigger notification
        } else if ((confirmState.action === 'reschedule' || confirmState.action === 'update') && editingEventId) {
            setEvents(prev => prev.map(e => e.id === editingEventId ? { ...e, ...eventForm, id: editingEventId } : e));

            // If notifying, add an automatic update post
            if (notifyUsers) {
                const autoUpdateText = confirmState.action === 'reschedule'
                    ? `📅 Event Rescheduled: New time is ${eventForm.date} at ${eventForm.time}.`
                    : `📝 Event details have been updated.`;

                setEvents(prev => prev.map(e => e.id === editingEventId ? {
                    ...e,
                    updates: [{ id: Date.now(), text: autoUpdateText, date: 'Just now', author: 'System' }, ...(e.updates || [])]
                } : e));
            }
        }

        setConfirmState({ isOpen: false, action: null, title: '', description: '' });
        if (confirmState.action !== 'delete') setShowEventModal(false); // Close edit modal except if we just deleted (which handled close separately)
    };

    // Remove old handlers if necessary, specifically replaced handleSaveEvent logic above
    const toggleEventTargetCircle = (id: string) => {
        setEventForm(prev => {
            const current = prev.targetCircles;
            const updated = current.includes(id)
                ? current.filter(x => x !== id)
                : [...current, id];
            return { ...prev, targetCircles: updated };
        });
    };

    const getEventReach = (targetCircles: string[]) => {
        return circles
            .filter(c => targetCircles.includes(c.id))
            .reduce((acc, c) => acc + c.count, 0)
            .toLocaleString();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEventForm(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePostUpdate = () => {
        if (!newUpdateText.trim() || !selectedEventId) return;
        const newUpdate = {
            id: Date.now(),
            text: newUpdateText,
            date: 'Just now',
            author: 'You'
        };
        setEvents(prev => prev.map(e => e.id === selectedEventId ? { ...e, updates: [newUpdate, ...(e.updates || [])] } : e));
        setNewUpdateText('');
    };

    const toggleInterest = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setEvents(prev => prev.map(evt => evt.id === id ? { ...evt, isInterested: !evt.isInterested } : evt));
    };

    const toggleReminder = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setEvents(prev => prev.map(evt => evt.id === id ? { ...evt, hasReminder: !evt.hasReminder } : evt));
    };

    // Derived Selection
    const selectedEvent = events.find(e => e.id === selectedEventId);

    // Filtering Logic
    const filteredEvents = events.filter(evt => {
        const matchesSearch =
            evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            evt.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = filterType === 'All Types' || evt.type === filterType;
        const matchesDate = !filterDate || evt.date === filterDate;

        // Mock Radius Logic based on geoScope
        const matchesRadius = filterRadius === 'Any Distance' ||
            (filterRadius === 'Walkable (<1km)' && (evt as any).geoScope === 'walkable') ||
            (filterRadius === 'Neighborhood (<5km)' && ((evt as any).geoScope === 'walkable' || (evt as any).geoScope === 'neighborhood')) ||
            (filterRadius === 'City (<20km)' && (evt as any).geoScope); // Everything matches city

        const matchesCircle = filterCircle === 'All Circles' || (evt.targetCircles && evt.targetCircles.includes(filterCircle));

        return matchesSearch && matchesType && matchesDate && matchesRadius && matchesCircle;
    });

    return (
        <div className="p-4 md:p-6 space-y-6 pb-28 max-w-7xl mx-auto animate-in fade-in duration-500">

            {/* Header / Nav */}
            {!selectedEvent && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                        <div>
                            <h3 className="text-3xl font-bold text-white tracking-tight">Events & Gatherings</h3>
                            <p className="text-slate-400 mt-1">Manage upcoming events and target specific network segments.</p>
                        </div>
                        <Button onClick={handleOpenCreateEvent} className="glass-button-primary bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20">
                            <PlusCircle size={18} className="mr-2" /> Create Event
                        </Button>
                    </div>

                    {/* Filter Bar */}
                    <div className="glass-panel p-3 rounded-2xl flex flex-col lg:flex-row gap-3 border border-white/5 bg-white/[0.02]">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            <div className="relative min-w-[140px]">
                                <select
                                    className="w-full appearance-none bg-white/5 border border-white/5 rounded-xl py-2.5 pl-4 pr-10 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer hover:bg-white/10"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option>All Types</option>
                                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            </div>

                            <div className="relative min-w-[140px]">
                                <select
                                    className="w-full appearance-none bg-white/5 border border-white/5 rounded-xl py-2.5 pl-4 pr-10 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer hover:bg-white/10"
                                    value={filterRadius}
                                    onChange={(e) => setFilterRadius(e.target.value)}
                                >
                                    <option>Any Distance</option>
                                    <option>Walkable (&lt;1km)</option>
                                    <option>Neighborhood (&lt;5km)</option>
                                </select>
                                <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            </div>

                            <div className="relative min-w-[140px]">
                                <select
                                    className="w-full appearance-none bg-white/5 border border-white/5 rounded-xl py-2.5 pl-4 pr-10 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer hover:bg-white/10"
                                    value={filterCircle}
                                    onChange={(e) => setFilterCircle(e.target.value)}
                                >
                                    <option value="All Circles">All Circles</option>
                                    {circles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <Layers size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            </div>

                            <div className="relative min-w-[140px]">
                                <input
                                    type="date"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-4 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer hover:bg-white/10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {selectedEvent ? (
                // Details View
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <button
                        onClick={() => setSelectedEventId(null)}
                        className="mb-4 text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
                    >
                        <ChevronLeft size={20} /> Back to Events
                    </button>

                    <div className="glass-panel overflow-hidden rounded-3xl border border-white/5">
                        {/* Hero Image */}
                        <div className="h-64 md:h-80 w-full relative">
                            <img
                                src={selectedEvent.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000'}
                                alt={selectedEvent.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] to-transparent" />

                            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-end gap-4">
                                <div>
                                    <div className="flex gap-2 mb-3">
                                        <span className={`px-3 py-1 ${selectedEvent.status === 'cancelled' ? 'bg-red-500/20 text-red-500 border-red-500/50 border' : 'bg-indigo-500 text-white'} text-xs font-bold uppercase rounded-full shadow-lg shadow-indigo-500/20`}>
                                            {selectedEvent.status === 'cancelled' ? 'Cancelled' : selectedEvent.type}
                                        </span>
                                        {selectedEvent.isInterested && (
                                            <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold uppercase rounded-full shadow-lg flex items-center gap-1">
                                                <Heart size={10} fill="currentColor" /> Interested
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2 text-shadow-lg">{selectedEvent.title}</h2>
                                    <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm font-medium">
                                        <div className="flex items-center gap-1.5"><CalendarDays size={16} className="text-indigo-400" /> {new Date(selectedEvent.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                                        <div className="flex items-center gap-1.5"><Clock size={16} className="text-indigo-400" /> {selectedEvent.time}</div>
                                        <div className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-400" /> {selectedEvent.location}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center justify-between p-4 px-6 border-b border-white/5 bg-white/5 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={(e) => toggleInterest(e, selectedEvent.id)}
                                    className={`glass-button transition-all ${selectedEvent.isInterested ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'hover:text-rose-400'}`}
                                >
                                    <Heart size={18} fill={selectedEvent.isInterested ? "currentColor" : "none"} className="mr-2" />
                                    {selectedEvent.isInterested ? 'Interested' : 'Interest'}
                                </Button>
                                <Button
                                    onClick={(e) => toggleReminder(e, selectedEvent.id)}
                                    className={`glass-button transition-all ${selectedEvent.hasReminder ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'hover:text-amber-400'}`}
                                >
                                    <Bell size={18} fill={selectedEvent.hasReminder ? "currentColor" : "none"} />
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button className="glass-button hover:bg-white/10 text-slate-300">
                                    <Share2 size={18} className="mr-2" /> Invite / Promote
                                </Button>
                                <Button onClick={() => handleOpenEditEvent(selectedEvent)} className="glass-button hover:bg-white/10 text-slate-300">
                                    <Edit2 size={18} className="mr-2" /> Edit
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:divide-x divide-white/5">

                            {/* Left: Content & Updates */}
                            <div className="lg:col-span-2 p-6 md:p-8 space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        About Event
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed text-lg">
                                        {selectedEvent.description}
                                    </p>
                                </div>

                                {/* Updates Section */}
                                <div className="space-y-6 pt-6 border-t border-white/5">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <MessageSquare size={20} className="text-emerald-400" />
                                        Updates & Announcements
                                    </h3>

                                    {/* Post Update Input */}
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex gap-3 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 font-bold text-white">Yo</div>
                                        <div className="flex-1 space-y-3">
                                            <textarea
                                                value={newUpdateText}
                                                onChange={(e) => setNewUpdateText(e.target.value)}
                                                placeholder="Post an update for attendees..."
                                                className="w-full bg-transparent border-none text-white placeholder:text-slate-500 focus:outline-none resize-none min-h-[60px]"
                                            />
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={handlePostUpdate}
                                                    disabled={!newUpdateText.trim()}
                                                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                                                >
                                                    <Send size={14} /> Post Update
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Updates List */}
                                    <div className="space-y-4">
                                        {!selectedEvent.updates || selectedEvent.updates.length === 0 ? (
                                            <div className="text-center py-6 text-slate-500 text-sm">No updates posted yet.</div>
                                        ) : (
                                            selectedEvent.updates.map((update: any) => (
                                                <div key={update.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 animate-in fade-in slide-in-from-bottom-2">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-300">
                                                        <CheckCircle2 size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-white text-sm">{update.author}</span>
                                                            <span className="text-slate-500 text-xs">• {update.date}</span>
                                                        </div>
                                                        <p className="text-slate-300 text-sm leading-relaxed">{update.text}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Targeting Info */}
                            <div className="p-6 md:p-8 bg-white/[0.02]">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">audience targeting</h3>
                                <div className="space-y-3">
                                    <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-4 mb-6">
                                        <div className="p-2 bg-indigo-500/20 rounded-full text-indigo-400">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-white">{getEventReach(selectedEvent.targetCircles)}</div>
                                            <div className="text-xs text-indigo-300 font-medium uppercase tracking-wide">Total Estimated Reach</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {selectedEvent.targetCircles.map((cid: string) => {
                                            const circle = circles.find((c: any) => c.id === cid);
                                            if (!circle) return null;
                                            return (
                                                <div key={cid} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                                    <div className={`w-2 h-2 rounded-full bg-${circle.color}-500`} />
                                                    <div className="flex-1">
                                                        <div className="text-sm font-bold text-slate-200">{circle.name}</div>
                                                        <div className="text-xs text-slate-500">{circle.count.toLocaleString()} nodes</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // List View
                <div className="grid gap-4 mt-6">
                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center">
                            <div className="h-20 w-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                                <Search className="text-slate-500" size={40} />
                            </div>
                            <h3 className="text-white font-bold text-xl mb-2">No Events Found</h3>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto">Try adjusting your search criteria or clearing filters.</p>
                            <Button variant="ghost" className="mt-4 text-indigo-400 hover:text-indigo-300" onClick={() => { setSearchQuery(''); setFilterType('All Types'); setFilterDate(''); setFilterRadius('Any Distance'); setFilterCircle('All Circles'); }}>
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        filteredEvents.map(evt => (
                            <div
                                key={evt.id}
                                onClick={() => setSelectedEventId(evt.id)}
                                className="glass-panel cursor-pointer rounded-2xl flex flex-col md:flex-row group relative overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] active:scale-[0.99]"
                            >
                                {/* Cover Image & Date Badge */}
                                <div className="md:w-64 h-48 md:h-auto relative shrink-0">
                                    <img
                                        src={evt.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000'}
                                        alt={evt.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/80" />

                                    {/* Date Badge Overlay */}
                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 text-center min-w-[70px] group-hover:bg-indigo-900/80 group-hover:border-indigo-500/30 transition-colors">
                                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{new Date(evt.date).toLocaleString('default', { month: 'short' })}</div>
                                        <div className="text-xl font-bold text-white leading-none my-0.5">{new Date(evt.date).getDate()}</div>
                                        <div className="text-[10px] text-slate-400">{evt.time}</div>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0 p-6 flex flex-col justify-center">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{evt.title}</h4>
                                            <div className="flex flex-wrap gap-5 text-sm text-slate-400 mb-4">
                                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                                                    <MapPin size={14} className="text-slate-300" /> {evt.location}
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-slate-300">
                                                    <Target size={14} /> {evt.type}
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                                                    <Users size={14} /> Targeting: {getEventReach(evt.targetCircles)} Nodes
                                                </div>
                                            </div>
                                            <p className="text-slate-300 text-base leading-relaxed max-w-3xl line-clamp-2 group-hover:text-slate-200 transition-colors">{evt.description}</p>
                                        </div>
                                    </div>

                                    {/* Audience Tags */}
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {evt.targetCircles.map(cid => {
                                            const circle = circles.find(c => c.id === cid);
                                            if (!circle) return null;
                                            return (
                                                <span key={cid} className={`px-3 py-1 text-xs font-bold uppercase rounded-lg border bg-${circle.color}-900/20 text-${circle.color}-400 border-${circle.color}-500/30 flex items-center gap-2`}>
                                                    {circle.type === 'system' ? <Layers size={12} /> : <Circle size={12} />}
                                                    {circle.name}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Quick Actions Overlay (Desktop) */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 hidden md:flex gap-2">
                                    <button
                                        onClick={(e) => toggleInterest(e, evt.id)}
                                        className={`p-2 rounded-lg backdrop-blur-md border shadow-lg transition-colors ${evt.isInterested ? 'bg-rose-500 text-white border-rose-400' : 'bg-black/50 border-white/10 text-slate-300 hover:text-white hover:bg-black/70'}`}
                                        title="Interested"
                                    >
                                        <Heart size={16} fill={evt.isInterested ? "currentColor" : "none"} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleOpenEditEvent(evt); }}
                                        className="p-2 bg-black/50 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-lg backdrop-blur-md border border-white/10 shadow-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )
            }

            {/* Event Create/Edit Modal Overlay */}
            {
                showEventModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-[#0f1115] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl ring-1 ring-white/10 animate-in zoom-in-95 duration-300">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0f1115] z-10 glass-panel border-0 border-b">
                                <h3 className="text-xl font-bold text-white">{editingEventId ? 'Edit Event' : 'Create New Event'}</h3>
                                <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"><X size={20} /></button>
                            </div>

                            <div className="p-8 space-y-6">

                                {/* Image Upload */}
                                <div className="relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-white/20 hover:border-indigo-500/50 transition-colors bg-white/5 h-48 flex items-center justify-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                                        onChange={handleImageUpload}
                                    />
                                    {eventForm.image ? (
                                        <>
                                            <img src={eventForm.image} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload size={24} />
                                                    <span>Change Image</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-indigo-400 transition-colors">
                                            <div className="p-4 rounded-full bg-white/5">
                                                <ImageIcon size={32} />
                                            </div>
                                            <span className="font-medium">Click to upload cover image</span>
                                        </div>
                                    )}
                                </div>

                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Event Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-lg"
                                            placeholder="e.g. Summer Launch Party"
                                            value={eventForm.title}
                                            onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Event Type</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                                            value={eventForm.type}
                                            onChange={e => setEventForm({ ...eventForm, type: e.target.value })}
                                        >
                                            {EVENT_TYPES.map(type => (
                                                <option key={type} value={type} className="bg-slate-900 text-white">{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                            value={eventForm.date}
                                            onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time</label>
                                        <input
                                            type="time"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                            value={eventForm.time}
                                            onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                            placeholder="e.g. Main Hall"
                                            value={eventForm.location}
                                            onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors h-24 resize-none"
                                        placeholder="Describe your event..."
                                        value={eventForm.description}
                                        onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                                    />
                                </div>

                                {/* Targeting Section */}
                                <div className="space-y-3 pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold text-indigo-400 uppercase flex items-center gap-2"><Target size={16} /> Target Audience</label>
                                        <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded-lg">
                                            Est. Reach: <span className="text-white font-mono font-bold text-sm ml-1">{getEventReach(eventForm.targetCircles)}</span>
                                        </span>
                                    </div>

                                    <div className="grid gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {circles.map(c => {
                                            const isSelected = eventForm.targetCircles.includes(c.id);
                                            return (
                                                <div
                                                    key={c.id}
                                                    onClick={() => toggleEventTargetCircle(c.id)}
                                                    className={`
                                                    p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all duration-200 group
                                                    ${isSelected ? `bg-${c.color}-900/30 border-${c.color}-500/50 shadow-[0_0_10px_rgba(0,0,0,0.2)]` : 'bg-white/5 border-white/5 hover:bg-white/10'}
                                                `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${isSelected ? `text-${c.color}-400 bg-${c.color}-900/20` : `text-slate-500 bg-slate-800`}`}>
                                                            {c.type === 'system' ? <Layers size={18} /> : <Circle size={18} />}
                                                        </div>
                                                        <div>
                                                            <div className={`text-sm font-bold transition-colors ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{c.name}</div>
                                                            <div className="text-xs text-slate-500">{c.count.toLocaleString()} Nodes</div>
                                                        </div>
                                                    </div>
                                                    {isSelected && <CheckCircle2 size={20} className={`text-${c.color}-400 animate-in zoom-in spin-in-90 duration-300`} />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 flex items-center justify-between bg-[#0f1115] sticky bottom-0 z-10">
                                <div className="flex gap-2">
                                    {editingEventId && (
                                        <>
                                            <button
                                                onClick={handleRequestDelete}
                                                className="px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold transition-all flex items-center gap-2 border border-red-500/20"
                                            >
                                                <Trash2 size={18} /> Delete
                                            </button>
                                            {eventForm.status !== 'cancelled' && (
                                                <button
                                                    onClick={handleRequestCancel}
                                                    className="px-4 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold transition-all flex items-center gap-2 border border-amber-500/20"
                                                >
                                                    <AlertTriangle size={18} /> Cancel Event
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setShowEventModal(false)}>
                                        Discard
                                    </Button>
                                    <Button onClick={handleRequestSave} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 font-bold shadow-lg shadow-indigo-500/20">
                                        {editingEventId ? 'Save Changes' : 'Create Event'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Confirmation Modal */}
            {
                confirmState.isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-[#0f1115] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl ring-1 ring-white/10 p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-full ${confirmState.action === 'delete' ? 'bg-red-500/20 text-red-500' : 'bg-indigo-500/20 text-indigo-400'}`}>
                                    {confirmState.action === 'delete' ? <Trash2 size={24} /> : <AlertTriangle size={24} />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{confirmState.title}</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">{confirmState.description}</p>
                                </div>
                            </div>

                            <div className="mt-2 p-4 bg-white/5 rounded-xl border border-white/5 flex items-start gap-3 cursor-pointer" onClick={() => setNotifyUsers(!notifyUsers)}>
                                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${notifyUsers ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-500 text-transparent'}`}>
                                    <CheckCircle2 size={14} />
                                </div>
                                <div>
                                    <span className="font-bold text-slate-200 text-sm block">Notify users about changes</span>
                                    <span className="text-xs text-slate-500">Send an update notification to all RSVPs and interested users.</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <Button
                                    variant="ghost"
                                    className="text-slate-400 hover:text-white"
                                    onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={() => executeAction(confirmState.action as string)}
                                    className={`
                                    ${confirmState.action === 'delete' ? 'bg-red-600 hover:bg-red-500' : ''}
                                    ${confirmState.action === 'cancel' ? 'bg-amber-600 hover:bg-amber-500' : ''}
                                    ${(confirmState.action === 'update' || confirmState.action === 'reschedule') ? 'bg-indigo-600 hover:bg-indigo-500' : ''}
                                    text-white font-bold
                                `}
                                >
                                    Confirm {confirmState.action === 'delete' ? 'Delete' : confirmState.action === 'cancel' ? 'Cancel' : 'Update'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
