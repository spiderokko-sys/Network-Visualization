import React, { useState } from 'react';
import {
  Signal, Plus, X, Hand, Gift, Flag,
  Lock, Search, ArrowLeft, Copy, ExternalLink,
  Mail, Star, Share2
} from 'lucide-react';
import { Button } from './ui/button';

// --- Gemini API Configuration ---
const apiKey = ""; // Set by runtime environment

// --- Types ---
interface Contribution {
  id?: number | string;
  type: string;
  value?: string;
  pledge?: string;
  details?: string;
  returnExpectation?: string;
  returnDetails?: string;
  contributor?: string;
  status?: string;
  return?: string;
}

interface Channel {
  id: string | number;
  name: string;
  type?: 'public' | 'private' | 'restricted';
  preview?: string;
  isJoined?: boolean;
  lastMessage?: string;
}



interface Intent {
  id: number | string;
  type: string; // 'ask' | 'offer' | 'rally'
  level: string;
  user: string;
  avatar: string;
  imageUrl?: string;
  tags: string[];
  context: string;
  endorsedBy?: string | null;
  isInterested: boolean;
  timestamp: string;
  status: string;
  contributions?: Contribution[];
  channels?: Channel[];
  outcome?: {
    reason: string;
    comment: string;
    rating: number;
  };
}

const callGemini = async (prompt: string) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

// --- Mock Data ---

const INITIAL_INTENTS: Intent[] = [
  {
    id: 1,
    type: 'ask',
    level: 'L1',
    user: 'Sarah Jenkins',
    avatar: 'SJ',
    imageUrl: 'https://placehold.co/40x40/3b82f6/ffffff?text=SJ',
    tags: ['Hiring', 'UX Design', 'Urgency: Med'],
    context: "Looking for a mid-level designer for a 3-month contract. Know anyone reliable? We need someone who knows Figma well.",
    endorsedBy: null,
    isInterested: false,
    timestamp: '2h ago',
    status: 'active',
    contributions: []
  },
  {
    id: 5,
    type: 'rally',
    level: 'L3',
    user: 'You',
    avatar: 'ME',
    tags: ['Event', 'Basketball', 'Downtown'],
    context: "Hosting a pickup game at the community center courts this Sunday. Need 3 more players for full court 5v5.",
    endorsedBy: null,
    isInterested: false,
    timestamp: '5m ago',
    status: 'active',
    channels: [
      { id: 501, name: 'Logistics', lastMessage: 'Bags and gloves confirmed.' },
      { id: 502, name: 'Attendance', lastMessage: '3 spots left!' },
    ],
    contributions: [
      { id: 1, contributor: 'Alice Smith', type: 'services', pledge: '3 hours setup', status: 'Received', return: 'Nothing' },
      { id: 2, contributor: 'Bob Johnson', type: 'monetary', pledge: '$50.00', status: 'Received', return: 'Credit/Recognition' },
      { id: 3, contributor: 'Charlie Brown', type: 'goods', pledge: 'Folding Table', status: 'Pledged', return: 'Specific Return' },
    ]
  },
  {
    id: 2,
    type: 'offer',
    level: 'L2',
    user: 'Mark Alistair',
    avatar: 'MA',
    tags: ['Mentorship', 'GoLang', 'Toronto'],
    context: "I have 2 hours/week open to mentor a junior dev. I specialize in backend systems and concurrency.",
    endorsedBy: 'Mike Ross',
    isInterested: false,
    timestamp: '4h ago',
    status: 'active'
  },
  {
    id: 3,
    type: 'rally',
    level: 'L3',
    user: 'Elena Fisher',
    avatar: 'EF',
    tags: ['Event', 'Cleanup', 'Annex'],
    context: "Organizing a neighborhood cleanup this Saturday. Bags and gloves provided. Need 10 more people.",
    endorsedBy: null,
    isInterested: false,
    timestamp: '12m ago',
    status: 'active'
  },
  {
    id: 4,
    type: 'ask',
    level: 'L2',
    user: 'David Chen',
    avatar: 'DC',
    tags: ['Advice', 'Legal', 'Startup'],
    context: "Need a quick consult regarding IP assignment for a new co-founder. Any friendly lawyers in the network?",
    endorsedBy: 'Sarah Jenkins',
    isInterested: false,
    timestamp: '1d ago',
    status: 'active'
  },
  {
    id: 6,
    type: 'offer',
    level: 'L1',
    user: 'You',
    avatar: 'ME',
    tags: ['Lending', 'Tools', 'Drill'],
    context: "I have a heavy-duty impact driver available for the weekend if anyone needs to borrow it for home renos.",
    endorsedBy: null,
    isInterested: false,
    timestamp: '1h ago',
    status: 'active'
  },
  {
    id: 7,
    type: 'ask',
    level: 'L1',
    user: 'You',
    avatar: 'ME',
    tags: ['Advice', 'Marketing', 'High'],
    context: "Seeking advice on setting up Google Ads for a new SaaS product launch.",
    endorsedBy: null,
    isInterested: false,
    timestamp: '1h ago',
    status: 'completed'
  }
];



