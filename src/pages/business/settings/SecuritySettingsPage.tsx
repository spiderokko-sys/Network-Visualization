import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Save, Shield, Lock, Smartphone, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SecuritySettingsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="h-full overflow-y-auto no-scrollbar">
            <div className="max-w-4xl mx-auto px-2 md:px-6 pb-20 space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between pt-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Security Settings</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage your account security and authentication</p>
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

                    {/* Password */}
                    <div className="glass-panel p-6 rounded-xl space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Lock size={20} className="text-indigo-500" />
                            Password
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Current Password</label>
                                <Input type="password" placeholder="Enter current password" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">New Password</label>
                                <Input type="password" placeholder="Enter new password" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Confirm New Password</label>
                                <Input type="password" placeholder="Confirm new password" />
                            </div>
                            <Button variant="outline" size="sm">Update Password</Button>
                        </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="glass-panel p-6 rounded-xl space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Smartphone size={20} className="text-indigo-500" />
                                    Two-Factor Authentication
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">Add an extra layer of security to your account</p>
                            </div>
                            <span className="bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded">
                                Not Enabled
                            </span>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
                                Enable 2FA
                            </Button>
                        </div>
                    </div>

                    {/* API Keys */}
                    <div className="glass-panel p-6 rounded-xl space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Key size={20} className="text-indigo-500" />
                                    API Keys
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">Manage API keys for integrations</p>
                            </div>
                            <Button variant="outline" size="sm">Generate New Key</Button>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-slate-900 dark:text-white text-sm">Production API Key</div>
                                        <div className="text-xs text-slate-500 mt-1 font-mono">sk_prod_••••••••••••••••</div>
                                    </div>
                                    <Button variant="outline" size="sm" className="text-xs">Revoke</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="glass-panel p-6 rounded-xl space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Shield size={20} className="text-indigo-500" />
                                    Active Sessions
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">Manage your active login sessions</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="font-medium text-slate-900 dark:text-white text-sm flex items-center gap-2">
                                            Windows PC - Chrome
                                            <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Current</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">New York, USA • Last active: Now</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="font-medium text-slate-900 dark:text-white text-sm">iPhone - Safari</div>
                                        <div className="text-xs text-slate-500 mt-1">New York, USA • Last active: 2 hours ago</div>
                                    </div>
                                    <Button variant="outline" size="sm" className="text-xs text-red-600 hover:text-red-700">End Session</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
