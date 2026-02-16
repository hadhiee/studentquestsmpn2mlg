import React from 'react';
import { LevelConfig, PlayerStats, Competitor } from '../types';
import { LEVELS } from '../constants';
import { Leaderboard } from './Leaderboard';

interface LevelSelectProps {
  playerStats: PlayerStats;
  competitors: Competitor[];
  onSelectLevel: (levelId: number) => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ playerStats, competitors, onSelectLevel }) => {
  return (
    <div className="min-h-screen bg-void-dark pt-20 pb-10 px-4 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
      
      {/* Main Content */}
      <div className="flex-1">
        <header className="flex justify-between items-end mb-12 border-b border-slate-700 pb-4">
          <div className="flex items-center gap-4">
            {playerStats.avatarUrl && (
                <img src={playerStats.avatarUrl} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-gold-dust" />
            )}
            <div>
                <h2 className="text-3xl font-sci-fi text-white">PETA WAKTU</h2>
                <p className="text-slate-400 font-content">Agen: <span className="text-gold-dust">{playerStats.name}</span></p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-slate-500 font-sci-fi">TOTAL SKOR</p>
            <p className="text-2xl text-holo-blue font-bold font-mono">{playerStats.score}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {LEVELS.map((level) => {
            // Logic to check if level is locked based on completed requirements
            const isLocked = level.requiredLevelId 
                ? !playerStats.completedLevels.includes(level.requiredLevelId)
                : false;

            return (
                <div 
                  key={level.id}
                  className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-300 min-h-[160px] ${
                    isLocked 
                      ? 'border-slate-700 bg-slate-900/50 opacity-70 grayscale' 
                      : 'border-holo-blue/50 bg-slate-800 hover:border-gold-dust hover:shadow-[0_0_25px_rgba(251,191,36,0.3)] cursor-pointer'
                  }`}
                  onClick={() => !isLocked && onSelectLevel(level.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${level.themeColor} opacity-20 transition-opacity group-hover:opacity-30`}></div>
                  <div className="p-6 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center h-full">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded text-xs font-bold font-sci-fi ${isLocked ? 'bg-slate-700 text-slate-400' : 'bg-gold-dust text-black'}`}>
                                {isLocked ? 'TERKUNCI' : 'LEVEL ' + level.id}
                            </span>
                            <span className="text-xs text-slate-300 font-mono bg-black/50 px-2 py-1 rounded">
                                {level.era}
                            </span>
                        </div>
                        
                        <h3 className="text-2xl font-bold font-sci-fi text-white mb-2">{level.title}</h3>
                        <p className="text-slate-300 text-sm font-content max-w-lg">{level.description}</p>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs text-holo-blue bg-slate-900/50 px-3 py-2 rounded-full border border-slate-700">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {level.location}
                    </div>
                  </div>
                  
                  {!isLocked && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-dust to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  )}
                </div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm italic">"Sejarah adalah jembatan menuju masa depan."</p>
        </div>
      </div>

      {/* Sidebar Leaderboard */}
      <div className="w-full md:w-80 lg:w-96 flex-shrink-0 h-[600px] sticky top-4">
        <Leaderboard competitors={competitors} playerStats={playerStats} />
      </div>

    </div>
  );
};