// --- Helper Components ---

const Badge = ({ children, color }: { children: React.ReactNode, color: string }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-500/20',
    green: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20',
    amber: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-500/20',
    rose: 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-500/20',
    gray: 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${colors[color] || colors.gray} backdrop-blur-sm`}>
      {children}
    </span>
  );
};

// --- Intent Card Component ---

const IntentCard = ({ intent, onSelect }: { intent: Intent; onSelect: (intent: Intent) => void }) => {
  const isL1 = intent.level === 'L1' || intent.user === 'You';
  const displayName = isL1 ? intent.user : (intent.level === 'L2' ? 'Network Signal' : 'Anonymous Signal');
  const displayAvatar = isL1 ? intent.avatar : <Lock size={14} />;
  const isIncomingL1 = intent.level === 'L1' && intent.user !== 'You';
  const profileImage = intent.imageUrl;
  const TypeIcon = intent.type === 'ask' ? Hand : intent.type === 'offer' ? Gift : Flag;

  return (
    <div
      onClick={() => onSelect(intent)}
      className="glass-card mb-4 relative group cursor-pointer overflow-hidden transform transition-all duration-300 hover:scale-[1.01]"
    >
      {/* Type Indicator Strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${intent.type === 'ask' ? 'bg-indigo-500' : intent.type === 'offer' ? 'bg-emerald-500' : 'bg-rose-500'}`} />

      <div className="p-4 pl-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            {isIncomingL1 && profileImage ? (
              <img src={profileImage} alt={intent.avatar} className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10" />
            ) : (
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-inner ${isL1 ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                {displayAvatar}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-semibold text-sm ${!isL1 ? 'text-slate-500 dark:text-slate-400 font-mono' : 'text-slate-900 dark:text-slate-100'}`}>
                  {displayName}
                </h3>
                {intent.level === 'L1' && <Badge color="green">L1</Badge>}
                {intent.level === 'L2' && <Badge color="amber">L2</Badge>}
                {intent.level === 'L3' && <Badge color="rose">L3</Badge>}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500 flex items-center gap-1">
                  <TypeIcon size={10} /> {intent.type}
                </span>
                {!isL1 && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-600 flex items-center">
                    <Lock size={10} className="mr-0.5" /> Hidden
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">{intent.timestamp}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {intent.tags.map((tag, i) => (
            <span key={i} className="text-[10px] font-medium text-cyan-600 dark:text-cyan-300/80 bg-cyan-100 dark:bg-cyan-900/10 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-500/10">
              {tag}
            </span>
          ))}
        </div>

        <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-2">
          {intent.context}
        </div>
      </div>
    </div>
  );
};


// --- Modals (Refactored to Premium Glass) ---

const GlassModal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-slate-200 dark:border-white/5 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900/50 backdrop-blur-xl z-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// --- Share Modal ---
const ShareIntentModal = ({ isOpen, onClose, intent }: { isOpen: boolean; onClose: () => void; intent: Intent }) => {
  const shareLink = `https://gigmnd.app/intent/${intent.id}`;
  const handleCopy = () => { navigator.clipboard.writeText(shareLink); };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Share Intent">
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-white rounded-xl shadow-lg">
          <div className="w-32 h-32 bg-zinc-900 flex items-center justify-center text-white text-xs">QR Code</div>
        </div>
      </div>
      <div className="mb-6">
        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Direct Link</label>
        <div className="flex gap-2">
          <input readOnly value={shareLink} className="flex-1 bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-500 dark:text-slate-400 focus:outline-none" />
          <Button size="icon" variant="secondary" onClick={handleCopy}><Copy size={16} /></Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="glass-button w-full"><ExternalLink size={16} className="mr-2" /> Telegram</Button>
        <Button variant="outline" className="glass-button w-full"><Mail size={16} className="mr-2" /> Email</Button>
      </div>
    </GlassModal>
  );
};

