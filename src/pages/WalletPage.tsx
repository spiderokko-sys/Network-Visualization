import { useState } from 'react';
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Plus,
    History,
    CreditCard,
    Send,
    QrCode,
    DollarSign,
    MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ScrollArea } from '../components/ui/scroll-area';
import { TransactionDetails } from '../components/wallet/TransactionDetails';
import { TransactionHistory } from '../components/wallet/TransactionHistory';

const MOCK_TRANSACTIONS = [
    { id: 1, type: 'receive', name: 'Alice M.', amount: 45.50, date: 'Today, 10:23 AM', status: 'Completed', avatar: 'AM' },
    { id: 2, type: 'send', name: 'Vendor Supplies Co.', amount: 120.00, date: 'Yesterday', status: 'Completed', avatar: 'VS' },
    { id: 3, type: 'deposit', name: 'Top Up', amount: 500.00, date: 'Nov 20', status: 'Completed', avatar: 'TP' },
    { id: 4, type: 'send', name: 'Hosting Service', amount: 29.99, date: 'Nov 18', status: 'Completed', avatar: 'HS' },
    { id: 5, type: 'receive', name: 'Bob D.', amount: 15.00, date: 'Nov 15', status: 'Completed', avatar: 'BD' },
];

export const WalletScreen = () => {
    const [balance] = useState(1250.75);
    const [amount, setAmount] = useState('');
    const [activeTab, setActiveTab] = useState('send');

    // View state management
    const [viewState, setViewState] = useState<{
        mode: 'dashboard' | 'history' | 'details',
        data?: any,
        previousMode?: 'dashboard' | 'history'
    }>({ mode: 'dashboard' });

    // Handlers
    const navigateTo = (mode: 'dashboard' | 'history' | 'details', data?: any) => {
        setViewState(prev => ({
            mode,
            data,
            previousMode: (mode === 'details' ? prev.mode : undefined) as 'dashboard' | 'history' | undefined
        }));
    };

    const handleBack = () => {
        if (viewState.mode === 'details') {
            setViewState(prev => ({ mode: prev.previousMode || 'dashboard' }));
        } else {
            setViewState({ mode: 'dashboard' });
        }
    };

    // Render Logic
    if (viewState.mode === 'details' && viewState.data) {
        return <TransactionDetails transaction={viewState.data} onBack={handleBack} />;
    }

    if (viewState.mode === 'history') {
        return (
            <TransactionHistory
                onBack={handleBack}
                onSelectTransaction={(tx) => navigateTo('details', tx)}
            />
        );
    }

    return (
        <div className="h-full flex flex-col bg-slate-950 text-slate-100 p-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 animate-in slide-in-from-top-4 duration-500 shrink-0">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <div className="p-3 bg-pink-500/20 rounded-2xl text-pink-400 ring-1 ring-pink-500/30">
                            <Wallet size={32} />
                        </div>
                        Digital Wallet
                    </h2>
                    <p className="text-slate-400 mt-1 ml-1">Manage your funds and transactions</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="border-white/10 hover:bg-white/5 text-slate-300"
                        onClick={() => navigateTo('history')}
                    >
                        <History className="mr-2 h-4 w-4" /> History
                    </Button>
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 text-slate-300">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-6 overflow-y-auto lg:overflow-hidden pb-20 lg:pb-0">

                {/* Balance Card Section (Full Width) */}
                <div className="shrink-0 animate-in slide-in-from-left-4 duration-500 delay-100">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-5 md:p-8 shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                            <div>
                                <h3 className="text-indigo-100/80 font-medium text-lg mb-1">Total Balance</h3>
                                <div className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                    ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 md:gap-4">
                                <Button
                                    className={`h-10 md:h-12 px-4 md:px-6 rounded-xl font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95 border-0 ${activeTab === 'deposit' ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-indigo-500/30 text-white hover:bg-indigo-500/40'}`}
                                    onClick={() => setActiveTab('deposit')}
                                >
                                    <Plus className="mr-2 h-5 w-5" /> Deposit
                                </Button>
                                <Button
                                    className={`h-10 md:h-12 px-4 md:px-6 rounded-xl font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95 border-0 ${activeTab === 'send' ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-indigo-500/30 text-white hover:bg-indigo-500/40'}`}
                                    onClick={() => setActiveTab('send')}
                                >
                                    <ArrowUpRight className="mr-2 h-5 w-5" /> Send
                                </Button>
                                <Button
                                    className={`h-10 md:h-12 px-4 md:px-6 rounded-xl font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95 border-0 ${activeTab === 'request' ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-indigo-500/30 text-white hover:bg-indigo-500/40'}`}
                                    onClick={() => setActiveTab('request')}
                                >
                                    <ArrowDownLeft className="mr-2 h-5 w-5" /> Request
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid: Tabs & Recent Activity */}
                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500 delay-200">

                    {/* Actions Panel */}
                    <Card className="flex flex-col h-[600px] lg:h-full bg-slate-900/50 border-white/5 backdrop-blur-xl">
                        <CardContent className="p-6 h-full flex flex-col">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                                <TabsList className="grid w-full grid-cols-4 bg-slate-950/50 p-1 mb-6 rounded-xl shrink-0">
                                    <TabsTrigger value="send" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white rounded-lg">Send</TabsTrigger>
                                    <TabsTrigger value="deposit" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-lg">Deposit</TabsTrigger>
                                    <TabsTrigger value="request" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white rounded-lg">Request</TabsTrigger>
                                    <TabsTrigger value="receive" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-lg">Receive</TabsTrigger>
                                </TabsList>

                                <ScrollArea className="flex-1 pr-4 -mr-4">
                                    <div className="pb-24 md:pb-0">
                                        {/* Send Tab */}
                                        <TabsContent value="send" className="mt-0 space-y-4 animate-in fade-in duration-300">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-400">Recipient</label>
                                                <div className="relative">
                                                    <Input placeholder="Email, username, or address" className="bg-slate-950/50 border-white/10 focus:border-indigo-500/50 h-12 pl-10" />
                                                    <Send className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-400">Amount</label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        className="bg-slate-950/50 border-white/10 focus:border-indigo-500/50 h-12 pl-10 text-lg font-mono"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                    />
                                                    <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-400">Note (Optional)</label>
                                                <Input placeholder="What is this for?" className="bg-slate-950/50 border-white/10 focus:border-indigo-500/50 h-12" />
                                            </div>
                                            <div className="pt-4">
                                                <Button className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20 shadow-lg" disabled={!amount}>
                                                    Send Funds
                                                </Button>
                                            </div>
                                        </TabsContent>

                                        {/* Deposit Tab */}
                                        <TabsContent value="deposit" className="mt-0 space-y-4 animate-in fade-in duration-300">
                                            <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xl mb-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <CreditCard className="text-emerald-400" />
                                                    <h4 className="font-semibold text-emerald-100">Linked Card</h4>
                                                </div>
                                                <p className="text-sm text-slate-400">Visa ending in 4242</p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-400">Deposit Amount</label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        className="bg-slate-950/50 border-white/10 focus:border-emerald-500/50 h-12 pl-10 text-lg font-mono"
                                                    />
                                                    <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                                                </div>
                                            </div>
                                            <div className="pt-4">
                                                <Button className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 shadow-lg">
                                                    Add Funds
                                                </Button>
                                            </div>
                                        </TabsContent>

                                        {/* Request Tab */}
                                        <TabsContent value="request" className="mt-0 space-y-4 animate-in fade-in duration-300">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-400">Request from</label>
                                                <div className="relative">
                                                    <Input placeholder="Email or username" className="bg-slate-950/50 border-white/10 focus:border-pink-500/50 h-12 pl-10" />
                                                    <ArrowDownLeft className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-400">Amount</label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        className="bg-slate-950/50 border-white/10 focus:border-pink-500/50 h-12 pl-10 text-lg font-mono"
                                                    />
                                                    <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                                                </div>
                                            </div>
                                            <div className="bg-pink-500/10 border border-pink-500/20 rounded-xl p-4 text-sm text-pink-200">
                                                A request link will be generated and sent to this user next.
                                            </div>
                                            <div className="pt-4">
                                                <Button className="w-full h-12 text-lg bg-pink-600 hover:bg-pink-700 shadow-pink-500/20 shadow-lg">
                                                    Send Request
                                                </Button>
                                            </div>
                                        </TabsContent>

                                        {/* Receive Tab */}
                                        <TabsContent value="receive" className="mt-0 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300 text-center py-4">
                                            <div className="p-6 bg-white rounded-2xl shadow-xl">
                                                <QrCode className="w-48 h-48 text-slate-900" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-400 mb-2">Scan to pay</p>
                                                <div className="flex items-center gap-2 p-3 bg-slate-950/50 rounded-xl border border-white/10">
                                                    <code className="text-slate-300 font-mono text-sm">0x71C...9A23</code>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10">
                                                        <span className="sr-only">Copy</span>
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    </Button>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </div>
                                </ScrollArea>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Recent Activity Card */}
                    <Card className="flex flex-col h-[600px] lg:h-full bg-slate-900/50 border-white/5 backdrop-blur-xl">
                        <CardHeader className="shrink-0">
                            <CardTitle className="text-lg font-medium text-white">Recent Activity</CardTitle>
                            <CardDescription className="text-slate-400">Latest transactions</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 min-h-0">
                            <ScrollArea className="h-full px-6">
                                <div className="space-y-4 pr-4 pb-24 md:pb-4">
                                    {MOCK_TRANSACTIONS.map((tx) => (
                                        <div
                                            key={tx.id}
                                            className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-colors -mx-2 bg-white/[0.02]"
                                            onClick={() => navigateTo('details', tx)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`
                                                    h-10 w-10 rounded-full flex items-center justify-center ring-2 ring-white/5 transition-all group-hover:scale-110
                                                    ${tx.type === 'receive' || tx.type === 'deposit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}
                                                `}>
                                                    {tx.type === 'receive' || tx.type === 'deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{tx.name}</p>
                                                    <p className="text-xs text-slate-500">{tx.date}</p>
                                                </div>
                                            </div>
                                            <div className={`text-sm font-semibold ${tx.type === 'receive' || tx.type === 'deposit' ? 'text-emerald-400' : 'text-slate-200'}`}>
                                                {tx.type === 'receive' || tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <div className="p-6 border-t border-white/5 mt-auto shrink-0">
                            <Button
                                variant="ghost"
                                className="w-full text-slate-400 hover:text-white hover:bg-white/5"
                                onClick={() => navigateTo('history')}
                            >
                                View All Transactions
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
