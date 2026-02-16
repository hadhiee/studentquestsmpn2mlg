import React, { useState, useEffect } from 'react';
import { DYNASTY_DATA } from '../constants';

interface DynastyBriefingProps {
  dynasty: 'umayyah1' | 'umayyah2';
  onStart: () => void;
  onBack: () => void;
}

export const DynastyBriefing: React.FC<DynastyBriefingProps> = ({ dynasty, onStart, onBack }) => {
  const data = DYNASTY_DATA[dynasty];
  const [typedText, setTypedText] = useState('');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    let i = 0;
    const fullText = data.history;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setShowButton(true);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [data.history]);

  return (
    <div className="min-h-screen bg-void-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] z-10 bg-[length:100%_4px] pointer-events-none opacity-30"></div>
      
      <div className="z-20 max-w-4xl w-full bg-slate-900/80 backdrop-blur-xl border-2 border-slate-700 rounded-[3rem] p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col gap-8 relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-holo-blue to-transparent"></div>
        <div className="absolute top-0 left-0 w-1 h-32 bg-gradient-to-b from-holo-blue to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-32 h-1 bg-gradient-to-l from-gold-dust to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1 h-32 bg-gradient-to-t from-gold-dust to-transparent"></div>

        <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Visual Header / Avatar */}
            <div className="w-full md:w-1/3 flex flex-col items-center text-center">
                <div className="relative mb-6">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-slate-700 shadow-2xl bg-black">
                        <img 
                            src={dynasty === 'umayyah1' 
                                ? "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Umayyad_Mosque_prayer_hall.jpg/640px-Umayyad_Mosque_prayer_hall.jpg" 
                                : "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mezquita_de_C%C3%B3rdoba_desde_el_aire_%28cropped%29.jpg/640px-Mezquita_de_C%C3%B3rdoba_desde_el_aire_%28cropped%29.jpg"
                            } 
                            className="w-full h-full object-cover opacity-70"
                            alt="City View"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 border-2 border-gold-dust px-4 py-1 rounded-full text-[10px] font-sci-fi text-gold-dust whitespace-nowrap uppercase tracking-tighter">
                        Koordinat Temporal: Aktif
                    </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 w-full">
                    <h4 className="text-[10px] text-slate-500 font-sci-fi uppercase tracking-widest mb-2 font-bold">Pemimpin Kunci</h4>
                    <p className="text-white font-bold font-content text-lg leading-tight">{data.leader}</p>
                </div>
            </div>

            {/* Information Section */}
            <div className="flex-1 flex flex-col gap-6">
                <div>
                    <h2 className="text-holo-blue font-sci-fi text-xs tracking-[0.3em] mb-2 uppercase font-bold">File Sejarah Dinasti</h2>
                    <h1 className="text-4xl font-bold font-sci-fi text-white leading-tight mb-2 tracking-tighter uppercase">{data.title}</h1>
                    <p className="text-gold-dust font-content font-bold tracking-widest uppercase text-sm mb-4">{data.subtitle}</p>
                </div>

                <div className="bg-black/40 p-6 rounded-2xl border border-white/5 min-h-[140px]">
                    <p className="text-slate-300 font-content text-lg leading-relaxed text-justify italic">
                        "{typedText}"
                        <span className="w-1.5 h-4 bg-holo-blue inline-block ml-1 animate-pulse"></span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.keyFacts.map((fact, idx) => (
                        <div key={idx} className="flex gap-3 items-start p-3 bg-slate-800/30 rounded-xl border border-white/5 hover:bg-slate-800/50 transition-colors">
                            <span className="text-holo-blue text-sm">▹</span>
                            <p className="text-[11px] text-slate-400 font-content leading-tight">
                                <span className="text-white font-bold block mb-1 uppercase tracking-tighter">{fact.split(':')[0]}</span>
                                {fact.split(':')[1]}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="bg-emerald-900/10 border border-emerald-500/20 p-4 rounded-xl">
                    <h4 className="text-[10px] text-emerald-400 font-sci-fi uppercase tracking-widest mb-1 font-bold">Target Misi Utama:</h4>
                    <p className="text-slate-300 text-sm font-content">"{data.objective}"</p>
                </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-8 border-t border-slate-800 gap-4">
             <button 
                onClick={onBack}
                className="text-slate-500 hover:text-white font-sci-fi text-xs tracking-widest uppercase transition-colors"
             >
                &larr; Ganti Jalur Waktu
             </button>

             <button
                onClick={onStart}
                disabled={!showButton}
                className={`group relative flex items-center justify-center gap-4 bg-white hover:bg-gold-dust text-slate-900 font-black py-4 px-10 rounded-2xl transition-all shadow-2xl active:scale-95 overflow-hidden ${!showButton && 'opacity-30 cursor-wait'}`}
             >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                <span className="font-sci-fi text-sm tracking-[0.2em] uppercase z-10">MASUKI PORTAL WAKTU</span>
                <span className="text-xl z-10 group-hover:translate-x-2 transition-transform">🚀</span>
             </button>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-6">
          <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-holo-blue animate-ping"></span>
              <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Sinkronisasi Memori: 98%</span>
          </div>
          <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-dust animate-ping duration-1000"></span>
              <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Oksigen Temporal: Stabil</span>
          </div>
      </div>
    </div>
  );
};