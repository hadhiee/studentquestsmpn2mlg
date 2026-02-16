import React, { useState } from 'react';
import { Competitor } from '../types';

interface OnlinePlayersProps {
    competitors: Competitor[];
    currentPlayerName: string;
    onLogout: () => void;
}

export const OnlinePlayers: React.FC<OnlinePlayersProps> = ({ competitors, currentPlayerName, onLogout }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    console.log("OnlinePlayers Rendering:", { currentPlayerName, isExpanded, renderState: "not start" });

    const onlinePlayers = competitors.filter(c => c.status === 'online').slice(0, 10);
    const totalOnline = competitors.filter(c => c.status === 'online').length + 1; // +1 for current player

    return (
        <>
            {/* Logout Button - Top Left */}
            <button
                onClick={onLogout}
                className="fixed top-4 left-4 z-[9999] bg-red-600/90 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-sci-fi text-xs tracking-wider transition-all shadow-lg hover:shadow-red-500/50 flex items-center gap-2 backdrop-blur-sm border border-red-400/30"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                KELUAR
            </button>

            {/* Online Players Panel - Top Right */}
            <div className="fixed top-4 right-4 z-[9999]">
                {/* Collapsed State - Just the badge */}
                {!isExpanded && (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="bg-slate-900/90 backdrop-blur-md border border-green-500/30 rounded-2xl px-4 py-3 shadow-lg hover:shadow-green-500/30 transition-all hover:scale-105"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                            </div>
                            <div className="text-left">
                                <p className="text-white font-sci-fi text-xs tracking-wider">ONLINE</p>
                                <p className="text-green-400 font-bold text-lg leading-none">{totalOnline}</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>
                )}

                {/* Expanded State - Full list */}
                {isExpanded && (
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-green-500/30 rounded-2xl shadow-2xl overflow-hidden max-w-xs w-80 animate-slide-up relative z-[10000]">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                    <div className="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping"></div>
                                </div>
                                <div>
                                    <h3 className="text-white font-sci-fi text-sm tracking-wider">AGEN ONLINE</h3>
                                    <p className="text-green-100 text-xs">{totalOnline} pemain aktif</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Current Player */}
                        <div className="p-3 bg-gold-dust/10 border-b border-gold-dust/30">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-dust to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                                        {currentPlayerName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gold-dust font-bold text-sm flex items-center gap-2">
                                        {currentPlayerName}
                                        <span className="text-[8px] bg-gold-dust/20 text-gold-dust px-2 py-0.5 rounded-full font-sci-fi">KAMU</span>
                                    </p>
                                    <p className="text-slate-400 text-xs">Sedang bermain</p>
                                </div>
                            </div>
                        </div>

                        {/* Other Players List */}
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {onlinePlayers.map((player, index) => (
                                <div
                                    key={player.id}
                                    className="p-3 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 last:border-b-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img
                                                src={player.avatarUrl}
                                                alt={player.name}
                                                className="w-10 h-10 rounded-full border-2 border-slate-700"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold text-sm truncate">{player.name}</p>
                                            <p className="text-slate-400 text-xs truncate">{player.currentActivity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-holo-blue font-bold text-sm">{player.score}</p>
                                            <p className="text-slate-500 text-[10px] font-sci-fi">PTS</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-slate-800/50 text-center">
                            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">
                                Real-time sync • SMPN 2 MLG
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
