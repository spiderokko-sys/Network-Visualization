import React, { useState } from 'react';
import { 
	X, Users, Phone, Mail, Bell, MoreVertical, Edit2, UserPlus, 
	PlusCircle, Target, AlertTriangle, LogOut, BellOff, Heart,
	Download, FileText, ChevronRight, Image as ImageIcon, Link as LinkIcon
} from 'lucide-react';

export const ChatProfileModal = ({ chat, onClose }) => {
	const [activeTab, setActiveTab] = useState('media');
	const [showMenu, setShowMenu] = useState(false);

	const mediaItems = [1, 2, 3, 4, 5, 6, 7, 8];	
	const attachmentItems = [
		{ id: 1, name: 'Invoice_202.pdf', size: '240 KB', type: 'pdf' },
		{ id: 2, name: 'Menu_v2.docx', size: '1.2 MB', type: 'doc' },
		{ id: 3, name: 'Contract_Draft.pdf', size: '450 KB', type: 'pdf' }
	];
	const linkItems = [
		{ id: 1, url: 'gigmind.net/menu', title: 'Our Menu' },
		{ id: 2, url: 'maps.google.com/loc...', title: 'Location Pin' },
		{ id: 3, url: 'instagram.com/joe...', title: 'Instagram Profile' }
	];

	const groupMembers = [
		{ id: 1, name: 'Alice M.', role: 'Admin', status: 'online' },
		{ id: 2, name: 'Bob D.', role: 'Member', status: 'offline' },
		{ id: 3, name: 'Sarah J.', role: 'Member', status: 'online' },
		{ id: 4, name: 'Davina K.', role: 'Member', status: 'offline' },
		{ id: 5, name: 'You', role: 'Owner', status: 'online' }
	];

	return (
		<div 
			className="fixed inset-0 z-50 flex justify-end backdrop-blur-sm bg-slate-900/60" 
			onClick={onClose}
		>
			<div 
				className="w-full max-w-sm bg-slate-900 h-full border-l border-slate-800 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
				onClick={e => { e.stopPropagation(); if(showMenu) setShowMenu(false); }}
			>
				<div className="relative">
					<div className="h-32 bg-gradient-to-b from-indigo-600/40 to-slate-900"></div>
					<button onClick={onClose} className="absolute top-4 left-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors">
						<X size={20} />
					</button>

					<button 
						onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} 
						className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors z-30"
					>
						<MoreVertical size={20} />
					</button>

					{showMenu && (
						<div className="absolute top-16 right-4 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-40 overflow-hidden animate-in fade-in zoom-in-95">
							{chat.isGroup ? (
								<>
									<button className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2 transition-colors">
										<Edit2 size={16} className="text-indigo-400" /> Edit Group Info
									</button>
									<button className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2 transition-colors">
										<UserPlus size={16} className="text-emerald-400" /> Add Member
									</button>
								</>
							) : (
								<>
									<button className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2 transition-colors">
										<PlusCircle size={16} className="text-emerald-400" /> Add to Circle
									</button>
									<button className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2 transition-colors">
										<Target size={16} className="text-indigo-400" /> Add to Intent
									</button>
								</>
							)}
							
							<div className="h-px bg-slate-700 my-0"></div>
							<button className="w-full text-left px-4 py-3 text-sm text-rose-400 hover:bg-rose-900/20 flex items-center gap-2 transition-colors">
								<AlertTriangle size={16} /> Report
							</button>
							<button className="w-full text-left px-4 py-3 text-sm text-rose-400 hover:bg-rose-900/20 flex items-center gap-2 transition-colors">
								<LogOut size={20} /> {chat.isGroup ? 'Leave Group' : 'Block User'}
							</button>
						</div>
					)}

					<div className="absolute -bottom-12 left-6">
						<div className="h-24 w-24 rounded-full bg-slate-800 p-1 shadow-xl">
							<div className="h-full w-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
								{chat.isGroup ? <Users size={32} /> : chat.name[0]}
							</div>
						</div>
					</div>
				</div>

				<div className="mt-14 px-6 pb-6 border-b border-slate-800">
					<h2 className="text-2xl font-bold text-white flex items-center gap-2">
						{chat.name} 
						{chat.isFavorite && <Heart size={18} className="text-rose-500 fill-rose-500" />}
					</h2>
					<p className="text-sm text-indigo-400 font-medium mt-1">
						{chat.isGroup ? 'Public Group' : 'Online'}
					</p>
					{chat.isGroup && (
						<p className="text-sm text-slate-400 mt-3 leading-relaxed">
							Official community channel for updates and events.
						</p>
					)}
				</div>

				<div className="p-4 space-y-1">
					{!chat.isGroup && (
						<>
							<div className="flex items-center gap-4 p-3 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors">
								<Phone size={20} className="text-slate-400" />
								<div>
									<div className="text-white text-sm">+1 (416) 555-0192</div>
									<div className="text-xs text-slate-500">Mobile</div>
								</div>
							</div>
							<div className="flex items-center gap-4 p-3 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors">
								<Mail size={20} className="text-slate-400" />
								<div>
									<div className="text-white text-sm">contact@gigmind.net</div>
									<div className="text-xs text-slate-500">Email</div>
								</div>
							</div>
						</>
					)}
					<div className="flex items-center gap-4 p-3 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors">
						<Bell size={20} className="text-slate-400" />
						<div className="flex-1">
							<div className="text-white text-sm">Notifications</div>
							<div className="text-xs text-slate-500">On</div>
						</div>
						<div className="w-10 h-5 bg-emerald-600 rounded-full relative"><div className="absolute right-1 top-1 h-3 w-3 bg-white rounded-full"></div></div>
					</div>
				</div>

				{chat.isGroup && (
					<>
						<div className="h-2 bg-slate-950"></div>
						<div className="p-4">
							<h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Group Members <span className="text-slate-600 font-normal">({groupMembers.length})</span></h3>
							<div className="space-y-3">
								{groupMembers.map(member => (
									<div key={member.id} className="flex items-center justify-between group cursor-pointer hover:bg-slate-800/50 p-2 rounded-lg transition-colors">
										<div className="flex items-center gap-3">
											<div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
												{member.name[0]}
											</div>
											<div>
												<div className="text-sm text-white font-medium">{member.name}</div>
												<div className={`text-[10px] ${member.status === 'online' ? 'text-emerald-400' : 'text-slate-500'}`}>{member.status}</div>
											</div>
										</div>
										{member.role === 'Admin' && <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">Admin</span>}
										{member.role === 'Owner' && <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">You</span>}
									</div>
								))}
							</div>
							<button className="w-full mt-4 py-2 text-xs font-bold text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/10 transition-colors flex items-center justify-center gap-2">
								<UserPlus size={14} /> Add New Member
							</button>
						</div>
					</>
				)}

				<div className="h-2 bg-slate-950"></div>

				<div className="p-4">
					<div className="flex border-b border-slate-800 mb-4">
						{['media', 'attachments', 'links'].map(tab => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`flex-1 pb-2 text-xs font-bold uppercase tracking-wider text-center transition-colors ${
									activeTab === tab 
										? 'text-indigo-400 border-b-2 border-indigo-500' 
										: 'text-slate-500 hover:text-slate-300'
								}`}
							>
								{tab}
							</button>
						))}
					</div>

					<div className="min-h-[150px]">
						{activeTab === 'media' && (
							<div className="grid grid-cols-4 gap-2 animate-in fade-in">
								{mediaItems.map(i => (
									<div key={i} className="aspect-square bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center text-slate-600 hover:bg-slate-700 transition-colors cursor-pointer">
										<ImageIcon size={16} />
									</div>
								))}
							</div>
						)}

						{activeTab === 'attachments' && (
							<div className="space-y-2 animate-in fade-in">
								{attachmentItems.map(file => (
									<div key={file.id} className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg cursor-pointer group">
										<div className="p-2 bg-slate-800 rounded text-slate-400 group-hover:bg-slate-700 group-hover:text-indigo-400 transition-colors">
											<FileText size={18}/>
										</div>
										<div className="flex-1 min-w-0">
											<div className="text-xs text-white font-medium truncate">{file.name}</div>
											<div className="text-[10px] text-slate-500">{file.size}</div>
										</div>
										<Download size={14} className="text-slate-600 group-hover:text-white" />
									</div>
								))}
							</div>
						)}

						{activeTab === 'links' && (
							<div className="space-y-2 animate-in fade-in">
								{linkItems.map(link => (
									<div key={link.id} className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg cursor-pointer group">
										<div className="p-2 bg-slate-800 rounded text-slate-400 group-hover:bg-slate-700 group-hover:text-emerald-400 transition-colors">
											<LinkIcon size={18}/>
										</div>
										<div className="flex-1 min-w-0">
											<div className="text-xs text-white font-medium truncate">{link.title}</div>
											<div className="text-[10px] text-slate-500 truncate">{link.url}</div>
										</div>
										<ChevronRight size={14} className="text-slate-600 group-hover:text-white" />
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				<div className="h-2 bg-slate-950"></div>

				<div className="p-4 space-y-2">
					<button className="w-full py-3 flex items-center gap-3 text-rose-400 hover:bg-rose-900/10 rounded-xl px-4 transition-colors">
						<BellOff size={20} />
						<span className="text-sm font-medium">Mute Notifications</span>
					</button>
					<button className="w-full py-3 flex items-center gap-3 text-rose-400 hover:bg-rose-900/10 rounded-xl px-4 transition-colors">
						<LogOut size={20} />
						<span className="text-sm font-medium">{chat.isGroup ? 'Leave Group' : 'Block User'}</span>
					</button>
				</div>
			</div>
		</div>
	);
};
