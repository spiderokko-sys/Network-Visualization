import React from 'react';
import { X, QrCode, Wifi } from 'lucide-react';

export const QRModal = ({ onClose }) => (
	<div className="fixed inset-0 bg-slate-950/95 z-[100] flex flex-col items-center justify-center p-4 sm:p-8 backdrop-blur-md animate-in fade-in zoom-in-95">
		<button 
			onClick={onClose} 
			className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-white p-2 bg-slate-800/80 rounded-full z-50"
		>
			<X size={24} className="sm:w-8 sm:h-8" />
		</button>
		
		<div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.2)] text-center space-y-4 sm:space-y-6 max-w-xs sm:max-w-sm w-full mx-auto transform transition-all duration-300">
			<div className="flex justify-center">
				<div className="bg-slate-900 p-4 sm:p-6 rounded-2xl inline-block shadow-inner relative overflow-hidden group">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent h-full w-full -translate-y-full animate-[shimmer_2s_infinite]"></div>
					<QrCode size={160} className="text-white relative z-10 sm:w-[200px] sm:h-[200px]" /> 
					<div className="absolute inset-0 border-4 border-slate-900 rounded-2xl z-20"></div>
					<div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl"></div>
					<div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl"></div>
					<div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl"></div>
					<div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-xl"></div>
				</div>
			</div>
			
			<div>
				<h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Joe's Coffee</h2>
				<p className="text-slate-500 font-medium mt-2 text-sm sm:text-base">Scan to Connect & Collect Perks</p>
			</div>
		</div>
		
		<div className="mt-8 sm:mt-12 flex flex-col items-center gap-4 text-emerald-400">
			<div className="flex items-center gap-3 animate-pulse">
				<Wifi size={24} />
				<span className="text-lg sm:text-xl font-bold tracking-widest">SIGNAL ACTIVE</span>
			</div>
			<p className="text-slate-500 text-xs sm:text-sm">GigMind Node ID: 8821-XJ-99</p>
			
			<button onClick={onClose} className="mt-4 py-3 px-8 bg-slate-800 rounded-full text-white text-sm font-bold sm:hidden">
				Close Code
			</button>
		</div>
	</div>
);
