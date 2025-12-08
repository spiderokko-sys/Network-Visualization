import React, { useState } from 'react';
import { X } from 'lucide-react';

export const EditCircleModal = ({ circle, onClose, onSave }) => {
	const [form, setForm] = useState({ name: circle.name, desc: circle.desc });

	return (
		<div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
			<div className="bg-slate-800 w-full max-w-sm rounded-2xl border border-slate-700 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-xl font-bold text-white">Edit Circle</h3>
					<button onClick={onClose}><X className="text-slate-400" /></button>
				</div>
				<div className="space-y-4">
					<div>
						<label className="text-xs text-slate-400 uppercase">Circle Name</label>
						<input 
							className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
							value={form.name} onChange={e => setForm({...form, name: e.target.value})}
						/>
					</div>
					<div>
						<label className="text-xs text-slate-400 uppercase">Description</label>
						<input 
							className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none"
							value={form.desc} onChange={e => setForm({...form, desc: e.target.value})}
						/>
					</div>
				</div>
				<button 
					onClick={() => onSave({ ...circle, ...form })}
					className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg transition-all"
				>
					Save Changes
				</button>
			</div>
		</div>
	);
};