// --- Completion Modal ---
const CompletionModal = ({ isOpen, onClose, intentId, onCompleteAction }: { isOpen: boolean; onClose: () => void; intentId: number | string; onCompleteAction: (id: number | string, status: string, reason: string, comment: string, rating: number) => void }) => {
  const [status, setStatus] = useState('complete');
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCompleteAction(intentId, status, reason, comment, rating);
    onClose();
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Finalize Intent">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Outcome</label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStatus('complete')} className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${status === 'complete' ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300' : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'}`}>Success</button>
            <button type="button" onClick={() => setStatus('incomplete')} className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${status === 'incomplete' ? 'bg-rose-100 dark:bg-rose-500/20 border-rose-500 text-rose-600 dark:text-rose-300' : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'}`}>Incomplete</button>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} type="button" onClick={() => setRating(s)} className="p-1 hover:scale-110 transition-transform"><Star size={24} className={s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-700"} /></button>
            ))}
          </div>
        </div>

        {status === 'incomplete' && (
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Reason</label>
            <select value={reason} onChange={e => setReason(e.target.value)} className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg p-2 text-slate-700 dark:text-slate-300 text-sm outline-none">
              <option value="">Select Reason...</option>
              <option value="ghosted">No Show / Ghosted</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Comments</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-700 dark:text-slate-300 text-sm outline-none resize-none" placeholder="Optional feedback..." />
        </div>

        <Button type="submit" className="w-full" variant={status === 'complete' ? 'default' : 'destructive'}>Confirm Status</Button>
      </form>
    </GlassModal>
  );
};


// --- Main Component ---

