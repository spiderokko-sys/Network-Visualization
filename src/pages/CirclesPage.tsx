import { useState } from 'react';
import {
    Calendar, MessageSquare, Plus, X,
    MapPin, Briefcase, Heart, Star,
    MoreVertical, UserPlus, Search, Users
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

// --- Types ---
interface Member {
    id: string | number;
    name: string;
    avatar: string;
    role?: string;
    status: 'online' | 'offline' | 'busy';
}

interface Circle {
    id: string;
    name: string;
    category: 'Occupation' | 'Interests' | 'Location' | 'Custom';
    description: string;
    members: Member[];
    color: string;
    size: 'lg' | 'md' | 'sm';
}

// --- Mock Data ---

const MOCK_MEMBERS: Member[] = [
    { id: 1, name: 'Alex', avatar: 'A', status: 'online' },
    { id: 2, name: 'Sarah', avatar: 'S', status: 'busy' },
    { id: 3, name: 'Mike', avatar: 'M', status: 'offline' },
    { id: 4, name: 'Jessica', avatar: 'J', status: 'online' },
    { id: 5, name: 'Dad', avatar: 'D', status: 'online' },
    { id: 6, name: 'Mom', avatar: 'M', status: 'offline' },
    { id: 7, name: 'Samira', avatar: 'S', status: 'online' },
    { id: 8, name: 'Mia', avatar: 'M', status: 'busy' },
    { id: 9, name: 'Kai', avatar: 'K', status: 'offline' },
    { id: 10, name: 'Leo', avatar: 'L', status: 'online' },
    { id: 11, name: 'Robert', avatar: 'R', status: 'online' },
    { id: 12, name: 'Emily', avatar: 'E', status: 'offline' },
    { id: 13, name: 'David', avatar: 'D', status: 'busy' },
];

const MOCK_CIRCLES: Circle[] = [
    {
        id: 'c1',
        name: 'Tech & AI',
        category: 'Occupation',
        description: 'Colleagues and industry peers in Artificial Intelligence.',
        members: [MOCK_MEMBERS[0], MOCK_MEMBERS[1], MOCK_MEMBERS[3], MOCK_MEMBERS[10]],
        color: 'emerald',
        size: 'lg'
    },
    {
        id: 'c2',
        name: 'Sci-Fi & Fantasy',
        category: 'Interests',
        description: 'Book club and movie nights.',
        members: [MOCK_MEMBERS[2], MOCK_MEMBERS[3], MOCK_MEMBERS[0]],
        color: 'sky',
        size: 'lg'
    },
    {
        id: 'c3',
        name: 'Local Meetups',
        category: 'Location',
        description: 'Friends from the downtown area.',
        members: [MOCK_MEMBERS[1], MOCK_MEMBERS[2], MOCK_MEMBERS[7]],
        color: 'blue',
        size: 'md'
    },
    {
        id: 'c4',
        name: 'Close Family',
        category: 'Custom',
        description: 'Immediate family members.',
        members: [MOCK_MEMBERS[4], MOCK_MEMBERS[5], MOCK_MEMBERS[8], MOCK_MEMBERS[9]],
        color: 'orange',
        size: 'lg'
    },
    {
        id: 'c5',
        name: 'NYE Cottage',
        category: 'Custom',
        description: 'Planning group for the New Years trip.',
        members: [MOCK_MEMBERS[7], MOCK_MEMBERS[6], MOCK_MEMBERS[0]],
        color: 'purple',
        size: 'md'
    },
    {
        id: 'c6',
        name: 'Crypto',
        category: 'Interests',
        description: 'Crypto investing and blockchain tech.',
        members: [MOCK_MEMBERS[0], MOCK_MEMBERS[10], MOCK_MEMBERS[12]],
        color: 'sky',
        size: 'sm'
    },
    {
        id: 'c7',
        name: 'Gym Buddies',
        category: 'Location',
        description: 'Morning workout crew.',
        members: [MOCK_MEMBERS[2], MOCK_MEMBERS[3], MOCK_MEMBERS[11]],
        color: 'blue',
        size: 'sm'
    }
];

// --- Components ---

const Avatar = ({ member, size = 'md' }: { member: Member, size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6 text-[10px]',
        md: 'w-8 h-8 text-xs',
        lg: 'w-10 h-10 text-sm',
        xl: 'w-16 h-16 text-xl'
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 flex items-center justify-center text-slate-900 dark:text-white font-bold relative group/avatar cursor-pointer hover:scale-110 transition-transform shadow-sm relative z-10`}>
            {member.avatar}
            <span className={`absolute bottom-0 right-0 rounded-full border border-white dark:border-slate-900 ${member.status === 'online' ? 'bg-emerald-500' : member.status === 'busy' ? 'bg-rose-500' : 'bg-slate-500'} ${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5'}`}></span>

            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/avatar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 z-20 shadow-lg">
                {member.name}
            </div>
        </div>
    );
};

const DetailsPanel = ({ circle, onClose, onJoinChannel }: { circle: Circle, onClose: () => void, onJoinChannel: () => void }) => {
    if (!circle) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-slate-50 dark:bg-slate-900 shadow-2xl animate-slide-left z-50 overflow-hidden flex flex-col border-l border-slate-200 dark:border-white/10">
            {/* Header */}
            <div className={`h-48 relative shrink-0 overflow-hidden ${circle.color === 'emerald' ? 'bg-emerald-600' :
                circle.color === 'orange' ? 'bg-orange-600' :
                    circle.color === 'purple' ? 'bg-purple-600' :
                        'bg-indigo-600'
                }`}>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 120%, white 0%, transparent 60%)' }}></div>

                <div className="absolute top-4 right-4 z-10">
                    <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors backdrop-blur-sm"><X size={20} /></button>
                </div>

                <div className="absolute bottom-6 left-6 z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                            {circle.category === 'Location' ? <MapPin size={10} /> :
                                circle.category === 'Occupation' ? <Briefcase size={10} /> :
                                    circle.category === 'Interests' ? <Heart size={10} /> : <Star size={10} />}
                            {circle.category}
                        </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white drop-shadow-md">{circle.name}</h2>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 overflow-y-auto space-y-8 bg-white dark:bg-slate-950">
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Description</h3>
                    <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">{circle.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button onClick={onJoinChannel} className="w-full" size="lg">
                        <MessageSquare size={18} className="mr-2" /> Chat
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                        <Calendar size={18} className="mr-2" /> Plan Event
                    </Button>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Members ({circle.members.length})</h3>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full"><UserPlus size={16} /></Button>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        {circle.members.map(m => (
                            <div key={m.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer group/member border border-transparent hover:border-slate-200 dark:hover:border-white/5">
                                <Avatar member={m} size="md" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">{m.name}</span>
                                    <span className="text-xs text-slate-500">{m.status}</span>
                                </div>
                                <div className="ml-auto opacity-0 group-hover/member:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full"><MessageSquare size={14} /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const NetworkCircles = () => {
    const navigate = useNavigate();
    const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const categories = ['Custom', 'Occupation', 'Interests', 'Location'];

    const toggleFilter = (cat: string) => {
        if (activeFilters.includes(cat)) {
            setActiveFilters(prev => prev.filter(c => c !== cat));
        } else {
            setActiveFilters(prev => [...prev, cat]);
        }
    };

    const isFiltered = (circle: Circle) => {
        if (activeFilters.length > 0 && !activeFilters.includes(circle.category)) return false;
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            return circle.name.toLowerCase().includes(lower) ||
                circle.members.some(m => m.name.toLowerCase().includes(lower));
        }
        return true;
    };

    const filteredCircles = MOCK_CIRCLES.filter(isFiltered);

    const getGradient = (color: string) => {
        switch (color) {
            case 'emerald': return 'from-emerald-500/20 to-teal-600/5 hover:to-emerald-500/10';
            case 'sky': return 'from-sky-500/20 to-blue-600/5 hover:to-sky-500/10';
            case 'blue': return 'from-blue-600/20 to-indigo-600/5 hover:to-blue-600/10';
            case 'orange': return 'from-orange-500/20 to-amber-600/5 hover:to-orange-500/10';
            case 'purple': return 'from-purple-500/20 to-fuchsia-600/5 hover:to-purple-500/10';
            default: return 'from-slate-500/20 to-slate-600/5';
        }
    };

    const getIcon = (category: string) => {
        switch (category) {
            case 'Location': return <MapPin size={14} />;
            case 'Occupation': return <Briefcase size={14} />;
            case 'Interests': return <Heart size={14} />;
            default: return <Star size={14} />;
        }
    };

    return (
        <div className="h-full w-full relative bg-slate-50 dark:bg-[#0B0C15] overflow-y-auto font-sans text-slate-900 dark:text-slate-200 flex flex-col">
            <style>{`
                @keyframes slide-left {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-left {
                    animation: slide-left 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>

            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0B0C15]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-8 py-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">My Circles</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Manage and connect with your groups</p>
                    </div>
                    <Button onClick={() => console.log('Create new')} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
                        <Plus size={18} className="mr-2" /> Create Circle
                    </Button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto no-scrollbar">
                        <button
                            onClick={() => setActiveFilters([])}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${activeFilters.length === 0
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent'
                                : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
                                }`}
                        >
                            All ({MOCK_CIRCLES.length})
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => toggleFilter(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border flex items-center gap-1 ${activeFilters.includes(cat)
                                    ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30'
                                    : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
                                    }`}
                            >
                                {activeFilters.includes(cat) && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400"></span>}
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Find a circle..."
                            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-900 dark:text-white placeholder:text-slate-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 p-8 overflow-y-auto">
                {filteredCircles.length > 0 ? (
                    <div className="space-y-10 pb-20">
                        {/* Inner Circle Section */}
                        {filteredCircles.filter(c => c.name.includes('Close') || c.category === 'Custom').length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-wider">Inner Circle</h2>
                                    <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/20 to-transparent"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredCircles.filter(c => c.name.includes('Close') || c.category === 'Custom').map(circle => (
                                        <Card
                                            key={circle.id}
                                            className="group cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl border-transparent hover:border-indigo-500/20 dark:hover:border-indigo-500/30 overflow-hidden relative"
                                            onClick={() => setSelectedCircle(circle)}
                                        >
                                            {/* Gradient Header */}
                                            <div className={`h-24 bg-gradient-to-br ${getGradient(circle.color)} absolute top-0 left-0 right-0`} />

                                            <CardHeader className="relative pt-6 pb-2">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-white/5 ${circle.color === 'emerald' ? 'text-emerald-500' :
                                                            circle.color === 'sky' ? 'text-sky-500' :
                                                                circle.color === 'blue' ? 'text-blue-500' :
                                                                    circle.color === 'orange' ? 'text-orange-500' :
                                                                        'text-purple-500'
                                                        } w-fit`}>
                                                        {getIcon(circle.category)}
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </div>
                                                <CardTitle className="text-xl font-bold">{circle.name}</CardTitle>
                                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">{circle.category}</p>
                                            </CardHeader>

                                            <CardContent className="pt-2">
                                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 h-10 mb-6 leading-relaxed">
                                                    {circle.description}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex -space-x-2 overflow-hidden pl-1 py-1">
                                                        {circle.members.slice(0, 4).map(m => (
                                                            <Avatar key={m.id} member={m} size="sm" />
                                                        ))}
                                                        {circle.members.length > 4 && (
                                                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500 dark:text-slate-400 z-10 relative">
                                                                +{circle.members.length - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                                                        <Users size={12} />
                                                        {circle.members.length}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Other Circles Section */}
                        {filteredCircles.filter(c => !c.name.includes('Close') && c.category !== 'Custom').length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">My Network</h2>
                                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/5"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredCircles.filter(c => !c.name.includes('Close') && c.category !== 'Custom').map(circle => (
                                        <Card
                                            key={circle.id}
                                            className="group cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-xl border-transparent hover:border-slate-200 dark:hover:border-white/10 overflow-hidden relative opacity-90 hover:opacity-100"
                                            onClick={() => setSelectedCircle(circle)}
                                        >
                                            {/* Gradient Header */}
                                            <div className={`h-24 bg-gradient-to-br ${getGradient(circle.color)} absolute top-0 left-0 right-0`} />

                                            <CardHeader className="relative pt-6 pb-2">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-white/5 ${circle.color === 'emerald' ? 'text-emerald-500' :
                                                            circle.color === 'sky' ? 'text-sky-500' :
                                                                circle.color === 'blue' ? 'text-blue-500' :
                                                                    circle.color === 'orange' ? 'text-orange-500' :
                                                                        'text-purple-500'
                                                        } w-fit`}>
                                                        {getIcon(circle.category)}
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </div>
                                                <CardTitle className="text-xl font-bold">{circle.name}</CardTitle>
                                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">{circle.category}</p>
                                            </CardHeader>

                                            <CardContent className="pt-2">
                                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 h-10 mb-6 leading-relaxed">
                                                    {circle.description}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex -space-x-2 overflow-hidden pl-1 py-1">
                                                        {circle.members.slice(0, 4).map(m => (
                                                            <Avatar key={m.id} member={m} size="sm" />
                                                        ))}
                                                        {circle.members.length > 4 && (
                                                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500 dark:text-slate-400 z-10 relative">
                                                                +{circle.members.length - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                                                        <Users size={12} />
                                                        {circle.members.length}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                        <Search size={48} className="mb-4" />
                        <p>No circles found matching your criteria</p>
                    </div>
                )}
            </div>

            {/* Details Panel Overlay (Modal-ish) */}
            {selectedCircle && (
                <>
                    <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedCircle(null)} />
                    <DetailsPanel
                        circle={selectedCircle}
                        onClose={() => setSelectedCircle(null)}
                        onJoinChannel={() => navigate(`/channels?id=${selectedCircle.id}`)}
                    />
                </>
            )}
        </div>
    );
};
