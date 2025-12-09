import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Layers,
    Circle,
    Users,
    TrendingUp,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit2,
    Trash2,
    UserPlus,
    UserMinus,
    Search,
    Filter,
    BarChart3,
    Activity
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

interface CircleMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    joinedDate: string;
    lastInteraction: string;
    tags: string[];
    engagementScore: number;
}

interface CircleData {
    id: string;
    name: string;
    type: 'system' | 'custom';
    count: number;
    color: string;
    desc: string;
    createdDate: string;
    growthRate: number;
    avgEngagement: number;
    members: CircleMember[];
}

// Sample circle data with members
const SAMPLE_CIRCLES: CircleData[] = [
    {
        id: 'l1',
        name: 'L1: Inner Orbit',
        type: 'system',
        count: 142,
        color: 'emerald',
        desc: 'Directly connected customers.',
        createdDate: '2024-01-15',
        growthRate: 12.5,
        avgEngagement: 8.7,
        members: [
            {
                id: 'm1',
                name: 'Sarah Johnson',
                email: 'sarah.j@email.com',
                phone: '+1 (555) 123-4567',
                location: 'New York, NY',
                joinedDate: '2024-01-20',
                lastInteraction: '2024-12-08',
                tags: ['VIP', 'Tech'],
                engagementScore: 9.2
            },
            {
                id: 'm2',
                name: 'Michael Chen',
                email: 'michael.chen@email.com',
                phone: '+1 (555) 234-5678',
                location: 'San Francisco, CA',
                joinedDate: '2024-02-15',
                lastInteraction: '2024-12-07',
                tags: ['Regular', 'Tech'],
                engagementScore: 8.5
            },
            {
                id: 'm3',
                name: 'Emily Rodriguez',
                email: 'emily.r@email.com',
                phone: '+1 (555) 345-6789',
                location: 'Austin, TX',
                joinedDate: '2024-03-10',
                lastInteraction: '2024-12-06',
                tags: ['VIP', 'Healthcare'],
                engagementScore: 9.0
            },
            {
                id: 'm4',
                name: 'David Kim',
                email: 'david.kim@email.com',
                phone: '+1 (555) 456-7890',
                location: 'Seattle, WA',
                joinedDate: '2024-04-05',
                lastInteraction: '2024-12-05',
                tags: ['Regular'],
                engagementScore: 7.8
            },
            {
                id: 'm5',
                name: 'Jessica Martinez',
                email: 'jessica.m@email.com',
                phone: '+1 (555) 567-8901',
                location: 'Miami, FL',
                joinedDate: '2024-05-12',
                lastInteraction: '2024-12-04',
                tags: ['VIP', 'Finance'],
                engagementScore: 8.9
            }
        ]
    },
    {
        id: 'l2',
        name: 'L2: Social Halo',
        type: 'system',
        count: 4820,
        color: 'amber',
        desc: 'Friends of your customers.',
        createdDate: '2024-01-15',
        growthRate: 18.3,
        avgEngagement: 6.2,
        members: [
            {
                id: 'm6',
                name: 'Robert Taylor',
                email: 'robert.t@email.com',
                phone: '+1 (555) 678-9012',
                location: 'Boston, MA',
                joinedDate: '2024-06-20',
                lastInteraction: '2024-12-03',
                tags: ['Referral'],
                engagementScore: 6.5
            },
            {
                id: 'm7',
                name: 'Amanda White',
                email: 'amanda.w@email.com',
                phone: '+1 (555) 789-0123',
                location: 'Chicago, IL',
                joinedDate: '2024-07-15',
                lastInteraction: '2024-12-02',
                tags: ['Referral', 'Tech'],
                engagementScore: 6.8
            }
        ]
    },
    {
        id: 'c1',
        name: 'Weekend Regulars',
        type: 'custom',
        count: 45,
        color: 'indigo',
        desc: 'Visit Sat/Sun > 2 times/mo',
        createdDate: '2024-03-01',
        growthRate: 8.2,
        avgEngagement: 9.1,
        members: [
            {
                id: 'm8',
                name: 'Christopher Lee',
                email: 'chris.lee@email.com',
                phone: '+1 (555) 890-1234',
                location: 'Portland, OR',
                joinedDate: '2024-03-05',
                lastInteraction: '2024-12-09',
                tags: ['Weekend', 'VIP'],
                engagementScore: 9.5
            },
            {
                id: 'm9',
                name: 'Lisa Anderson',
                email: 'lisa.a@email.com',
                phone: '+1 (555) 901-2345',
                location: 'Denver, CO',
                joinedDate: '2024-03-12',
                lastInteraction: '2024-12-08',
                tags: ['Weekend', 'Regular'],
                engagementScore: 8.7
            }
        ]
    },
    {
        id: 'c2',
        name: 'Local Tech Workers',
        type: 'custom',
        count: 850,
        color: 'cyan',
        desc: 'Tag: Tech + Geo: <1km',
        createdDate: '2024-04-10',
        growthRate: 15.7,
        avgEngagement: 7.5,
        members: [
            {
                id: 'm10',
                name: 'Kevin Patel',
                email: 'kevin.p@email.com',
                phone: '+1 (555) 012-3456',
                location: 'San Jose, CA',
                joinedDate: '2024-04-15',
                lastInteraction: '2024-12-07',
                tags: ['Tech', 'Local'],
                engagementScore: 7.9
            }
        ]
    }
];

