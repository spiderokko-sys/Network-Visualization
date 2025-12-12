import React, { useState } from 'react';
import { Hand, Gift, Flag, Sparkles, Loader2, X } from 'lucide-react';
import { Button } from '../ui/button';

// --- Types ---
// Ideally these should be in a shared types file
export interface Intent {
    id: number | string;
    type: 'ask' | 'offer' | 'rally' | string; // Allow string for compatibility
    level: string; // L1, L2, L3
    context: string;
    tags: string[];
    user: string;
    avatar: string | React.ReactNode;
    imageUrl?: string;
    endorsedBy?: string | null;
    timestamp: string;
    status: string; // Relaxed from union
    contributions?: any[]; // Simplified
    channels?: any[]; // Simplified
    outcome?: {
        reason: string;
        comment: string;
        rating: number;
    };
    isInterested?: boolean;
    location?: {
        city: string;
        country: string;
        lat: number;
        lng: number;
        distance?: number;
    };
}

// --- Reusable Glass Modal Wrapper ---
// Only exported if needed elsewhere, but typically internal to this module if we wrap everything
export const GlassModal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-slate-200 dark:border-white/5 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl z-10">
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

// --- Edit Intent Modal ---
export const EditIntentModal = ({ isOpen, onClose, intent, onSave }: { isOpen: boolean, onClose: () => void, intent: Intent, onSave: (id: number | string, context: string, tags: string[]) => void }) => {
    const [context, setContext] = useState(intent.context);
    const [tagsString, setTagsString] = useState(intent.tags.join(', '));
    const [isPolishing, setIsPolishing] = useState(false);

    // Re-sync if intent changes while modal is closed/re-opened
    React.useEffect(() => {
        if (isOpen) {
            setContext(intent.context);
            setTagsString(intent.tags.join(', '));
        }
    }, [isOpen, intent]);

    const handlePolish = async () => {
        if (context.length < 5) return;
        setIsPolishing(true);

        // Simulating AI
        setTimeout(() => {
            setContext(prev => prev.trim() + " (Polished)");
            setIsPolishing(false);
        }, 1000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedTags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        onSave(intent.id, context, updatedTags);
        onClose();
    };

    return (
        <GlassModal isOpen={isOpen} onClose={onClose} title={`Edit ${intent.type.toUpperCase()}`}>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Context</label>
                        <button
                            type="button"
                            onClick={handlePolish}
                            disabled={isPolishing || context.length < 5}
                            className="text-xs flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 rounded-lg transition-all disabled:opacity-50"
                        >
                            {isPolishing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            {isPolishing ? "Polishing..." : "Refine with AI"}
                        </button>
                    </div>
                    <textarea
                        rows={4}
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-700 dark:text-slate-300 text-sm outline-none resize-none"
                        required
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Tags (Comma Separated)</label>
                    <input
                        type="text"
                        value={tagsString}
                        onChange={(e) => setTagsString(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-700 dark:text-slate-300 text-sm outline-none"
                        placeholder="e.g. Skill, Location, Urgency"
                        required
                    />
                </div>

                <Button type="submit" className="w-full glass-button-primary">Save Changes</Button>
            </form>
        </GlassModal>
    );
};

// --- Wizard Steps ---

const WizardStep1 = ({ onNext, updateData }: { onNext: () => void, updateData: (data: any) => void }) => {
    const archetypes = [
        { id: 'ask', title: 'The Ask', icon: Hand, sub: 'I need help or resources' },
        { id: 'offer', title: 'The Offer', icon: Gift, sub: 'I have skills/goods to give' },
        { id: 'rally', title: 'The Rally', icon: Flag, sub: 'I am gathering people' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Step 1: Define the Intent</h2>
            <p className="text-slate-400 text-sm mb-6">Select a archetype for your signal.</p>
            <div className="space-y-4">
                {archetypes.map((type) => (
                    <button key={type.id} onClick={() => { updateData({ type: type.id }); onNext(); }} className="w-full p-4 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 rounded-xl text-left transition-all group relative overflow-hidden backdrop-blur-md">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><type.icon size={64} /></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:border-indigo-500 group-hover:text-indigo-400 transition-colors shadow-inner"><type.icon size={24} /></div>
                            <div><h3 className="font-bold text-slate-900 dark:text-slate-200 text-lg">{type.title}</h3><p className="text-slate-500 dark:text-slate-400 text-sm">{type.sub}</p></div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const WizardStep2 = ({ onNext, onBack, data, updateData }: { onNext: () => void, onBack: () => void, data: any, updateData: (data: any) => void }) => {
    const [localTags, setLocalTags] = useState({ skill: data.tempTags?.skill || '', location: data.tempTags?.location || '', urgency: data.tempTags?.urgency || 'Medium' });
    const [context, setContext] = useState(data.context || '');
    const [isPolishing, setIsPolishing] = useState(false);

    const isValid = localTags.skill && localTags.location && context.length > 10;

    const handlePolish = async () => {
        if (context.length < 5) return;
        setIsPolishing(true);
        // Simulating AI
        setTimeout(() => {
            setContext(prev => prev.trim() + " (AI Polished)");
            setIsPolishing(false);
        }, 800);
    };

    return (
        <div className="animate-in fade-in slide-in-from-right duration-500">
            <div className="flex justify-between items-end mb-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Step 2: Details</h2>
                <button onClick={handlePolish} disabled={isPolishing} className="text-xs flex items-center gap-1 text-indigo-500 dark:text-indigo-400 font-bold uppercase"><Sparkles size={12} /> Auto-Fill</button>
            </div>

            <div className="space-y-4 mb-6">
                <div><label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Context</label>
                    <textarea className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-slate-200 text-sm h-24 resize-none outline-none" placeholder="Describe your intent..." value={context} onChange={(e) => setContext(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Topic</label><input type="text" className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-slate-200 outline-none" value={localTags.skill} onChange={(e) => setLocalTags({ ...localTags, skill: e.target.value })} /></div>
                    <div><label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Location</label><input type="text" className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-900 dark:text-slate-200 outline-none" value={localTags.location} onChange={(e) => setLocalTags({ ...localTags, location: e.target.value })} /></div>
                </div>
            </div>
            <div className="flex gap-3"><Button variant="secondary" onClick={onBack}>Back</Button><Button onClick={() => { updateData({ tempTags: localTags, tags: [localTags.skill, localTags.location, `Urgency: ${localTags.urgency}`], context }); onNext(); }} disabled={!isValid} className="w-full glass-button-primary">Next Step</Button></div>
        </div>
    );
};

const WizardStep3 = ({ onBack, onSubmit }: { onBack: () => void, onSubmit: (level: number) => void }) => {
    const [level, setLevel] = useState(1);
    return (
        <div className="animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Step 3: Blast Radius</h2>
            <div className="flex justify-between items-center mb-8 relative px-4"><div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 dark:bg-white/10 -z-10 rounded-full"></div>{[1, 2, 3].map((l) => (<button key={l} onClick={() => setLevel(l)} className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 backdrop-blur-md ${level === l ? 'bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400 scale-110 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-100 dark:bg-black/40 border-slate-200 dark:border-white/10 text-slate-500 hover:border-slate-300 dark:hover:border-white/30'}`}><span className="font-bold font-mono">L{l}</span></button>))}</div>
            <div className="p-5 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 backdrop-blur-md mb-8"><h3 className="font-bold text-slate-900 dark:text-white mb-1">Level {level} Propagation</h3><p className="text-slate-500 dark:text-slate-400 text-sm">Warnings and social costs apply based on depth.</p></div>
            <div className="flex gap-3"><Button variant="secondary" onClick={onBack}>Back</Button><Button onClick={() => onSubmit(level)} className="w-full bg-white text-black hover:bg-slate-200">Broadcast</Button></div>
        </div>
    );
};

// --- Intent Wizard (Public Export) ---

export const IntentWizard = ({ isOpen, onClose, onFinish }: { isOpen: boolean, onClose: () => void, onFinish: (data: any) => void }) => {
    const [step, setStep] = useState(1);
    const [wizardData, setWizardData] = useState<any>({});

    // Reset
    React.useEffect(() => { if (!isOpen) { setStep(1); setWizardData({}); } }, [isOpen]);

    if (!isOpen) return null;

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);
    const updateData = (data: any) => setWizardData((prev: any) => ({ ...prev, ...data }));
    const handleSubmit = (level: number) => {
        onFinish({ ...wizardData, level: `L${level}` });
        onClose();
    };

    return (
        <GlassModal isOpen={isOpen} onClose={onClose} title="Create Intent">
            {step === 1 && <WizardStep1 onNext={handleNext} updateData={updateData} />}
            {step === 2 && <WizardStep2 onNext={handleNext} onBack={handleBack} data={wizardData} updateData={updateData} />}
            {step === 3 && <WizardStep3 onBack={handleBack} onSubmit={handleSubmit} />}
        </GlassModal>
    );
};
