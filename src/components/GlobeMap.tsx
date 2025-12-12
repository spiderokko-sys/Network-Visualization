import React, { useState } from 'react';
import {
  Signal, Plus, X, Hand, Gift, Flag,
  Lock, Search, ArrowLeft, Copy, ExternalLink,
  Mail, Star, Share2, Briefcase, DollarSign, Package,
  Sparkles, Loader2, Pencil, CheckCircle, MessageSquare,
  Send, UserPlus, MessageCircle, Hash, ChevronRight,
  Zap, Gavel, Users, Settings, MapPin, Filter
} from 'lucide-react';
import { Button } from './ui/button';
// Local types removed in favor of shared type
import { Intent } from './shared/IntentEditor';
import { EditIntentModal, IntentWizard, GlassModal } from './shared/IntentEditor';


// --- Gemini API Configuration ---
// const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''; // Moved to backend/shared

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





// --- Geocoding Utility ---
const geocodeCity = async (city: string): Promise<{ lat: number, lng: number, displayName: string } | null> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
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

    contributions: [],
    location: { city: 'Toronto', country: 'CA', lat: 43.6532, lng: -79.3832 } // Downtown
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
    ],
    location: { city: 'Toronto', country: 'CA', lat: 43.6510, lng: -79.3470 } // Riverdale (approx 3-4km from downtown)
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
    status: 'active',
    location: { city: 'Toronto', country: 'CA', lat: 43.7001, lng: -79.4163 } // Midtown
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
    status: 'active',
    location: { city: 'Toronto', country: 'CA', lat: 43.6667, lng: -79.4032 } // Annex
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
    status: 'active',
    location: { city: 'Vancouver', country: 'CA', lat: 49.2827, lng: -123.1207 }
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
    status: 'active',
    location: { city: 'Toronto', country: 'CA', lat: 43.6532, lng: -79.3832 }
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
    status: 'completed',
    location: { city: 'Toronto', country: 'CA', lat: 43.6532, lng: -79.3832 }
  },
];