// Helper to get circle-specific colors
const getCircleIconColors = (color: string) => {
    const colorMap: Record<string, string> = {
        emerald: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30',
        amber: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30',
        slate: 'bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-500/30',
        indigo: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30',
        cyan: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30',
    };
    return colorMap[color] || colorMap.slate;
};

const getEngagementColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 7.0) return 'text-blue-600 dark:text-blue-400';
    if (score >= 5.5) return 'text-amber-600 dark:text-amber-400';
    return 'text-slate-600 dark:text-slate-400';
};

export const CircleDetailsPage = () => {
    const { circleId } = useParams<{ circleId: string }>();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string>('all');

    const circle = SAMPLE_CIRCLES.find(c => c.id === circleId);

    // Filter members based on search and tag
    const filteredMembers = useMemo(() => {
        if (!circle) return [];

        let filtered = circle.members;

        // Apply search filter
        if (searchTerm.trim()) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(member =>
                member.name.toLowerCase().includes(lowerSearch) ||
                member.email.toLowerCase().includes(lowerSearch) ||
                member.phone.includes(lowerSearch) ||
                member.location.toLowerCase().includes(lowerSearch)
            );
        }

        // Apply tag filter
        if (selectedTag !== 'all') {
            filtered = filtered.filter(member => member.tags.includes(selectedTag));
        }

        return filtered;
    }, [circle, searchTerm, selectedTag]);

    // Get all unique tags
    const allTags = useMemo(() => {
        if (!circle) return [];
        const tags = new Set<string>();
        circle.members.forEach(member => {
            member.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags);
    }, [circle]);

    if (!circle) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Circle Not Found</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">The circle you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/business/circles')}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl transition-colors"
                    >
                        Back to Circles
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-4 md:px-6 pt-0 space-y-4 md:space-y-6 pb-28 max-w-7xl mx-auto">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                        <button
                            onClick={() => navigate('/business/circles')}
                            className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg border border-slate-200 dark:border-white/10 transition-colors flex-shrink-0 mt-1"
                        >
                            <ArrowLeft className="text-slate-600 dark:text-slate-400" size={18} />
                        </button>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-4 mb-3">
                                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${getCircleIconColors(circle.color)}`}>
                                    {circle.type === 'system' ? <Layers size={28} /> : <Circle size={28} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{circle.name}</h1>
                                        {circle.type === 'custom' && (
                                            <span className="px-2 py-0.5 bg-indigo-500 dark:bg-indigo-600/80 text-[10px] font-bold text-white rounded-md">
                                                CUSTOM
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 mb-2">{circle.desc}</p>
                                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <Users size={14} />
                                            <span>{circle.count.toLocaleString()} members</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            <span>Created {new Date(circle.createdDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {circle.type === 'custom' && (
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="glass-button">
                                        <UserPlus size={14} className="mr-1.5" />
                                        Add Members
                                    </Button>
                                    <Button size="sm" variant="outline" className="glass-button">
                                        <Edit2 size={14} className="mr-1.5" />
                                        Edit Circle
                                    </Button>
                                    <Button size="sm" variant="outline" className="glass-button text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                                        <Trash2 size={14} className="mr-1.5" />
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="glass-card p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
                                    <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">+{circle.growthRate}%</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">Growth Rate (30d)</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                                    <Activity className="text-blue-600 dark:text-blue-400" size={20} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{circle.avgEngagement}</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">Avg Engagement Score</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                                    <BarChart3 className="text-purple-600 dark:text-purple-400" size={20} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{circle.members.length}</div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">Active Members</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="glass-card p-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                                <Input
                                    type="text"
                                    placeholder="Search members by name, email, phone, or location..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 glass-card border-slate-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400"
                                />
                            </div>

                            {/* Tag Filter */}
                            {allTags.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <Filter size={16} className="text-slate-600 dark:text-slate-400" />
                                    <select
                                        value={selectedTag}
                                        onChange={(e) => setSelectedTag(e.target.value)}
                                        className="px-3 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="all">All Tags</option>
                                        {allTags.map(tag => (
                                            <option key={tag} value={tag}>{tag}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Members List */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                Members ({filteredMembers.length})
                            </h3>
                        </div>

                        {filteredMembers.length === 0 ? (
                            <div className="glass-card p-12 text-center">
                                <Users className="mx-auto mb-3 text-slate-400 dark:text-slate-600" size={48} />
                                <p className="text-slate-600 dark:text-slate-400">No members found matching your criteria</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {filteredMembers.map(member => (
                                    <div key={member.id} className="glass-card p-5 hover:shadow-lg transition-shadow">
                                        <div className="flex items-start gap-4">
                                            {/* Avatar */}
                                            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                {member.name.charAt(0)}
                                            </div>

                                            {/* Member Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">{member.name}</h4>
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            {member.tags.map(tag => (
                                                                <span
                                                                    key={tag}
                                                                    className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-md"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <div className={`text-2xl font-bold ${getEngagementColor(member.engagementScore)}`}>
                                                            {member.engagementScore}
                                                        </div>
                                                        <div className="text-xs text-slate-600 dark:text-slate-400">Engagement</div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={14} />
                                                        <span className="truncate">{member.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} />
                                                        <span>{member.phone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} />
                                                        <span>{member.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} />
                                                        <span>Last: {new Date(member.lastInteraction).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {circle.type === 'custom' && (
                                                <button
                                                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-600 text-slate-700 dark:text-white hover:text-rose-600 dark:hover:text-white rounded-lg transition-colors"
                                                    title="Remove from circle"
                                                >
                                                    <UserMinus size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
