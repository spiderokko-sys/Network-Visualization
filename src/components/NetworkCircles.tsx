import React, { useState } from 'react';
import {
    Users, Calendar, MessageSquare, Plus, X, ChevronLeft,
    Share2, MapPin, Briefcase, Zap, Heart, Star,
    MoreVertical, UserPlus
} from 'lucide-react';
import { Button } from './ui/button';

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
    color: string; // Tailwind class component for color theme
    position: { top: string; left: string }; // simple absolute positioning %
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
];

const MOCK_CIRCLES: Circle[] = [
    {
        id: 'c1',
        name: 'Tech & AI',
        category: 'Occupation',
        description: 'Colleagues and industry peers in Artificial Intelligence.',
        members: [MOCK_MEMBERS[0], MOCK_MEMBERS[1], MOCK_MEMBERS[3]],
        color: 'emerald',
        position: { top: '15%', left: '60%' },
        size: 'lg'
    },
    {
        id: 'c2',
        name: 'Sci-Fi & Fantasy',
        category: 'Interests',
        description: 'Book club and movie nights.',
        members: [MOCK_MEMBERS[2], MOCK_MEMBERS[3], MOCK_MEMBERS[0]],
        color: 'sky',
        position: { top: '20%', left: '25%' },
        size: 'lg'
    },
    {
        id: 'c3',
        name: 'Local Meetups',
        category: 'Location',
        description: 'Friends from the downtown area.',
        members: [MOCK_MEMBERS[1], MOCK_MEMBERS[2], MOCK_MEMBERS[7]],
        color: 'blue',
        position: { top: '55%', left: '75%' },
        size: 'md'
    },
    {
        id: 'c4',
        name: 'Close Family',
        category: 'Custom',
        description: 'Immediate family members.',
        members: [MOCK_MEMBERS[4], MOCK_MEMBERS[5], MOCK_MEMBERS[8], MOCK_MEMBERS[9]],
        color: 'orange',
        position: { top: '65%', left: '40%' },
        size: 'lg'
    },
    {
        id: 'c5',
        name: 'NYE Cottage',
        category: 'Custom',
        description: 'Planning group for the New Years trip.',
        members: [MOCK_MEMBERS[7], MOCK_MEMBERS[6], MOCK_MEMBERS[0]],
        color: 'purple',
        position: { top: '70%', left: '15%' },
        size: 'md'
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
        <div className={`${sizeClasses[size]} rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-white font-bold relative group cursor-pointer hover:scale-110 transition-transform shadow-lg`}>
            {member.avatar}
            <span className={`absolute bottom-0 right-0 rounded-full border border-slate-900 ${member.status === 'online' ? 'bg-emerald-500' : member.status === 'busy' ? 'bg-rose-500' : 'bg-slate-500'} ${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5'}`}></span>

            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 z-20">
                {member.name}
            </div>
        </div>
    );
};

const CircleNode = ({ circle, onClick }: { circle: Circle, onClick: () => void }) => {
    const colorStyles: Record<string, string> = {
        emerald: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-200',
        sky: 'from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-200',
        blue: 'from-blue-600/20 to-indigo-600/20 border-blue-500/30 text-blue-200',
        orange: 'from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-200',
        purple: 'from-purple-500/20 to-fuchsia-500/20 border-purple-500/30 text-purple-200',
    };

    const sizeClasses = {
        sm: 'w-32 h-32',
        md: 'w-48 h-48',
        lg: 'w-64 h-64'
    };

    // Calculate generic positions for members in a circle
    const getMemberPos = (index: number, total: number) => {
        const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
        const radius = circle.size === 'lg' ? 45 : circle.size === 'md' ? 35 : 25; // % from center
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        return { left: `${x}%`, top: `${y}%` };
    };

    return (
        <div
            className={`absolute flex flex-col items-center justify-center cursor-pointer group transition-all duration-500 hover:scale-105`}
            style={{ top: circle.position.top, left: circle.position.left, transform: 'translate(-50%, -50%)' }}
            onClick={onClick}
        >
            {/* Label */}
            <div className={`absolute -top-10 text-center w-60 opacity-80 group-hover:opacity-100 transition-opacity`}>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">{circle.category}</div>
                <div className="text-lg font-bold text-white leading-tight drop-shadow-md">{circle.name}</div>
            </div>

            {/* The Circle */}
            <div className={`
                ${sizeClasses[circle.size]} rounded-full bg-gradient-to-br ${colorStyles[circle.color] || colorStyles.blue}
                backdrop-blur-sm border shadow-[0_0_30px_rgba(0,0,0,0.2)] relative
                group-hover:shadow-[0_0_50px_rgba(99,102,241,0.3)] transition-all ease-out duration-500
            `}>
                {/* Connecting lines drawn visually via SVG in parent, but we simulate structure here */}

                {/* Members */}
                {circle.members.map((m, i) => (
                    <div
                        key={m.id}
                        className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
                        style={getMemberPos(i, circle.members.length)}
                    >
                        <Avatar member={m} size={circle.size === 'lg' ? 'md' : 'sm'} />
                    </div>
                ))}

                {/* Inner decorative core */}
                <div className="absolute inset-0 m-auto w-1/3 h-1/3 rounded-full border border-white/5 bg-white/5 flex items-center justify-center">
                    <span className="text-xs font-bold opacity-50">{circle.members.length}</span>
                </div>
            </div>

            {/* Connection Line to Center (Visual Only - simulated with absolute div if needed, or SVG in parent) */}
        </div>
    );
};

