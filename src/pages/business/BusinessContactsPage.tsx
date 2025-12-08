import { useState } from 'react';
import { DollarSign, FileText, PlusCircle, Edit2, Heart, Phone, CalendarDays } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { AddCustomerModal } from '../../components/modals/AddCustomerModal';
import { FinancialModal } from '../../components/modals/FinancialModal';
import { MOCK_CUSTOMERS } from '../../data/mockData';

export const BusinessContactsPage = () => {
    const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [showFinancialModal, setShowFinancialModal] = useState(false);
    const [financialType, setFinancialType] = useState('payment');

    const handleAddCustomer = (data: any) => {
        if (data.id) {
            // Edit existing
            setCustomers(customers.map((c: any) => c.id === data.id ? {
                ...c,
                name: data.name,
                tags: data.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t),
                emails: data.email ? [{ ...c.emails[0], value: data.email }] : c.emails,
                phones: data.phone ? [{ ...c.phones[0], value: data.phone }] : c.phones,
            } : c));
        } else {
            // Add new
            const newCust = {
                id: Date.now(),
                name: data.name,
                status: 'L1',
                tags: data.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t),
                visits: 0,
                last_seen: 'Just added',
                emails: data.email ? [{ id: Date.now() + 'e', value: data.email, isPrimary: true }] : [],
                phones: data.phone ? [{ id: Date.now() + 'p', value: data.phone, isPrimary: true }] : [],
                memberSince: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
                isFavorite: false
            };
            setCustomers([newCust, ...customers]);
        }
        setShowAddCustomer(false);
        setEditingCustomer(null);
    };

    const toggleFavorite = (e: any, id: number) => {
        e.stopPropagation();
        setCustomers(customers.map((c: any) => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
    };

    const openFinancialModal = (type: string) => {
        setFinancialType(type);
        setShowFinancialModal(true);
    };

    const handleSaveFinancial = (data: any) => {
        console.log('Saving financial transaction:', data);
        setShowFinancialModal(false);
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar min-h-0">
            <div className="px-4 md:px-6 pt-0 space-y-4 md:space-y-6 pb-28 max-w-7xl mx-auto">
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            className="h-16 bg-emerald-600/80 hover:bg-emerald-500 font-bold text-lg text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-500/30"
                            onClick={() => openFinancialModal('payment')}
                        >
                            <DollarSign className="mr-2" /> Receive $
                        </Button>
                        <Button
                            className="h-16 bg-indigo-600/80 hover:bg-indigo-500 font-bold text-lg text-white shadow-[0_0_20px_rgba(99,102,241,0.2)] border border-indigo-500/30"
                            onClick={() => openFinancialModal('invoice')}
                        >
                            <FileText className="mr-2" /> Send Invoice
                        </Button>
                    </div>

                    <div className="flex justify-between items-center mt-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">L1 Direct Nodes</h3>
                        <Button size="sm" variant="ghost" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20" onClick={() => { setEditingCustomer(null); setShowAddCustomer(true); }}>
                            <PlusCircle size={16} className="mr-2" /> Add Contact
                        </Button>
                    </div>

                    <div className="glass-panel rounded-2xl overflow-hidden">
                        {customers.map((cust: any, idx: number) => (
                            <div
                                key={cust.id}
                                className={`
									p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group
									${idx !== customers.length - 1 ? 'border-b border-slate-200 dark:border-white/5' : ''}
								`}
                            >
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-white/10 flex items-center justify-center text-lg font-bold text-indigo-700 dark:text-white shadow-md">
                                    {cust.name[0]}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{cust.name}</span>
                                        {cust.isFavorite && <Heart size={12} className="text-rose-500 fill-rose-500" />}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                                        {cust.phones && cust.phones[0] && (
                                            <span className="flex items-center gap-1"><Phone size={10} /> {cust.phones[0].value}</span>
                                        )}
                                        <span className="flex items-center gap-1 opacity-50"><CalendarDays size={10} /> {cust.memberSince}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {cust.tags && cust.tags.slice(0, 2).map((tag: string, i: number) => (
                                        <span key={i} className="text-[10px] px-2 py-0.5 rounded border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10" onClick={(e) => { e.stopPropagation(); setEditingCustomer(cust); setShowAddCustomer(true); }}>
                                        <Edit2 size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10" onClick={(e) => toggleFavorite(e, cust.id)}>
                                        <Heart size={16} className={cust.isFavorite ? "fill-rose-500 text-rose-500" : ""} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {showAddCustomer && <AddCustomerModal onClose={() => { setShowAddCustomer(false); setEditingCustomer(null); }} onSave={handleAddCustomer} initialData={editingCustomer} />}
                {showFinancialModal && <FinancialModal type={financialType} initialCustomer={null} customers={customers} onClose={() => setShowFinancialModal(false)} onSave={handleSaveFinancial} />}
            </div>
        </div>
    );
};
