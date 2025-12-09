import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Video, ArrowLeft, LogIn, Users, Clock, Shield
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export const JoinMeetingPage = () => {
    const navigate = useNavigate();
    const [meetingId, setMeetingId] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleJoinMeeting = () => {
        // Logic to join the meeting
        console.log('Joining meeting:', { meetingId, displayName, password });
    };

    const isValidMeetingId = meetingId.length >= 8;

    return (
        <div className="h-full overflow-y-auto no-scrollbar pt-2 px-4 md:p-6 space-y-6 animate-in fade-in slide-in-from-right-4 pb-28 bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/calls')}
                    className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Join Meeting</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Enter meeting details to join</p>
                </div>
            </div>

            {/* Hero Card */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="glass-panel p-8 relative overflow-hidden border border-slate-200 dark:border-white/5">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <LogIn size={120} />
                    </div>
                    <div className="relative z-10 text-center">
                        <div className="inline-flex p-4 bg-emerald-500/20 rounded-2xl mb-4">
                            <Video size={32} className="text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            Ready to Join?
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Enter the meeting ID or link to connect with others
                        </p>
                    </div>
                </div>
            </div>

            {/* Join Form */}
            <div className="glass-panel p-6 border border-slate-200 dark:border-white/5 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Meeting Details</h3>

                {/* Meeting ID Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Meeting ID or Link
                    </label>
                    <Input
                        type="text"
                        placeholder="Enter meeting ID or paste link..."
                        value={meetingId}
                        onChange={(e) => setMeetingId(e.target.value)}
                        className="w-full"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Example: abc123def-4567 or https://gigmind.meet/abc123def-4567
                    </p>
                </div>

                {/* Display Name Input */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Your Name
                    </label>
                    <Input
                        type="text"
                        placeholder="Enter your display name..."
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full"
                    />
                </div>

                {/* Password Input (Conditional) */}
                {showPassword && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Password (Optional)
                        </label>
                        <Input
                            type="password"
                            placeholder="Enter meeting password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full"
                        />
                    </div>
                )}

                {/* Password Toggle */}
                <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors flex items-center gap-2"
                >
                    <Shield size={14} />
                    {showPassword ? 'Hide password field' : 'Meeting requires password?'}
                </button>
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="glass-panel p-4 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <Users size={20} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">HD Video</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Crystal clear quality</p>
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-4 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <Clock size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">No Time Limit</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Unlimited duration</p>
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-4 border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Shield size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Secure</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">End-to-end encrypted</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Meetings */}
            <div className="glass-panel p-6 border border-slate-200 dark:border-white/5">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                    Recent Meetings
                </h3>
                <div className="space-y-2">
                    {[
                        { id: 'abc123def-4567', name: 'Weekly Team Sync', time: '2 hours ago' },
                        { id: 'xyz789ghi-1234', name: 'Project Review', time: 'Yesterday' },
                        { id: 'def456jkl-7890', name: 'Client Presentation', time: '2 days ago' },
                    ].map((meeting, idx) => (
                        <button
                            key={idx}
                            onClick={() => setMeetingId(meeting.id)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors group border border-slate-200 dark:border-white/5"
                        >
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <Video size={16} className="text-indigo-400" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {meeting.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {meeting.id} • {meeting.time}
                                </p>
                            </div>
                            <div className="text-slate-400 group-hover:text-indigo-400 transition-colors">→</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    className="flex-1 h-12 text-slate-900 dark:text-white border-slate-300 dark:border-white/10"
                    onClick={() => navigate('/calls')}
                >
                    Cancel
                </Button>
                <Button
                    className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleJoinMeeting}
                    disabled={!isValidMeetingId || !displayName}
                >
                    <LogIn className="mr-2" size={18} />
                    Join Meeting
                </Button>
            </div>
        </div>
    );
};
