import React from 'react';
import {
    ArrowLeft,
    ArrowUpRight,
    ArrowDownLeft,
    CheckCircle2,
    Clock,
    Download,
    HelpCircle,
    Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const TransactionDetails = ({ transaction, onBack }: { transaction: any, onBack: () => void }) => {
    const isIncoming = transaction.type === 'receive' || transaction.type === 'deposit';

    return (
        <div className="h-full flex flex-col bg-slate-950 text-slate-100 p-6 overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                    <ArrowLeft size={24} />
                </Button>
                <h2 className="text-2xl font-bold text-white">Transaction Details</h2>
            </div>

            <div className="flex-1 flex flex-col items-center max-w-2xl mx-auto w-full">

                {/* Main Status & Amount */}
                <div className="flex flex-col items-center mb-8">
                    <div className={`
                        w-20 h-20 rounded-full flex items-center justify-center mb-4
                        ${isIncoming ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}
                    `}>
                        {isIncoming ? <ArrowDownLeft size={40} /> : <ArrowUpRight size={40} />}
                    </div>
                    <div className={`text-4xl font-bold mb-2 ${isIncoming ? 'text-emerald-400' : 'text-slate-100'}`}>
                        {isIncoming ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-sm font-medium text-slate-300">
                        {transaction.status === 'Completed' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Clock size={14} className="text-yellow-500" />}
                        {transaction.status}
                    </div>
                </div>

                {/* Details Card */}
                <Card className="w-full bg-slate-900/50 border-white/5 backdrop-blur-sm">
                    <CardContent className="p-6 space-y-6">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Transaction Type</span>
                            <span className="font-medium text-slate-200 capitalize">{transaction.type}</span>
                        </div>
                        <Separator className="bg-white/5" />

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Date & Time</span>
                            <span className="font-medium text-slate-200">{transaction.date}</span>
                        </div>
                        <Separator className="bg-white/5" />

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">{isIncoming ? 'From' : 'To'}</span>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 border border-indigo-500/30">
                                    {transaction.avatar}
                                </div>
                                <span className="font-medium text-slate-200">{transaction.name}</span>
                            </div>
                        </div>
                        <Separator className="bg-white/5" />

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Transaction ID</span>
                            <span className="font-mono text-slate-400 text-xs">TX-{transaction.id}-99283832</span>
                        </div>
                        <Separator className="bg-white/5" />

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Fee</span>
                            <span className="font-medium text-slate-200">$0.00</span>
                        </div>
                        <Separator className="bg-white/5" />

                        <div className="flex justify-between items-center text-base font-semibold">
                            <span className="text-slate-200">Total</span>
                            <span className="text-white">${transaction.amount.toFixed(2)}</span>
                        </div>

                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4 w-full mt-8">
                    <Button variant="outline" className="h-12 border-white/10 hover:bg-white/5 text-slate-300">
                        <Share2 className="mr-2 h-4 w-4" /> Share Receipt
                    </Button>
                    <Button variant="outline" className="h-12 border-white/10 hover:bg-white/5 text-slate-300">
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                </div>

                <div className="mt-6">
                    <Button variant="link" className="text-slate-500 hover:text-slate-300">
                        <HelpCircle className="mr-2 h-4 w-4" /> Report an issue
                    </Button>
                </div>

            </div>
        </div>
    );
};
