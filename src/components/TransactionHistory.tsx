import React, { useState } from 'react';
import {
    ArrowLeft,
    Search,
    Filter,
    ArrowDownLeft,
    ArrowUpRight,
    Calendar,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Expanded mock data
const ALL_TRANSACTIONS = [
    { id: 1, type: 'receive', name: 'Alice M.', amount: 45.50, date: 'Today, 10:23 AM', status: 'Completed', avatar: 'AM' },
    { id: 2, type: 'send', name: 'Vendor Supplies Co.', amount: 120.00, date: 'Yesterday, 2:15 PM', status: 'Completed', avatar: 'VS' },
    { id: 3, type: 'deposit', name: 'Top Up', amount: 500.00, date: 'Nov 20, 2024', status: 'Completed', avatar: 'TP' },
    { id: 4, type: 'send', name: 'Hosting Service', amount: 29.99, date: 'Nov 18, 2024', status: 'Completed', avatar: 'HS' },
    { id: 5, type: 'receive', name: 'Bob D.', amount: 15.00, date: 'Nov 15, 2024', status: 'Completed', avatar: 'BD' },
    { id: 6, type: 'send', name: 'Coffee Bean Direct', amount: 240.50, date: 'Nov 12, 2024', status: 'Completed', avatar: 'CB' },
    { id: 7, type: 'receive', name: 'Sarah J.', amount: 85.00, date: 'Nov 10, 2024', status: 'Completed', avatar: 'SJ' },
    { id: 8, type: 'send', name: 'Utility Bill', amount: 150.00, date: 'Nov 05, 2024', status: 'Completed', avatar: 'UB' },
    { id: 9, type: 'receive', name: 'Event Booking', amount: 1200.00, date: 'Oct 28, 2024', status: 'Completed', avatar: 'EB' },
    { id: 10, type: 'send', name: 'Office Supplies', amount: 65.20, date: 'Oct 25, 2024', status: 'Completed', avatar: 'OS' },
    { id: 11, type: 'receive', name: 'Charlie', amount: 12.50, date: 'Oct 22, 2024', status: 'Completed', avatar: 'C' },
    { id: 12, type: 'deposit', name: 'Bank Transfer', amount: 1000.00, date: 'Oct 15, 2024', status: 'Completed', avatar: 'BT' },
];

interface TransactionHistoryProps {
    onBack: () => void;
    onSelectTransaction: (tx: any) => void;
}

export const TransactionHistory = ({ onBack, onSelectTransaction }: TransactionHistoryProps) => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = ALL_TRANSACTIONS.filter(tx => {
        const matchesFilter = filter === 'all' ||
            (filter === 'incoming' && (tx.type === 'receive' || tx.type === 'deposit')) ||
            (filter === 'outgoing' && tx.type === 'send');

        const matchesSearch = tx.name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="h-full flex flex-col bg-slate-950 text-slate-100 p-6 animate-in slide-in-from-bottom-8 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                        <ArrowLeft size={24} />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Transaction History</h2>
                        <p className="text-slate-400 text-sm">View and manage your financial activity</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300">
                        <Calendar className="mr-2 h-4 w-4" /> Date Range
                    </Button>
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 shrink-0">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search transactions..."
                        className="pl-9 bg-slate-900/50 border-white/10 focus:border-indigo-500/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg border border-white/5">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-md hover:bg-white/5 ${filter === 'all' ? 'bg-white/10 text-white' : 'text-slate-400'}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-md hover:bg-white/5 ${filter === 'incoming' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400'}`}
                        onClick={() => setFilter('incoming')}
                    >
                        Incoming
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-md hover:bg-white/5 ${filter === 'outgoing' ? 'bg-rose-500/10 text-rose-400' : 'text-slate-400'}`}
                        onClick={() => setFilter('outgoing')}
                    >
                        Outgoing
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 min-h-0 bg-slate-900/30 rounded-2xl border border-white/5 backdrop-blur-sm overflow-hidden flex flex-col">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-sm font-medium text-slate-400">
                    <div className="col-span-5 md:col-span-4 pl-2">Transaction</div>
                    <div className="col-span-3 md:col-span-2 hidden md:block">Type</div>
                    <div className="col-span-3 md:col-span-3 text-right md:text-left">Date</div>
                    <div className="col-span-2 hidden md:block text-center">Status</div>
                    <div className="col-span-4 md:col-span-3 text-right pr-4">Amount</div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-2">
                        {filteredTransactions.map((tx) => (
                            <div
                                key={tx.id}
                                className="grid grid-cols-12 gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group items-center"
                                onClick={() => onSelectTransaction(tx)}
                            >
                                {/* Name & Icon */}
                                <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                                    <div className={`
                                        h-10 w-10 rounded-full flex items-center justify-center shrink-0
                                        ${tx.type === 'receive' || tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}
                                    `}>
                                        {tx.type === 'receive' || tx.type === 'deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                    </div>
                                    <div className="truncate">
                                        <div className="font-medium text-slate-200 group-hover:text-white truncate">{tx.name}</div>
                                        <div className="text-xs text-slate-500 md:hidden">{tx.date}</div>
                                    </div>
                                </div>

                                {/* Type */}
                                <div className="col-span-2 hidden md:flex items-center text-sm text-slate-400 capitalize">
                                    {tx.type}
                                </div>

                                {/* Date */}
                                <div className="col-span-3 hidden md:flex items-center text-sm text-slate-400">
                                    {tx.date}
                                </div>

                                {/* Status */}
                                <div className="col-span-2 hidden md:flex items-center justify-center">
                                    <Badge variant="outline" className="bg-emerald-500/5 text-emerald-400 border-emerald-500/20 text-[10px] uppercase tracking-wide">
                                        {tx.status}
                                    </Badge>
                                </div>

                                {/* Amount */}
                                <div className="col-span-4 md:col-span-3 text-right pr-2">
                                    <span className={`font-semibold ${tx.type === 'receive' || tx.type === 'deposit' ? 'text-emerald-400' : 'text-slate-200'}`}>
                                        {tx.type === 'receive' || tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {filteredTransactions.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                <Search size={48} className="mb-4 opacity-20" />
                                <p>No transactions found matching your criteria</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Footer / Pagination Placeholder */}
                <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                    <div>Showing {filteredTransactions.length} results</div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" disabled className="h-8 text-slate-500">Previous</Button>
                        <Button variant="ghost" size="sm" className="h-8 text-slate-300 hover:text-white">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
