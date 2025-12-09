import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Video, Copy, Settings, Users, Lock, Globe,
    Calendar, Clock, ArrowLeft, Check
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export const NewMeetingPage = () => {
    const navigate = useNavigate();
    const [meetingName, setMeetingName] = useState('');
    const [meetingId] = useState(`${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 4)}`);
    const [copied, setCopied] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);

    const meetingLink = `https://gigmind.meet/${meetingId}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(meetingLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleStartMeeting = () => {
        // Logic to start the meeting
        console.log('Starting meeting:', { meetingName, meetingId, isPrivate });
    };

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
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Meeting</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Create and configure your meeting</p>
                </div>
            </div>

            {/* Meeting Preview Card */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="glass-panel p-6 relative overflow-hidden border border-slate-200 dark:border-white/5">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Video size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-indigo-500/20 rounded-xl">
                                <Video size={24} className="text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {meetingName || 'Untitled Meeting'}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Meeting ID: {meetingId}
                                </p>
                            </div>
                        </div>

                        {/* Meeting Link */}
                        <div className="bg-slate-100 dark:bg-white/5 rounded-lg p-3 flex items-center gap-2 mb-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Meeting Link</p>
                                <p className="text-sm font-mono text-slate-900 dark:text-white truncate">
                                    {meetingLink}
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCopyLink}
                                className="shrink-0"
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} className="mr-1 text-emerald-500" />
                                        <span className="text-emerald-500">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} className="mr-1" />
                                        Copy
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white/50 dark:bg-white/5 rounded-lg p-3 text-center border border-slate-200 dark:border-white/5">
                                <Users size={16} className="mx-auto mb-1 text-indigo-400" />
                                <p className="text-xs text-slate-500 dark:text-slate-400">No limit</p>
                            </div>
                            <div className="bg-white/50 dark:bg-white/5 rounded-lg p-3 text-center border border-slate-200 dark:border-white/5">
                                <Clock size={16} className="mx-auto mb-1 text-indigo-400" />
                                <p className="text-xs text-slate-500 dark:text-slate-400">Unlimited</p>
                            </div>
                            <div className="bg-white/50 dark:bg-white/5 rounded-lg p-3 text-center border border-slate-200 dark:border-white/5">
                                {isPrivate ? (
                                    <>
                                        <Lock size={16} className="mx-auto mb-1 text-indigo-400" />
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Private</p>
                                    </>
                                ) : (
                                    <>
                                        <Globe size={16} className="mx-auto mb-1 text-indigo-400" />
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Public</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Meeting Configuration */}
            <div className="glass-panel p-6 border border-slate-200 dark:border-white/5 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Meeting Settings</h3>

                {/* Meeting Name */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Meeting Name
                    </label>
                    <Input
                        type="text"
                        placeholder="Enter meeting name..."
                        value={meetingName}
                        onChange={(e) => setMeetingName(e.target.value)}
                        className="w-full"
                    />
                </div>

                {/* Meeting Type Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <Calendar size={20} className="text-indigo-400" />
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Schedule for later</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Set a specific date and time</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsScheduled(!isScheduled)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${isScheduled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                    >
                        <div
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isScheduled ? 'translate-x-6' : ''
                                }`}
                        />
                    </button>
                </div>

                {/* Privacy Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <Lock size={20} className="text-indigo-400" />
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Private Meeting</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Require password to join</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsPrivate(!isPrivate)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${isPrivate ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                    >
                        <div
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isPrivate ? 'translate-x-6' : ''
                                }`}
                        />
                    </button>
                </div>

                {/* Advanced Settings Button */}
                <button className="w-full flex items-center justify-between p-4 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5 hover:border-indigo-500/50 transition-colors group">
                    <div className="flex items-center gap-3">
                        <Settings size={20} className="text-indigo-400" />
                        <div className="text-left">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Advanced Settings</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Configure audio, video, and more</p>
                        </div>
                    </div>
                    <div className="text-slate-400 group-hover:text-indigo-400 transition-colors">→</div>
                </button>
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
                    className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20"
                    onClick={handleStartMeeting}
                >
                    <Video className="mr-2" size={18} />
                    {isScheduled ? 'Schedule Meeting' : 'Start Meeting'}
                </Button>
            </div>
        </div>
    );
};
