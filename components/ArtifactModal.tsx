import React from 'react';
import { Artifact } from '../types';

interface ArtifactModalProps {
  artifact: Artifact;
  onClose: () => void;
}

export const ArtifactModal: React.FC<ArtifactModalProps> = ({ artifact, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border-2 border-gold-dust rounded-2xl max-w-md w-full p-6 relative overflow-hidden shadow-[0_0_50px_rgba(251,191,36,0.2)] animate-pulse-fast">
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

        <div className="text-center">
            <h3 className="text-gold-dust font-sci-fi tracking-widest text-lg mb-1">ARTEFAK DITEMUKAN!</h3>
            <div className="my-6 relative inline-block">
                <div className="absolute inset-0 bg-gold-dust blur-2xl opacity-30 rounded-full"></div>
                <img 
                    src={artifact.imageUrl} 
                    alt={artifact.name} 
                    className="w-48 h-48 object-cover rounded-lg border border-slate-600 relative z-10 mx-auto"
                />
            </div>
            
            <h2 className="text-3xl font-bold font-content text-white mb-3">{artifact.name}</h2>
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">{artifact.description}</p>
            
            <button
                onClick={onClose}
                className="bg-gold-dust hover:bg-yellow-400 text-black font-bold font-sci-fi py-3 px-8 rounded-full transition-transform hover:scale-105"
            >
                SIMPAN KE INVENTARIS
            </button>
        </div>
      </div>
    </div>
  );
};
