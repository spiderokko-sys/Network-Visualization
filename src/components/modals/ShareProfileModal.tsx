import { useState } from 'react';
import { X, Copy, Check, Mail, MessageCircle, Linkedin, Twitter, Facebook, Link2, QrCode } from 'lucide-react';

interface ShareProfileModalProps {
    onClose: () => void;
    profileUrl?: string;
    userName?: string;
}

export const ShareProfileModal = ({ onClose, profileUrl = 'https://gigmind.net/profile/iwan-mask', userName = 'Iwan Mask' }: ShareProfileModalProps) => {
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(profileUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const shareOptions = [
        {
            name: 'Email',
            icon: Mail,
            color: 'bg-blue-500 hover:bg-blue-600',
            action: () => {
                window.location.href = `mailto:?subject=Check out ${userName}'s profile&body=I thought you might be interested in ${userName}'s profile: ${profileUrl}`;
            }
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            color: 'bg-[#0077B5] hover:bg-[#006399]',
            action: () => {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`, '_blank');
            }
        },
        {
            name: 'Twitter',
            icon: Twitter,
            color: 'bg-[#1DA1F2] hover:bg-[#1a8cd8]',
            action: () => {
                window.open(`https://twitter.com/intent/tweet?text=Check out ${userName}'s profile&url=${encodeURIComponent(profileUrl)}`, '_blank');
            }
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-[#1877F2] hover:bg-[#166fe5]',
            action: () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, '_blank');
            }
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: 'bg-[#25D366] hover:bg-[#20bd5a]',
            action: () => {
                window.open(`https://wa.me/?text=Check out ${userName}'s profile: ${encodeURIComponent(profileUrl)}`, '_blank');
            }
        }
    ];

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Share Profile</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Share {userName}'s profile with others
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X className="text-slate-600 dark:text-slate-400" size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Copy Link */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                            Profile Link
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-slate-900 dark:text-white text-sm truncate">
                                {profileUrl}
                            </div>
                            <button
                                onClick={handleCopyLink}
                                className={`px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${copied
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} />
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Share Options */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                            Share via
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {shareOptions.map((option) => (
                                <button
                                    key={option.name}
                                    onClick={option.action}
                                    className={`${option.color} text-white p-4 rounded-xl transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-2 shadow-lg`}
                                >
                                    <option.icon size={24} />
                                    <span className="text-xs font-medium">{option.name}</span>
                                </button>
                            ))}
                            <button
                                onClick={() => setShowQR(!showQR)}
                                className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-xl transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-2 shadow-lg"
                            >
                                <QrCode size={24} />
                                <span className="text-xs font-medium">QR Code</span>
                            </button>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    {showQR && (
                        <div className="p-6 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 bg-white rounded-xl shadow-lg">
                                    {/* Placeholder for QR code - in production, use a QR code library */}
                                    <div className="w-48 h-48 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                                        <QrCode size={80} className="text-slate-400" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Scan to view profile</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                        Point your camera at the QR code
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Additional Options */}
                    <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: `${userName}'s Profile`,
                                        text: `Check out ${userName}'s profile on GIGMIND`,
                                        url: profileUrl
                                    }).catch(err => console.log('Error sharing:', err));
                                } else {
                                    alert('Web Share API not supported in this browser');
                                }
                            }}
                            className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <Link2 size={18} />
                            More sharing options
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