// --- Filter Bottom Sheet ---
const FilterBottomSheet = ({ isOpen, onClose, filters, onApply }: { isOpen: boolean, onClose: () => void, filters: any, onApply: (newFilters: any) => void }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isLoading, setIsLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  // Snychronize when opening
  React.useEffect(() => { if (isOpen) setLocalFilters(filters); }, [isOpen, filters]);

  if (!isOpen) return null;

  const handleGeoApply = async () => {
    // If city is empty, clear geo
    if (!localFilters.city) {
      onApply({ ...localFilters, geo: null });
      onClose();
      return;
    }

    // If city hasn't changed from what's active and we have coords, use existing
    if (filters.geo?.city === localFilters.city && filters.geo?.lat) {
      onApply({ ...localFilters, geo: filters.geo }); // minimal update
      onClose();
      return;
    }

    setIsLoading(true);
    setGeoError('');
    const result = await geocodeCity(localFilters.city);
    setIsLoading(false);

    if (result) {
      const newGeo = {
        city: result.displayName.split(',')[0],
        radius: localFilters.radius || 10,
        lat: result.lat,
        lng: result.lng
      };
      onApply({ ...localFilters, geo: newGeo });
      onClose();
    } else {
      setGeoError('City not found');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="glass-panel w-full sm:max-w-md sm:mx-auto sm:rounded-2xl rounded-t-2xl shadow-2xl relative animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Filter size={18} className="text-indigo-500" /> Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-500"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-8">
          {/* Type Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Intent Type</label>
            <div className="grid grid-cols-4 gap-2 bg-slate-100 dark:bg-black/30 p-1 rounded-xl">
              {[{ id: 'all', label: 'All' }, { id: 'ask', label: 'Ask' }, { id: 'offer', label: 'Offer' }, { id: 'rally', label: 'Rally' }].map(t => (
                <button
                  key={t.id}
                  onClick={() => setLocalFilters({ ...localFilters, type: t.id })}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${localFilters.type === t.id ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Level Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Social Circle</label>
            <div className="grid grid-cols-4 gap-2">
              {[{ id: 'all', label: 'All Layers' }, { id: 'L1', label: 'L1 Direct' }, { id: 'L2', label: 'L2 Network' }, { id: 'L3', label: 'L3 Public' }].map(l => (
                <button
                  key={l.id}
                  onClick={() => setLocalFilters({ ...localFilters, level: l.id })}
                  className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${localFilters.level === l.id
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Geographic Filter */}
          <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-white/5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><MapPin size={12} /> Geographic Filter</label>
              {localFilters.geo && <button onClick={() => setLocalFilters({ ...localFilters, city: '', geo: null })} className="text-[10px] text-rose-500 font-bold hover:underline">Clear Location</button>}
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={localFilters.city || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, city: e.target.value })}
                  placeholder="Enter City (e.g. Toronto)"
                  className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors"
                />
                {isLoading && <div className="absolute right-3 top-3"><Loader2 size={16} className="animate-spin text-indigo-500" /></div>}
              </div>
              {geoError && <p className="text-xs text-rose-500 font-medium ml-1">{geoError}</p>}

              <div className={`transition-opacity duration-300 ${!localFilters.city ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Search Radius</label>
                  <span className="text-xs font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">{localFilters.radius || 10} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="200"
                  value={localFilters.radius || 10}
                  onChange={(e) => setLocalFilters({ ...localFilters, radius: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
          <Button onClick={handleGeoApply} disabled={isLoading} className="w-full h-12 text-sm font-bold glass-button-primary bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
            {isLoading ? 'Updating Location...' : 'Apply Filters'}
          </Button>
        </div>
      </div>
    </div>
  );
};

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
              <img src={profileImage} alt={typeof intent.avatar === 'string' ? intent.avatar : 'User Avatar'} className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10" />
            ) : (
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner ${isL1 ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
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
    </div >
  );
};


// --- Modals (Refactored to Premium Glass) ---

// --- Share Modal ---
const ShareIntentModal = ({ isOpen, onClose, intent }: { isOpen: boolean; onClose: () => void; intent: Intent }) => {
  const shareLink = `https://gigmnd.app/intent/${intent.id}`;
  const handleCopy = () => { navigator.clipboard.writeText(shareLink); };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Share Intent">
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-white dark:bg-white rounded-xl shadow-lg">
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
const CompletionModal = ({ isOpen, onClose, intentId, onCompleteAction }: { isOpen: boolean, onClose: () => void, intentId: number | string, onCompleteAction: (id: number | string, status: string, reason: string, comment: string, rating: number) => void }) => {
  const [status, setStatus] = useState('complete');
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCompleteAction(intentId, status, reason, comment, rating);
    onClose();
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Close Intent">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Outcome</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStatus('complete')} className={`flex-1 py-2 rounded-lg border text-sm font-bold ${status === 'complete' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' : 'bg-slate-50 border-slate-200'}`}>Success</button>
            <button type="button" onClick={() => setStatus('archive')} className={`flex-1 py-2 rounded-lg border text-sm font-bold ${status === 'archive' ? 'bg-slate-500/10 border-slate-500 text-slate-600' : 'bg-slate-50 border-slate-200'}`}>Archive</button>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Reason</label>
          <select value={reason} onChange={e => setReason(e.target.value)} className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm outline-none">
            <option value="">Select a reason...</option>
            <option value="fulfilled">Request Fulfilled</option>
            <option value="cancelled">Cancelled</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Rating (1-5)</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(r => (
              <button key={r} type="button" onClick={() => setRating(r)} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${rating >= r ? 'bg-amber-100 border-amber-300 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>{r}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Closing Comment</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm outline-none resize-none h-20" placeholder="How did it go?" />
        </div>
        <Button type="submit" className="w-full">Mark as {status === 'complete' ? 'Complete' : 'Archived'}</Button>
      </form>
    </GlassModal>
  );
};

// --- Pledge Contribution Modal ---
const PledgeContributionModal = ({ isOpen, onClose, intent, onPledge }: { isOpen: boolean, onClose: () => void, intent: Intent, onPledge: (intentId: number | string, data: any) => void }) => {
  const [step, setStep] = useState(1);
  const [contribution, setContribution] = useState<Contribution>({
    type: '',
    details: '',
    value: '',
    returnExpectation: 'nothing',
    returnDetails: ''
  });

  const ARCHETYPES = [
    { id: 'services', title: 'Services', icon: Briefcase, sub: 'Time/Effort' },
    { id: 'monetary', title: 'Monetary', icon: DollarSign, sub: 'Cash/Fund' },
    { id: 'goods', title: 'Goods', icon: Package, sub: 'Items' },
  ];

  // Reset on close
  React.useEffect(() => { if (!isOpen) setStep(1); }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPledge(intent.id, contribution);
    onClose();
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Pledge Contribution">
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div className="grid grid-cols-3 gap-2">
              {ARCHETYPES.map(arch => (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => setContribution({ ...contribution, type: arch.id })}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${contribution.type === arch.id ? 'bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100'}`}
                >
                  <arch.icon size={20} />
                  <div>
                    <div className="text-xs font-bold">{arch.title}</div>
                    <div className="text-[10px] text-slate-400">{arch.sub}</div>
                  </div>
                </button>
              ))}
            </div>

            {contribution.type && (
              <div className="animate-in fade-in duration-300">
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Details</label>
                <textarea
                  value={contribution.details}
                  onChange={e => setContribution({ ...contribution, details: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm outline-none"
                  placeholder="Describe your contribution..."
                />
                <div className="flex justify-end pt-2">
                  <Button type="button" onClick={() => setStep(2)} disabled={!contribution.details}>Next</Button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-right duration-300">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Expectation</label>
              <div className="space-y-2">
                {['nothing', 'specific', 'credit'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setContribution({ ...contribution, returnExpectation: opt })}
                    className={`w-full p-3 rounded-lg border text-left text-sm font-medium capitalize transition-all ${contribution.returnExpectation === opt ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10'}`}
                  >
                    {opt === 'nothing' ? 'No Return (Goodwill)' : opt === 'credit' ? 'Public Recognition' : 'Specific Return'}
                  </button>
                ))}
              </div>
            </div>
            {contribution.returnExpectation === 'specific' && (
              <textarea
                value={contribution.returnDetails}
                onChange={e => setContribution({ ...contribution, returnDetails: e.target.value })}
                placeholder="What do you expect in return?"
                className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm outline-none"
              />
            )}
            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button type="submit">Confirm Pledge</Button>
            </div>
          </div>
        )}
      </form>
    </GlassModal>
  );
};

// --- Wizard Steps ---



// --- Discussion & Contact Components ---

const DiscussionChannelView = ({ channel, onBack }: { channel: Channel, onBack: () => void, intent: Intent }) => (
  <div className="h-full flex flex-col animate-in slide-in-from-right duration-300 bg-slate-50 dark:bg-black/40 backdrop-blur-xl">
    <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md z-10">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white"><ArrowLeft size={20} /></button>
        <h2 className="font-bold text-lg text-slate-900 dark:text-white"># {channel.name}</h2>
      </div>
      <button className="text-slate-400"><Settings size={18} /></button>
    </div>
    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
      <div className="text-center text-xs text-slate-500 my-4">Today</div>
      {/* Mock Msgs */}
      <div className="flex justify-start"><div className="bg-white/10 px-4 py-2 rounded-xl rounded-tl-none text-slate-200 text-sm"><p>Welcome to #{channel.name}</p></div></div>
    </div>
    <div className="p-4 border-t border-slate-200 dark:border-white/10"><div className="relative"><input type="text" placeholder={`Message #${channel.name}...`} className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-900 dark:text-white outline-none" /><button className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-indigo-400"><Send size={18} /></button></div></div>
  </div>
);

const DiscussionChannelsMenu = ({ intent, onSelectChannel, onCreateChannel }: { intent: Intent, onSelectChannel: (c: Channel) => void, onCreateChannel: () => void }) => (
  <div className="mt-8 space-y-4">
    <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-2"><MessageCircle size={16} /> Discussion Channels</h3>
    <div className="glass-panel p-2 rounded-xl space-y-1">
      <button onClick={() => onSelectChannel({ id: 0, name: 'Main Discussion' })} className="w-full px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-between group">
        <div className="flex items-center gap-3"><MessageCircle size={16} className="text-indigo-500" /><span className="text-sm font-bold text-slate-700 dark:text-slate-200">Main Discussion</span></div>
        <ChevronRight size={14} className="opacity-0 group-hover:opacity-50" />
      </button>
      {intent.channels?.map(c => (
        <button key={c.id} onClick={() => onSelectChannel(c)} className="w-full px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-between group">
          <div className="flex items-center gap-3"><Hash size={16} className="text-slate-500" /><span className="text-sm text-slate-600 dark:text-slate-300">#{c.name}</span></div>
          <span className="text-[10px] text-slate-500">{c.lastMessage}</span>
        </button>
      ))}
      <button onClick={onCreateChannel} className="w-full py-2 text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 border-t border-slate-200 dark:border-white/5 mt-1 pt-2 flex items-center justify-center gap-1"><Plus size={12} /> Add Channel</button>
    </div>
  </div>
);

const InviteContactsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mt-8 space-y-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-3 px-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200">
        <div className="flex items-center gap-2"><UserPlus size={18} className="text-indigo-500 dark:text-indigo-400" /> Invite Contacts</div>
        <ChevronRight size={18} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 animate-in slide-in-from-top-2">
          <input type="text" placeholder="Search..." className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg p-2 text-sm text-slate-900 dark:text-white mb-2 outline-none" />
          <div className="text-center text-xs text-slate-500 py-2">No contacts found.</div>
        </div>
      )}
    </div>
  );
};

