import React, { useState, useEffect, useRef } from 'react';
import { X, DollarSign, FileText, CheckCircle2, Send } from 'lucide-react';

export const FinancialModal = ({ type, initialCustomer, customers, onClose, onSave }) => {
	const [formData, setFormData] = useState({
		customerId: initialCustomer?.id || '',
		amount: '',
		description: '',
		isGuest: false
	});
	const [searchTerm, setSearchTerm] = useState(initialCustomer?.name || '');
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null);

	const filteredCustomers = customers.filter(c => 
		c.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleSelectCustomer = (c) => {
		setFormData({ ...formData, customerId: c.id, isGuest: false });
		setSearchTerm(c.name);
		setShowDropdown(false);
	};

	const handleGuestToggle = () => {
		const newGuestState = !formData.isGuest;
		setFormData({ 
			...formData, 
			isGuest: newGuestState, 
			customerId: newGuestState ? 'GUEST' : '' 
		});
		if (newGuestState) {
			setSearchTerm('Guest (Walk-in)');
			setShowDropdown(false);
		} else {
			setSearchTerm('');
		}
	};
	
	useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownRef]);

	return (
		<div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
			<div className="bg-slate-800 w-full max-w-sm rounded-2xl border border-slate-700 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
				<div className="flex justify-between items-center mb-6">
					<div className="flex items-center gap-2">
						{type === 'payment' ? <DollarSign className="text-emerald-400" /> : <FileText className="text-indigo-400" />}
						<h3 className="text-xl font-bold text-white">{type === 'payment' ? 'Receive Payment' : 'Send Invoice'}</h3>
					</div>
					<button onClick={onClose}><X className="text-slate-400" /></button>
				</div>

				<div className="space-y-4">
					<div className="relative" ref={dropdownRef}>
						<label className="text-xs text-slate-400 uppercase mb-1 block">Customer</label>
						<div className="flex gap-2">
							<div className="relative flex-1">
								<input 
									type="text"
									className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
									placeholder="Search customer..."
									value={searchTerm}
									onChange={(e) => { 
										setSearchTerm(e.target.value); 
										setShowDropdown(true); 
										setFormData({...formData, isGuest: false, customerId: ''}); 
									}}
									onFocus={() => setShowDropdown(true)}
									disabled={!!initialCustomer}
								/>
								{showDropdown && !initialCustomer && (
									<div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50">
										{filteredCustomers.map(c => (
											<div 
												key={c.id} 
												className="p-3 hover:bg-slate-700 cursor-pointer text-white text-sm flex items-center gap-2"
												onClick={() => handleSelectCustomer(c)}
											>
												<div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold">{c.name[0]}</div>
												{c.name}
											</div>
										))}
										{filteredCustomers.length === 0 && <div className="p-3 text-slate-500 text-sm text-center">No matches found</div>}
									</div>
								)}
							</div>
							
							{type === 'payment' && !initialCustomer && (
								<button 
									onClick={handleGuestToggle}
									className={`px-3 py-2 rounded-lg border text-xs font-bold transition-colors ${formData.isGuest ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
								>
									GUEST
								</button>
							)}
						</div>
					</div>

					<div>
						<label className="text-xs text-slate-400 uppercase mb-1 block">Amount</label>
						<div className="relative">
							<span className="absolute left-3 top-3 text-slate-500">$</span>
							<input 
								type="number"
								className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-8 text-white focus:border-indigo-500 focus:outline-none font-mono text-lg"
								placeholder="0.00"
								value={formData.amount}
								onChange={e => setFormData({...formData, amount: e.target.value})}
							/>
						</div>
					</div>

					<div>
						<label className="text-xs text-slate-400 uppercase mb-1 block">Description</label>
						<textarea 
							className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none resize-none"
							rows={3}
							placeholder={type === 'payment' ? "e.g. Catering Deposit" : "e.g. Invoice for Office Lunch #102"}
							value={formData.description}
							onChange={e => setFormData({...formData, description: e.target.value})}
						/>
					</div>
				</div>

				<button 
					onClick={() => onSave(formData)}
					disabled={!formData.amount || (!formData.customerId && !formData.isGuest)}
					className={`w-full mt-6 py-3 rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${type === 'payment' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
				>
					{type === 'payment' ? <CheckCircle2 size={18} /> : <Send size={18} />}
					{type === 'payment' ? 'Confirm Receipt' : 'Send Invoice'}
				</button>
			</div>
		</div>
	);
};