export const GlobeWithUI = ({ showHeader = false }: { showHeader?: boolean }) => {
  const [view, setView] = useState('dashboard'); // dashboard, wizard, details, channel
  const [activeTab, setActiveTab] = useState('incoming');
  const [intents, setIntents] = useState<Intent[]>(INITIAL_INTENTS);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);

  // Filter/Search
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIntents = intents.filter(intent => {
    if (activeTab === 'mine' && intent.user !== 'You') return false;
    if (activeTab === 'incoming' && intent.user === 'You') return false;
    if (filterType !== 'all' && intent.type !== filterType) return false;
    if (searchTerm && !intent.context.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col font-sans text-slate-700 dark:text-slate-200">

      {/* Header if needed (usually handled by App layout) */}
      {showHeader && (
        <div className="h-16 border-b border-slate-200 dark:border-white/5 flex items-center px-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl shrink-0">
          <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">GIGMIND • INTENTS</span>
        </div>
      )}

      {/* Main View Area */}
      {view === 'dashboard' && (
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 space-y-6 pb-24 md:pb-6">

          {/* Control Bar */}
          <div className="flex flex-col md:flex-row gap-4 sticky top-0 z-10 pb-2 pt-0 md:pt-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl md:bg-transparent -mx-4 px-4 md:-mx-6 md:px-0">
            <div className="glass-panel p-1 rounded-xl flex shrink-0">
              <button onClick={() => setActiveTab('incoming')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'incoming' ? 'bg-indigo-600 shadow-lg text-white' : 'text-slate-400 hover:text-white'}`}>Feed</button>
              <button onClick={() => setActiveTab('mine')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'mine' ? 'bg-indigo-600 shadow-lg text-white' : 'text-slate-400 hover:text-white'}`}>My Signals</button>
            </div>

            <div className="glass-panel p-1 rounded-xl flex-1 flex items-center px-3 gap-2">
              <Search size={16} className="text-slate-500" />
              <input
                type="text"
                placeholder="Search intents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white w-full placeholder:text-slate-500 dark:placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {[
              { id: 'all', label: 'All', icon: Signal },
              { id: 'ask', label: 'Asks', icon: Hand },
              { id: 'offer', label: 'Offers', icon: Gift },
              { id: 'rally', label: 'Rallies', icon: Flag }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all
                            ${filterType === f.id ? 'bg-indigo-100 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-300' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-500 hover:border-slate-300 dark:hover:border-white/20'}
                        `}
              >
                <f.icon size={12} /> {f.label}
              </button>
            ))}
          </div>

          {/* Intent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredIntents.map(intent => (
              <IntentCard key={intent.id} intent={intent} onSelect={(i) => { setSelectedIntent(i); setView('details'); }} />
            ))}
          </div>

          {filteredIntents.length === 0 && (
            <div className="text-center py-20 opacity-50">
              <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-white/10">
                <Search size={32} className="text-slate-600" />
              </div>
              <p>No signals found matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Details View */}
      {view === 'details' && selectedIntent && (
        <div className="h-full flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-slate-200 dark:border-white/5 flex items-center gap-4 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
            <Button variant="ghost" size="icon" onClick={() => setView('dashboard')} className="rounded-full h-10 w-10"><ArrowLeft /></Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-3xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-start gap-4 sm:gap-5 mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-[0_0_30px_rgba(79,70,229,0.3)] flex items-center justify-center text-white text-xl sm:text-2xl font-bold border border-white/20 shrink-0">
                {selectedIntent.user === 'You' ? 'ME' : (selectedIntent.level === 'L1' ? selectedIntent.avatar : <Lock />)}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 break-words">{selectedIntent.level === 'L1' || selectedIntent.user === 'You' ? selectedIntent.user : 'Anonymous Node'}</h1>
                <div className="flex flex-wrap gap-2">
                  <Badge color="blue">{selectedIntent.type}</Badge>
                  <Badge color={selectedIntent.level === 'L1' ? 'green' : selectedIntent.level === 'L2' ? 'amber' : 'rose'}>{selectedIntent.level}</Badge>
                </div>
              </div>
            </div>

            {/* Context Card */}
            <div className="glass-panel p-6 rounded-2xl mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Signal size={120} /></div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Signal Context</h3>
              <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-medium relative z-10">"{selectedIntent.context}"</p>
              <div className="mt-6 flex flex-wrap gap-2 relative z-10">
                {selectedIntent.tags.map(t => <span key={t} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-sm text-cyan-600 dark:text-cyan-400 font-mono">{t}</span>)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button size="lg" className="w-full glass-button-primary bg-indigo-600 hover:bg-indigo-500 h-14 text-lg">
                <Hand className="mr-2" /> I'm Interested
              </Button>
              <Button size="icon" variant="outline" className="h-14 w-14 glass-button"><Share2 /></Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      {view === 'dashboard' && (
        <div className="absolute bottom-24 right-6 md:bottom-10 md:right-10">
          <button
            onClick={() => {/* Open Wizard */ }}
            className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.5)] border border-white/20 transition-transform hover:scale-105 active:scale-95"
          >
            <Plus size={28} className="md:w-8 md:h-8" />
          </button>
        </div>
      )}

    </div>
  );
};

export default GlobeWithUI;