const InterestedUsersList = ({ intent }: { intent: Intent }) => (
  <div className="mb-8">
    <h3 className="text-xs uppercase font-bold text-indigo-500 dark:text-indigo-400 tracking-wider mb-3 flex items-center gap-2"><Users size={16} /> Interested Users</h3>
    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-center text-xs text-slate-500">No users yet.</div>
  </div>
);

export const GlobeWithUI = ({ showHeader = false }: { showHeader?: boolean }) => {
  const [view, setView] = useState('dashboard'); // dashboard, wizard, details, channel
  const [activeTab, setActiveTab] = useState('incoming');
  const [intents, setIntents] = useState<Intent[]>(INITIAL_INTENTS);
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  // Modals State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  // Filter/Search
  const [filterType, setFilterType] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterGeo, setFilterGeo] = useState<{ radius: number, city: string, lat?: number, lng?: number } | null>(null);
  const [isGeoOpen, setIsGeoOpen] = useState(false); // Used for Bottom Sheet

  // --- Handlers ---
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const startWizard = () => setIsWizardOpen(true);

  const handleCreateIntent = (data: any) => {
    const created: Intent = {
      id: Date.now(),
      type: data.type,
      level: data.level,
      user: 'You',
      avatar: 'ME',
      timestamp: 'Just now',
      status: 'active',
      tags: data.tags || [],
      context: data.context || '',
      isInterested: false,
      contributions: [],
      location: filterGeo ? { ...filterGeo, country: 'Unknown', lat: filterGeo.lat || 0, lng: filterGeo.lng || 0 } : undefined
    };
    setIntents([created, ...intents]);
    setActiveTab('mine');
    setView('dashboard');
  };

  const handleUpdateIntent = (id: number | string, context: string, tags: string[]) => {
    setIntents(prev => prev.map(i => i.id === id ? { ...i, context, tags } : i));
    if (selectedIntent?.id === id) {
      setSelectedIntent(prev => prev ? { ...prev, context, tags } : null);
    }
  };

  const handlePledge = (id: number | string, pledge: any) => {
    // Mock adding pledge
    const newContribution = { ...pledge, id: Date.now(), contributor: 'You', status: 'Pledged', return: pledge.returnExpectation === 'nothing' ? 'Nothing' : 'Specific Return' };
    setIntents(prev => prev.map(i => i.id === id ? { ...i, contributions: [...(i.contributions || []), newContribution] } : i));
    if (selectedIntent?.id === id) {
      setSelectedIntent(prev => prev ? { ...prev, contributions: [...(prev.contributions || []), newContribution] } : null);
    }
  };

  const handleCompleteAction = (id: number | string, status: string, reason: string, comment: string, rating: number) => {
    setIntents(prev => prev.map(i => i.id === id ? { ...i, status: status === 'complete' ? 'completed' : 'archived', outcome: { reason, comment, rating } } : i));
    setView('dashboard');
  };

  const filteredIntents = intents.filter(intent => {
    if (activeTab === 'mine' && intent.user !== 'You') return false;
    if (activeTab === 'incoming' && intent.user === 'You') return false;

    // Type Filter
    if (filterType !== 'all' && intent.type !== filterType) return false;

    // Level Filter
    if (filterLevel !== 'all') {
      if (filterLevel === 'L1' && intent.level !== 'L1' && intent.user !== 'You') return false;
      if (filterLevel === 'L2' && intent.level !== 'L2') return false;
      if (filterLevel === 'L3' && intent.level !== 'L3') return false;
    }

    // Geo Filter
    if (filterGeo && filterGeo.lat && filterGeo.lng && intent.location) {
      const dist = calculateDistance(filterGeo.lat, filterGeo.lng, intent.location.lat, intent.location.lng);
      if (dist > filterGeo.radius) return false;
    }

    return true;
  });

  return (
    <div className="h-full flex flex-col font-sans text-slate-700 dark:text-slate-200 relative overflow-hidden">

      {/* Modals */}
      <IntentWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} onFinish={handleCreateIntent} />
      {selectedIntent && (
        <>
          <CompletionModal isOpen={isCompleteOpen} onClose={() => setIsCompleteOpen(false)} intentId={selectedIntent.id} onCompleteAction={handleCompleteAction} />
          <EditIntentModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} intent={selectedIntent} onSave={handleUpdateIntent} />
          <PledgeContributionModal isOpen={isPledgeModalOpen} onClose={() => setIsPledgeModalOpen(false)} intent={selectedIntent} onPledge={handlePledge} />
          <ShareIntentModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} intent={selectedIntent} />
        </>
      )}

      {/* Header */}
      {showHeader && (
        <div className="h-16 border-b border-slate-200 dark:border-white/5 flex items-center px-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl shrink-0">
          <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">GIGMIND • INTENTS</span>
        </div>
      )}

      {/* Views */}
      {view === 'dashboard' && (
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 space-y-6 pb-24 md:pb-6 animate-in fade-in">
          {/* Control Bar */}
          <div className="flex flex-col md:flex-row gap-4 sticky top-0 z-10 py-2 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl md:bg-transparent -mx-4 px-4 md:-mx-6 md:px-0 md:justify-center">
            <div className="glass-panel p-1 rounded-xl flex gap-1 shrink-0 w-full md:w-auto">
              {[{ id: 'incoming', label: 'Activity' }, { id: 'mine', label: 'My Intents' }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap flex-1 md:flex-none ${activeTab === tab.id ? 'bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/20' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}`}>{tab.label}</button>
              ))}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex justify-between items-center pb-4 px-1 relative z-20">
            <div className="flex gap-2">
              <button
                onClick={() => setIsGeoOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${(filterType !== 'all' || filterLevel !== 'all' || filterGeo)
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'
                  }`}
              >
                <Filter size={16} />
                <span>Filters</span>
                {(filterType !== 'all' || filterLevel !== 'all' || filterGeo) && (
                  <span className="ml-1 bg-white text-indigo-600 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-extrabold">
                    {[(filterType !== 'all'), (filterLevel !== 'all'), (!!filterGeo)].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Active Filter Chips (Display Only) */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[200px] sm:max-w-[400px]">
              {filterType !== 'all' && <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold whitespace-nowrap border border-indigo-100 dark:border-indigo-500/30">Type: {filterType}</span>}
              {filterLevel !== 'all' && <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold whitespace-nowrap border border-indigo-100 dark:border-indigo-500/30">Level: {filterLevel}</span>}
              {filterGeo && <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-bold whitespace-nowrap border border-indigo-100 dark:border-indigo-500/30">{filterGeo.city} ({filterGeo.radius}km)</span>}
            </div>
          </div>

          <FilterBottomSheet
            isOpen={isGeoOpen}
            onClose={() => setIsGeoOpen(false)}
            filters={{ type: filterType, level: filterLevel, geo: filterGeo, city: filterGeo?.city, radius: filterGeo?.radius }}
            onApply={(newFilters) => {
              setFilterType(newFilters.type || 'all');
              setFilterLevel(newFilters.level || 'all');
              setFilterGeo(newFilters.geo);
            }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredIntents.map(intent => (
              <IntentCard key={intent.id} intent={intent} onSelect={(i) => { setSelectedIntent(i); setView('details'); }} />
            ))}
          </div>
          {filteredIntents.length === 0 && (
            <div className="text-center py-20 opacity-50"><div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-white/10"><Search size={32} className="text-slate-600" /></div><p>No signals found.</p></div>
          )}
        </div>
      )}

      {view === 'details' && selectedIntent && (
        <div className="h-full flex flex-col animate-in slide-in-from-right duration-300 bg-slate-50 dark:bg-black/20">
          <div className="p-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setView('dashboard')} className="rounded-full h-10 w-10"><ArrowLeft /></Button>
              <span className="font-bold">Details</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsShareModalOpen(true)} className="rounded-full"><Share2 size={18} /></Button>
              {selectedIntent.user === 'You' && <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(true)} className="rounded-full text-indigo-400"><Pencil size={18} /></Button>}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-3xl mx-auto w-full space-y-6">
            {/* Header / Profile */}
            <div className="flex items-start gap-4 mb-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg flex items-center justify-center text-white text-xl font-bold border border-white/20 shrink-0">
                {selectedIntent.user === 'You' ? 'ME' : (selectedIntent.level === 'L1' ? selectedIntent.avatar : <Lock />)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{selectedIntent.level === 'L1' || selectedIntent.user === 'You' ? selectedIntent.user : 'Anonymous Node'}</h1>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge color="blue">{selectedIntent.type}</Badge>
                  <Badge color={selectedIntent.level === 'L1' ? 'green' : selectedIntent.level === 'L2' ? 'amber' : 'rose'}>{selectedIntent.level}</Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1">• {selectedIntent.timestamp}</span>
                </div>
              </div>
            </div>

            {/* Context */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Signal size={120} /></div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Signal Context</h3>
              <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-medium relative z-10">"{selectedIntent.context}"</p>
              <div className="mt-4 flex flex-wrap gap-2 relative z-10">
                {selectedIntent.tags.map((t, i) => <span key={i} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs text-cyan-600 dark:text-cyan-400 font-mono">{t}</span>)}
              </div>
            </div>

            {/* Contributions */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-2"><DollarSign size={16} /> Contributions</h3>
                <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => setIsPledgeModalOpen(true)}><Plus size={12} className="mr-1" /> Pledge</Button>
              </div>
              <div className="glass-panel p-4 rounded-xl space-y-3">
                {selectedIntent.contributions && selectedIntent.contributions.length > 0 ? (
                  selectedIntent.contributions.map((c: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-black/30 rounded-lg border border-slate-200 dark:border-white/5 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{c.type === 'monetary' ? c.value : c.details}</span>
                        <Badge color={c.status === 'Received' ? 'green' : 'amber'}>{c.status || 'Pledged'}</Badge>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>By: {c.contributor || 'Anonymous'}</span>
                        <span>Return: {c.return || 'Goodwill'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-slate-500 py-2">No contributions yet.</p>
                )}
              </div>
            </div>

            {/* Channels & Networking (Visible to Owner only usually, but simplified here) */}
            {selectedIntent.user === 'You' && (
              <>
                <DiscussionChannelsMenu intent={selectedIntent} onSelectChannel={(c) => { setActiveChannel(c); setView('channel'); }} onCreateChannel={() => alert("Create Channel mock")} />
                <InviteContactsMenu />
                <InterestedUsersList intent={selectedIntent} />
              </>
            )}

            {/* Global Actions */}
            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/10">
              {selectedIntent.user === 'You' ? (
                <Button className="w-full h-12 text-lg font-bold" variant="outline" onClick={() => setIsCompleteOpen(true)}>Close Intent / Mark Status</Button>
              ) : (
                <Button className="w-full h-14 text-lg font-bold glass-button-primary bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" onClick={() => { if (!selectedIntent.isInterested) { handleUpdateIntent(selectedIntent.id, selectedIntent.context, selectedIntent.tags); /* Mock interest toggle */ } }}>
                  {selectedIntent.isInterested ? <><CheckCircle className="mr-2" /> Interest Signaled</> : <><Hand className="mr-2" /> I'm Interested</>}
                </Button>
              )}
              <p className="text-center text-[10px] text-slate-400 mt-3 px-8">By acting on this signal you agree to the GIGMIND protocols of high-trust interaction.</p>
            </div>

          </div>
        </div>
      )}

      {view === 'channel' && selectedIntent && activeChannel && (
        <DiscussionChannelView channel={activeChannel} intent={selectedIntent} onBack={() => setView('details')} />
      )}

      {/* FAB */}
      {view === 'dashboard' && (
        <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-50">
          <button onClick={startWizard} className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)] border border-white/20 transition-transform hover:scale-105 active:scale-95">
            <Plus size={28} className="md:w-8 md:h-8" />
          </button>
        </div>
      )}

    </div>
  );
};

export default GlobeWithUI;