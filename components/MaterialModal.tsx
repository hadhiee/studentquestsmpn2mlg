import React from 'react';
import { MaterialContent } from '../types';

interface MaterialModalProps {
  content: MaterialContent;
  onClose: () => void;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({ content, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-purple-500 rounded-2xl max-w-2xl w-full p-1 relative overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.4)]">
        
        {/* Holographic Border Effect */}
        <div className="absolute inset-0 border-2 border-purple-500/30 rounded-2xl m-2 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-purple-400 shadow-[0_0_10px_#a855f7]"></div>
        
        <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl h-full flex flex-col md:flex-row gap-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
            
            {/* Image Section */}
            {content.imageUrl && (
                <div className="w-full md:w-1/3 flex-shrink-0">
                    <div className="relative group">
                         <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                         <img 
                            src={content.imageUrl} 
                            alt={content.title} 
                            className="relative w-full h-48 md:h-64 object-cover rounded-lg border border-slate-600 shadow-xl"
                         />
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                    <span className="text-purple-400 font-sci-fi text-xs tracking-widest">ARSIP PANDORA TERBUKA</span>
                </div>
                
                <h2 className="text-3xl font-bold font-content text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-4">
                    {content.title}
                </h2>

                {/* Audio Player */}
                {content.audioUrl && (
                    <div className="mb-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                             </svg>
                             <span className="text-xs text-purple-300 font-sci-fi">REKAMAN AUDIO</span>
                        </div>
                        <audio controls src={content.audioUrl} className="w-full h-8 opacity-80 hover:opacity-100 transition-opacity" />
                    </div>
                )}

                {/* Embed/Diagram */}
                {content.embedUrl && (
                    <div className="mb-4 w-full aspect-video rounded-lg overflow-hidden border border-slate-700 bg-black">
                        <iframe 
                            src={content.embedUrl} 
                            className="w-full h-full" 
                            title="Interactive Content"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
                
                <div className="prose prose-invert prose-sm overflow-y-auto custom-scrollbar pr-2 text-slate-300 leading-relaxed text-justify">
                    {content.body}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="group relative px-6 py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 hover:text-white border border-purple-500/50 rounded transition-all"
                    >
                        <span className="relative z-10 font-bold font-sci-fi text-sm">TUTUP ARSIP</span>
                        <div className="absolute inset-0 bg-purple-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};