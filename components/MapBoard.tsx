import React, { useMemo } from 'react';
import { MapNode, Competitor, PlayerStats } from '../types';

interface MapBoardProps {
  nodes: MapNode[];
  currentNodeIndex: number;
  onNodeClick: (index: number) => void;
  isTeacherMode: boolean;
  competitors: Competitor[];
  playerStats: PlayerStats;
  selectedStudentId?: string | null;
  onStudentClick?: (id: string | null) => void;
}

export const MapBoard: React.FC<MapBoardProps> = ({ 
  nodes, 
  currentNodeIndex, 
  onNodeClick, 
  isTeacherMode, 
  competitors,
  playerStats,
  selectedStudentId,
  onStudentClick
}) => {
  
  const selectedStudent = competitors.find(c => c.id === selectedStudentId);

  // Decorative topographical elements
  const terrainDecor = useMemo(() => {
      const items = [];
      for(let i=0; i<25; i++) {
          items.push({
              id: `terrain-${i}`,
              x: Math.random() * 100,
              y: Math.random() * 100,
              type: Math.random() > 0.6 ? 'tree' : 'rock',
              size: 10 + Math.random() * 20,
              opacity: 0.15 + Math.random() * 0.1
          });
      }
      return items;
  }, []);

  const renderTracks = () => {
    return nodes.map((node, i) => {
      if (i === nodes.length - 1) return null;
      const nextNode = nodes[i + 1];
      const isUnlocked = i < currentNodeIndex;
      
      return (
        <g key={`track-${i}`}>
            {/* Wide blurred path shadow */}
            <line 
                x1={`${node.x}%`} y1={`${node.y}%`} x2={`${nextNode.x}%`} y2={`${nextNode.y}%`} 
                stroke={isUnlocked ? "rgba(255, 255, 255, 0.2)" : "rgba(0,0,0,0.05)"} 
                strokeWidth="14" strokeLinecap="round"
            />
            {/* High contrast travel path */}
            <line 
                x1={`${node.x}%`} y1={`${node.y}%`} x2={`${nextNode.x}%`} y2={`${nextNode.y}%`} 
                stroke={isUnlocked ? "#fbbf24" : "rgba(0,0,0,0.1)"} 
                strokeWidth="3" 
                strokeDasharray="10,6"
                className={isUnlocked ? "animate-pulse" : ""}
            />
        </g>
      );
    });
  };

  return (
    <div className="w-full aspect-video bg-[#b0a078] rounded-3xl overflow-hidden border-[10px] border-[#3e2f24] shadow-[0_30px_60px_rgba(0,0,0,0.7)] relative group select-none font-content">
        
        {/* Realistic High-Contrast Terrain */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4c599] via-[#c2b280] to-[#a68d60]"></div>
        
        {/* Geographic Zonation (Andalusia / Damascus) - Desaturated to keep focus on buildings */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-[45%] h-full bg-[#3d5a20]/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-[40%] h-[70%] bg-[#4b3c2a]/20 blur-[100px] rounded-full"></div>
            <div className="absolute top-0 left-1/4 w-[50%] h-1/3 bg-[#2e5d82]/15 blur-[80px] rounded-full"></div>
        </div>

        {/* Paper Texture and Grain */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] pointer-events-none"></div>

        {/* The Map Canvas */}
        <div className="absolute inset-0 w-full h-full">
            
            {/* Subtle terrain details */}
            {terrainDecor.map(d => (
                <div key={d.id} className="absolute pointer-events-none select-none" style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, opacity: d.opacity }}>
                    {d.type === 'tree' ? <span className="text-sm">🌲</span> : <span className="text-xs">🪨</span>}
                </div>
            ))}

            {/* Path Connections (Behind Buildings) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {renderTracks()}
            </svg>

            {/* Historical Nodes (High Contrast Ancient Buildings) */}
            {nodes.map((node, index) => {
                const isActive = index === currentNodeIndex;
                const isCompleted = index < currentNodeIndex;
                const isLocked = index > currentNodeIndex;
                const isMaterial = node.type === 'MATERIAL';

                return (
                    <div 
                        key={node.id}
                        className="absolute flex flex-col items-center group/node"
                        style={{ 
                            left: `${node.x}%`, 
                            top: `${node.y}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 100 + (isActive ? 10 : 0)
                        }}
                        onClick={() => !isLocked && onNodeClick(index)}
                    >
                        {/* High-Contrast Building Illustrations */}
                        <div className={`relative cursor-pointer transition-all duration-300 ${!isLocked && 'hover:scale-125 active:scale-95'} ${isLocked ? 'grayscale opacity-30 brightness-75' : 'drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]'}`}>
                            
                            {/* Visual Feedback for Current Node */}
                            {isActive && (
                                <div className="absolute -inset-12 bg-white/50 rounded-full blur-3xl animate-pulse"></div>
                            )}

                            {isMaterial ? (
                                /* PANDORA NODE: ANCIENT LIBRARY / ARCHIVE */
                                <div className="relative flex flex-col items-center">
                                    <div className="w-20 h-16 bg-[#f8fafc] border-2 border-[#1e293b] rounded-t-3xl relative flex flex-col items-center justify-center shadow-2xl overflow-hidden">
                                        <div className="absolute top-0 w-full h-3 bg-[#334155]"></div>
                                        {/* Golden Arches */}
                                        <div className="flex gap-2 mt-2">
                                            <div className="w-2.5 h-6 bg-[#fbbf24] border border-[#b45309] rounded-t-full"></div>
                                            <div className="w-2.5 h-6 bg-[#fbbf24] border border-[#b45309] rounded-t-full"></div>
                                            <div className="w-2.5 h-6 bg-[#fbbf24] border border-[#b45309] rounded-t-full"></div>
                                        </div>
                                        {/* Main Archive Dome */}
                                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-10 bg-gradient-to-b from-[#a855f7] to-[#7c3aed] rounded-t-full border-2 border-white shadow-[0_0_20px_rgba(168,85,247,0.6)]"></div>
                                    </div>
                                    {/* Foundation */}
                                    <div className="w-24 h-4 bg-[#1e293b] rounded-b-lg -mt-1 shadow-lg"></div>
                                    {/* Floating Knowledge Icon */}
                                    <div className="absolute -top-14 text-3xl drop-shadow-[0_0_8px_white] animate-bounce">📖</div>
                                    {isActive && <div className="absolute -bottom-4 w-12 h-1 bg-purple-500 rounded-full blur-sm animate-pulse"></div>}
                                </div>
                            ) : (
                                /* COMBAT NODE: ANCIENT MOSQUE / FORTRESS */
                                <div className="relative flex flex-col items-center">
                                    <div className="flex items-end -space-x-1">
                                        {/* Left Minaret */}
                                        <div className="w-4 h-18 bg-[#ffffff] border-2 border-[#334155] rounded-t-lg relative shadow-xl z-20">
                                            <div className="absolute top-2 w-full h-1 bg-slate-200"></div>
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#fbbf24] border-2 border-[#1e293b] rotate-45"></div>
                                        </div>
                                        {/* Main Hall */}
                                        <div className="w-24 h-12 bg-[#f1f5f9] border-2 border-[#334155] rounded-t-xl relative shadow-2xl z-10 overflow-hidden flex items-center justify-center">
                                            {/* Golden Grand Dome */}
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-14 bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] rounded-t-full border-2 border-white shadow-[0_0_30px_rgba(251,191,36,0.6)]"></div>
                                            {/* Giant Gateway */}
                                            <div className="absolute bottom-0 w-8 h-10 border-t-2 border-x-2 border-[#1e293b] rounded-t-full bg-[#1e293b] z-20"></div>
                                        </div>
                                        {/* Right Minaret */}
                                        <div className="w-4 h-18 bg-[#ffffff] border-2 border-[#334155] rounded-t-lg relative shadow-xl z-20">
                                            <div className="absolute top-2 w-full h-1 bg-slate-200"></div>
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#fbbf24] border-2 border-[#1e293b] rotate-45"></div>
                                        </div>
                                    </div>
                                    {/* Base Floor */}
                                    <div className="w-32 h-3 bg-[#1e293b]/40 rounded-full mt-1 blur-[2px]"></div>
                                    {isActive && <div className="absolute -top-16 text-3xl animate-bounce">⚔️</div>}
                                </div>
                            )}

                            {/* Node Label (Clear, high contrast background) */}
                            <div className={`mt-4 px-5 py-2 rounded-xl border-2 font-black text-xs tracking-tighter uppercase transition-all shadow-2xl text-center
                                ${isActive 
                                    ? 'bg-[#fbbf24] text-[#1e293b] border-white scale-110 ring-4 ring-white/20' 
                                    : isCompleted
                                        ? 'bg-[#15803d] text-white border-green-200 opacity-90'
                                        : 'bg-[#334155] text-slate-400 border-slate-600'
                                }
                            `}>
                                {node.label}
                            </div>
                        </div>

                        {/* Player/Student Presence Indicators */}
                        {!isTeacherMode && isActive && playerStats.avatarUrl && (
                            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-20 h-20 animate-bounce-subtle z-[200]">
                                <div className="p-1.5 bg-white rounded-3xl shadow-2xl ring-[6px] ring-[#fbbf24]">
                                    <img src={playerStats.avatarUrl} className="w-full h-full rounded-2xl border-2 border-slate-100 bg-slate-50" />
                                </div>
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[15px] border-t-[#fbbf24]"></div>
                            </div>
                        )}

                        {isTeacherMode && competitors.map(student => {
                            if (student.currentNodeIndex === index) {
                                return (
                                    <div key={student.id} className="absolute -top-24 left-1/2 -translate-x-1/2 w-12 h-12 group-hover:z-[300]">
                                        <div className={`p-1.5 rounded-2xl border-2 shadow-2xl transition-transform hover:scale-150 ${selectedStudentId === student.id ? 'bg-emerald-500 border-white scale-125' : 'bg-white border-slate-800'}`}>
                                            <img src={student.avatarUrl} className="w-full h-full rounded-xl" title={student.name} />
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                );
            })}
        </div>

        {/* Tactical HUD Overlays */}
        <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between z-[150]">
            <div className="flex justify-between items-start">
                <div className="bg-[#1e293b]/95 backdrop-blur-xl border-l-8 border-[#fbbf24] p-5 rounded-r-3xl shadow-2xl ring-1 ring-white/10">
                    <h4 className="text-[12px] text-[#fbbf24] font-sci-fi uppercase tracking-[0.3em] font-black">Tactical Survey</h4>
                    <p className="text-lg text-white font-mono uppercase font-black tracking-tighter">UMAYYAD EMPIRE // 8TH CENTURY</p>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                        <span className="text-[11px] text-emerald-400 font-mono uppercase font-bold tracking-widest">Temporal Link: High Strength</span>
                    </div>
                </div>
                
                {/* Ancient Navigation Device */}
                <div className="w-24 h-24 bg-[#1e293b]/90 backdrop-blur rounded-full border-4 border-[#3e2f24] flex items-center justify-center relative shadow-2xl">
                    <div className="absolute inset-0 border-2 border-[#fbbf24]/10 rounded-full animate-spin-slow"></div>
                    <div className="absolute inset-2 border border-white/5 rounded-full"></div>
                    <div className="text-[12px] font-sci-fi text-[#fbbf24] font-black">N</div>
                    <div className="w-1 h-14 bg-gradient-to-b from-[#fbbf24] via-white to-transparent absolute top-5 origin-bottom rounded-full"></div>
                </div>
            </div>
            
            <div className="flex justify-between items-end">
                <div className="bg-gradient-to-t from-black/70 to-transparent p-10 -mx-10 -mb-10 w-full">
                    <h3 className="text-6xl font-black font-sci-fi text-white/5 uppercase italic tracking-tighter select-none">Bani Umayyah Archive</h3>
                </div>
            </div>
        </div>

        {/* Global Atmosphere Layers */}
        <div className="absolute inset-0 pointer-events-none z-[250] bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]"></div>
        <div className="absolute inset-0 pointer-events-none z-[250] mix-blend-color-burn opacity-40 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>
    </div>
  );
};