import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const AddCustomerModal = ({ onClose, onSave, initialData = null }: { onClose: () => void, onSave: (data: any) => void, initialData?: any }) => {
	const [form, setForm] = useState({ name: '', phone: '', email: '', tags: '' });

	useEffect(() => {
		if (initialData) {
			setForm({
				name: initialData.name || '',
				phone: initialData.phones?.[0]?.value || '',
				email: initialData.emails?.[0]?.value || '',
				tags: initialData.tags ? initialData.tags.join(', ') : ''
			});
		}
	}, [initialData]);

	const handleSubmit = () => {
		const payload = {
			...form,
			id: initialData?.id // Pass back ID if editing
		};
		onSave(payload);
	};

	return (
		<div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
			<div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-xl font-bold text-slate-900 dark:text-white">{initialData ? 'Edit Contact' : 'Add Contact'}</h3>
					<button onClick={onClose}><X className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" /></button>
				</div>
				<div className="space-y-4">
					<div>
						<label className="text-xs text-slate-500 dark:text-slate-400 uppercase">Contact Name</label>
						<input
							className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
							value={form.name}
							onChange={e => setForm({ ...form, name: e.target.value })}
							placeholder="Jane Doe"
						/>
					</div>
					<div>
						<label className="text-xs text-slate-500 dark:text-slate-400 uppercase">Primary Phone</label>
						<input
							className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
							value={form.phone}
							onChange={e => setForm({ ...form, phone: e.target.value })}
							placeholder="555-0000"
						/>
					</div>
					<div>
						<label className="text-xs text-slate-500 dark:text-slate-400 uppercase">Primary Email</label>
						<input
							className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
							value={form.email}
							onChange={e => setForm({ ...form, email: e.target.value })}
							placeholder="jane@email.com"
						/>
					</div>
					<div>
						<label className="text-xs text-slate-500 dark:text-slate-400 uppercase">Tags</label>
						<input
							className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
							value={form.tags}
							onChange={e => setForm({ ...form, tags: e.target.value })}
							placeholder="e.g. VIP, Local"
						/>
					</div>
				</div>
				<button
					onClick={handleSubmit}
					className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg transition-all"
				>
					{initialData ? 'Save Changes' : 'Create Contact'}
				</button>
			</div>
		</div>
	);
};
