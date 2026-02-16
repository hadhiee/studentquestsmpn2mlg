import React from 'react';
import { Competitor, PlayerStats } from '../types';

interface LeaderboardProps {
  competitors: Competitor[];
  playerStats: PlayerStats;
  compact?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ competitors, playerStats, compact = false }) => {
  const allPlayers = [
    ...competitors,
    { id: 'player', name: playerStats.name, score: playerStats.score, status: 'playing', avatarUrl: playerStats.avatarUrl }
  ].sort((a, b) => b.score - a.score);

  const playerRank = allPlayers.findIndex(p => p.id === 'player') + 1;

  if (compact) {
    return (
      <div className="bg-slate-900/90 border border-slate-700 rounded-lg p-3 w-64 shadow-lg backdrop-blur">
        <h3 className="text-xs text-holo-blue font-sci-fi mb-2 flex justify-between">
          <span>RANKING KELAS</span>
          <span>#{playerRank} / {allPlayers.length}</span>
        </h3>
        <div className="space-y-1">
          {allPlayers.slice(0, 3).map((p, i) => (
            <div key={p.id} className="flex justify-between items-center text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <img src={p.avatarUrl} className="w-5 h-5 rounded-full border border-slate-700" alt="" />
                <span>{i + 1}. {p.id === 'player' ? 'KAMU' : p.name.split(' ')[0]}</span>
              </div>
              <span className="text-gold-dust">{p.score}</span>
            </div>
          ))}
          {playerRank > 3 && (
            <div className="flex justify-between items-center text-xs text-white font-bold border-t border-slate-700 pt-1 mt-1">
              <div className="flex items-center gap-2">
                <img src={playerStats.avatarUrl} className="w-5 h-5 rounded-full border border-holo-blue" alt="" />
                <span>{playerRank}. KAMU</span>
              </div>
              <span className="text-gold-dust">{playerStats.score}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-600 overflow-hidden flex flex-col h-full shadow-2xl">
      <div className="p-4 bg-slate-900 border-b border-slate-700">
        <h3 className="text-lg font-sci-fi text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          SISWA AKTIF ({allPlayers.length})
        </h3>
        <p className="text-xs text-slate-400">SMP Negeri 2 Malang - Kelas 7</p>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {allPlayers.map((p, index) => {
          const isMe = p.id === 'player';
          return (
            <div 
              key={p.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                isMe 
                  ? 'bg-holo-blue/20 border border-holo-blue text-white shadow-[0_0_10px_rgba(14,165,233,0.3)]' 
                  : 'bg-slate-700/50 border border-transparent text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`font-mono font-bold w-6 text-center ${index < 3 ? 'text-gold-dust' : 'text-slate-500'}`}>
                  #{index + 1}
                </span>
                <img src={p.avatarUrl} className={`w-8 h-8 rounded-full border-2 ${isMe ? 'border-holo-blue' : 'border-slate-600'}`} alt="" />
                <div className="flex flex-col">
                  <span className={`font-content text-sm truncate max-w-[120px] ${isMe ? 'font-bold' : ''}`}>
                    {p.name}
                  </span>
                  {!isMe && (
                    <span className="text-[10px] text-green-500 flex items-center gap-1">
                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                    </span>
                  )}
                </div>
              </div>
              <span className="font-mono text-gold-dust font-bold">{p.score}</span>
            </div>
          );
        })}
      </div>
      
      <div className="p-3 bg-slate-900 border-t border-slate-700 text-center text-xs text-slate-500 font-mono">
        MALANG REGION // NODE V2.5
      </div>
    </div>
  );
};