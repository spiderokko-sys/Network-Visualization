import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Layers, Circle, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { EditCircleModal } from '../../components/modals/EditCircleModal';

const INITIAL_CIRCLES = [
    { id: 'l1', name: 'L1: Inner Orbit', type: 'system', count: 142, color: 'emerald', desc: 'Directly connected customers.' },
    { id: 'l2', name: 'L2: Social Halo', type: 'system', count: 4820, color: 'amber', desc: 'Friends of your customers.' },
    { id: 'l3', name: 'L3: Deep Network', type: 'system', count: 25420, color: 'slate', desc: 'Anonymous reach in region.' },
    { id: 'c1', name: 'Weekend Regulars', type: 'custom', count: 45, color: 'indigo', desc: 'Visit Sat/Sun > 2 times/mo' },
    { id: 'c2', name: 'Local Tech Workers', type: 'custom', count: 850, color: 'cyan', desc: 'Tag: Tech + Geo: <1km' },
];

// Helper to get circle-specific colors that work in both themes
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

export const BusinessCirclesPage = () => {
    const navigate = useNavigate();
    const [circles, setCircles] = useState(INITIAL_CIRCLES);
    const [showEditCircleModal, setShowEditCircleModal] = useState(false);
    const [editingCircle, setEditingCircle] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDeleteCircle = (id: string) => {
        setCircles(circles.filter(c => c.id !== id));
    };

    const handleEditCircle = (updatedCircle: any) => {
        setCircles(circles.map(c => c.id === updatedCircle.id ? updatedCircle : c));
        setShowEditCircleModal(false);
        setEditingCircle(null);
    };

    const openEditCircle = (circle: any) => {
        setEditingCircle(circle);
        setShowEditCircleModal(true);
    };

    // Filter circles based on search term
    const filteredCircles = useMemo(() => {
        if (!searchTerm.trim()) return circles;

        const lowerSearch = searchTerm.toLowerCase();
        return circles.filter(circle =>
            circle.name.toLowerCase().includes(lowerSearch) ||
            circle.desc.toLowerCase().includes(lowerSearch)
        );
    }, [circles, searchTerm]);

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-2 md:px-6 pt-0 space-y-2 md:space-y-6 pb-28 max-w-7xl mx-auto">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center gap-4">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Network Circles</h3>
                        <Button size="sm" variant="outline" className="glass-button"><PlusCircle size={16} className="mr-2" /> New Circle</Button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                        <Input
                            type="text"
                            placeholder="Circle name, Contact details, Phone number, E-mail"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 glass-card border-slate-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-400"
                        />
                    </div>

                    <div className="grid gap-3 sm:gap-4">
                        {filteredCircles.map(circle => (
                            <div
                                key={circle.id}
                                className="glass-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 relative group overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                                onClick={() => navigate(`/business/circles/${circle.id}`)}
                            >
                                {/* Type Label */}
                                {circle.type === 'custom' && (
                                    <div className="absolute top-0 right-0 px-2 py-1 sm:px-3 bg-indigo-500 dark:bg-indigo-600/80 text-[10px] font-bold text-white rounded-bl-xl shadow-lg z-10">
                                        CUSTOM
                                    </div>
                                )}

                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className={`h-12 w-12 sm:h-16 sm:w-16 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${getCircleIconColors(circle.color)}`}>
                                        {circle.type === 'system' ? <Layers size={24} className="sm:w-7 sm:h-7" /> : <Circle size={24} className="sm:w-7 sm:h-7" />}
                                    </div>

                                    {/* Mobile Only: Title next to icon */}
                                    <div className="sm:hidden flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{circle.name}</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{circle.desc}</p>
                                    </div>
                                </div>

                                <div className="hidden sm:block flex-1 min-w-0">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{circle.name}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{circle.desc}</p>
                                </div>

                                <div className="w-full sm:w-auto flex justify-between items-center sm:block sm:text-right sm:pl-4 sm:border-l border-slate-200 dark:border-white/5">
                                    <span className="sm:hidden text-xs font-bold text-slate-500 dark:text-slate-500 uppercase">Total Nodes</span>
                                    <div>
                                        <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{circle.count.toLocaleString()}</div>
                                        <div className="hidden sm:block text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Nodes</div>
                                    </div>
                                </div>

                                {/* Actions Overlay */}
                                {circle.type === 'custom' && (
                                    <div className="absolute right-2 bottom-2 sm:right-4 sm:bottom-4 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => { e.stopPropagation(); openEditCircle(circle); }} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-600 text-slate-700 dark:text-white hover:text-indigo-600 dark:hover:text-white rounded-lg transition-colors shadow-md"><Edit2 size={14} /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteCircle(circle.id); }} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-600 text-slate-700 dark:text-white hover:text-rose-600 dark:hover:text-white rounded-lg transition-colors shadow-md"><Trash2 size={14} /></button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {showEditCircleModal && editingCircle && <EditCircleModal circle={editingCircle} onClose={() => { setShowEditCircleModal(false); setEditingCircle(null); }} onSave={handleEditCircle} />}
            </div>
        </div>
    );
};
