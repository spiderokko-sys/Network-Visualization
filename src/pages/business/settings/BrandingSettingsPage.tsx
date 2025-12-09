import { Button } from '../../../components/ui/button';
import { Save, Palette, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BrandingSettingsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <div className="max-w-4xl mx-auto px-4 md:px-6 pb-20 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between pt-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Branding & Theme</h1>
                        <p className="text-slate-500 text-sm mt-1">Customize your business appearance and brand identity</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/business/settings')}
                            className="text-slate-600 dark:text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                            <Save size={16} />
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="glass-panel p-6 rounded-xl space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Palette size={20} className="text-indigo-500" />
                            Brand Colors
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3 block">Primary Brand Color</label>
                                <div className="flex gap-3 flex-wrap">
                                    {['bg-indigo-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 'bg-purple-600', 'bg-slate-900', 'bg-blue-600', 'bg-pink-600'].map((color, i) => (
                                        <button
                                            key={i}
                                            className={`w-12 h-12 rounded-xl ${color} shadow-lg ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ${i === 0 ? 'ring-slate-400 scale-110' : 'ring-transparent hover:ring-slate-200'} transition-all`}
                                            title={color.replace('bg-', '').replace('-600', '')}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Building2 size={20} className="text-indigo-500" />
                            Logo & Assets
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Business Logo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-white/20 text-slate-400">
                                        <Building2 size={32} />
                                    </div>
                                    <div className="flex-1">
                                        <Button variant="outline" size="sm">Upload New Logo</Button>
                                        <p className="text-xs text-slate-500 mt-2">Recommended: Square image, at least 512x512px</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Favicon</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-white/20 text-slate-400">
                                        <Building2 size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <Button variant="outline" size="sm">Upload Favicon</Button>
                                        <p className="text-xs text-slate-500 mt-2">Recommended: 32x32px or 64x64px</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