const DetailsPanel = ({ circle, onClose, onJoinChannel }: { circle: Circle, onClose: () => void, onJoinChannel: () => void }) => {
    if (!circle) return null;

    return (
        <div className="absolute top-4 right-4 bottom-4 w-96 glass-panel rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col z-30">
            {/* Header */}
            <div className={`h-32 bg-gradient-to-br relative shrink-0 overflow-hidden ${circle.color === 'emerald' ? 'from-emerald-900 to-slate-900' :
                    circle.color === 'orange' ? 'from-orange-900 to-slate-900' :
                        circle.color === 'purple' ? 'from-purple-900 to-slate-900' :
                            'from-indigo-900 to-slate-900'
                }`}>
                <div className="absolute top-4 right-4">
                    <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"><X size={18} /></button>
                </div>
                <div className="absolute bottom-4 left-6">
                    <div className="text-xs font-bold text-white/60 mb-1 flex items-center gap-1">
                        {circle.category === 'Location' ? <MapPin size={12} /> :
                            circle.category === 'Occupation' ? <Briefcase size={12} /> :
                                circle.category === 'Interests' ? <Heart size={12} /> : <Star size={12} />}
                        {circle.category}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{circle.name}</h2>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-6">
                <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{circle.description}</p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <Button onClick={onJoinChannel} className="glass-button-primary bg-indigo-600 hover:bg-indigo-500 w-full">
                        <MessageSquare size={16} className="mr-2" /> Open Channel
                    </Button>
                    <Button className="glass-button w-full">
                        <Calendar size={16} className="mr-2" /> Schedule
                    </Button>
                    <Button className="glass-button w-full">
                        <UserPlus size={16} className="mr-2" /> Invite
                    </Button>
                    <Button className="glass-button w-full">
                        <Zap size={16} className="mr-2" /> Add Intent
                    </Button>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Members ({circle.members.length})</h3>
                        <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:bg-white/10"><MoreVertical size={14} /></Button>
                    </div>

                    <div className="space-y-2">
                        {circle.members.map(m => (
                            <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                <Avatar member={m} size="sm" />
                                <span className="text-sm font-medium text-slate-200 flex-1">{m.name}</span>
                                <button className="text-slate-500 hover:text-white transition-colors"><MessageSquare size={14} /></button>
                            </div>
                        ))}
                        <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors w-full group border border-dashed border-white/5 hover:border-indigo-500/30">
                            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-indigo-400">
                                <Plus size={14} />
                            </div>
                            <span className="text-sm font-medium text-slate-400 group-hover:text-indigo-300 text-left">Add Member</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const NetworkCircles = ({ onBack, setActiveView, setSelectedChannel }: { onBack: () => void, setActiveView: (v: string) => void, setSelectedChannel: (c: any) => void }) => {
    const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);

    const handleJoinChannel = () => {
        if (!selectedCircle) return;
        // Mock navigate to channel
        const mockChannel = {
            id: selectedCircle.id,
            name: selectedCircle.name,
            type: 'private',
            description: selectedCircle.description,
            subscribers: selectedCircle.members.length,
            isOwner: true,
            posts: []
        };
        setSelectedChannel(mockChannel);
        setActiveView('channels');
    };

    return (
        <div className="h-full w-full relative bg-slate-950 overflow-hidden animate-in fade-in duration-700">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-900/10 blur-[150px]" />

                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                    <defs>
                        <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                            <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {MOCK_CIRCLES.map(c => (
                        <line
                            key={c.id}
                            x1="50%" y1="50%"
                            x2={c.position.left} y2={c.position.top}
                            stroke="url(#line-grad)"
                            strokeWidth="2"
                        />
                    ))}
                </svg>
            </div>

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <button onClick={onBack} className="glass-button flex items-center gap-2">
                    <ChevronLeft size={16} /> <span className="font-semibold">Back to Dashboard</span>
                </button>
            </div>

            {/* Title */}
            <div className="absolute top-6 left-0 right-0 text-center pointer-events-none z-10">
                <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">My Network</h1>
                <p className="text-slate-400 text-sm">Dynamic & Custom Circles</p>
            </div>

            {/* Main Interactive Graph Area */}
            <div className="absolute inset-0 z-0">
                {/* You Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group cursor-default">
                    <div className="w-32 h-32 rounded-full border-4 border-slate-900 bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] relative z-20">
                        <span className="text-slate-900 font-extrabold text-2xl">You</span>
                    </div>
                    {/* Ripple Effect */}
                    <div className="absolute inset-0 -m-8 rounded-full border border-white/20 animate-ping opacity-20" />
                    <div className="absolute inset-0 -m-16 rounded-full border border-white/10 animate-ping opacity-10 animation-delay-500" />
                </div>

                {/* Circles */}
                {MOCK_CIRCLES.map(circle => (
                    <CircleNode
                        key={circle.id}
                        circle={circle}
                        onClick={() => setSelectedCircle(circle)}
                    />
                ))}
            </div>

            {/* Details Panel Overlay */}
            {selectedCircle && (
                <DetailsPanel
                    circle={selectedCircle}
                    onClose={() => setSelectedCircle(null)}
                    onJoinChannel={handleJoinChannel}
                />
            )}
        </div>
    );
};
