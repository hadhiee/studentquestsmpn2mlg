import React from 'react';

interface DynastySelectionProps {
  onSelect: (dynasty: 'umayyah1' | 'umayyah2') => void;
}

export const DynastySelection: React.FC<DynastySelectionProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-void-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.1)_0%,transparent_70%)]"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-gold-dust/5 blur-[80px] rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-holo-blue/5 blur-[100px] rounded-full"></div>

      <div className="z-10 text-center max-w-6xl w-full">
        <div className="mb-12 animate-fade-in">
          <h2 className="text-holo-blue font-sci-fi tracking-[0.4em] text-xs mb-4 uppercase font-bold">Inisialisasi Jalur Waktu</h2>
          <h1 className="text-4xl md:text-6xl font-bold font-sci-fi text-white mb-4 tracking-tighter shadow-sm">
            PILIH ERA <span className="text-gold-dust">DINASTI UMAYYAH</span>
          </h1>
          <p className="text-slate-500 font-content text-lg max-w-2xl mx-auto leading-relaxed">
            Pilih titik koordinat temporal untuk memulai misi Anda. Setiap era menyimpan rahasia peradaban yang berbeda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

          {/* Option: Umayyah 1 */}
          <button
            onClick={() => onSelect('umayyah1')}
            className="group relative bg-slate-900/40 border-2 border-slate-700 rounded-[2rem] p-8 transition-all hover:border-u-damascus hover:bg-slate-800/60 overflow-hidden text-left flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 p-6 text-6xl opacity-5 transition-transform group-hover:scale-150 group-hover:rotate-12 select-none">🕌</div>
            <div className="mb-6 relative h-48 rounded-2xl overflow-hidden border border-white/5">
              <div className="w-full h-full bg-[#1e293b] flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
                <svg viewBox="0 0 200 120" className="w-full h-full opacity-60">
                  <defs>
                    <linearGradient id="sky1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#2d1b69", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#1e293b", stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <rect width="200" height="120" fill="url(#sky1)" />
                  <circle cx="150" cy="40" r="20" fill="#ffd700" opacity="0.2" />
                  <g fill="#0f172a">
                    <rect x="40" y="60" width="30" height="60" rx="2" />
                    <rect x="75" y="45" width="50" height="75" rx="2" />
                    <rect x="130" y="70" width="30" height="50" rx="2" />
                    <circle cx="100" cy="45" r="25" />
                    <rect x="98" y="10" width="4" height="40" />
                  </g>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/20 font-sci-fi text-[40px] font-bold tracking-widest blur-[1px]">DAMASCUS</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-u-damascus text-white text-[10px] font-bold font-sci-fi px-3 py-1 rounded-full uppercase tracking-widest">Wilayah Timur</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold font-sci-fi text-white mb-3 group-hover:text-gold-dust transition-colors">UMAYYAH I: DAMASKUS</h3>
            <p className="text-slate-400 text-sm font-content leading-relaxed flex-1">
              Era pembentukan kekhalifahan pertama. Fokus pada sentralisasi pemerintahan, pembangunan Masjid Agung Damaskus, dan perluasan wilayah dari Asia hingga Afrika Utara.
            </p>
            <div className="mt-6 flex items-center gap-2 text-gold-dust font-bold text-xs font-sci-fi group-hover:translate-x-2 transition-transform">
              MULAI MISI <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
          </button>

          {/* Option: Umayyah 2 */}
          <button
            onClick={() => onSelect('umayyah2')}
            className="group relative bg-slate-900/40 border-2 border-slate-700 rounded-[2rem] p-8 transition-all hover:border-u-cordoba hover:bg-slate-800/60 overflow-hidden text-left flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 p-6 text-6xl opacity-5 transition-transform group-hover:scale-150 group-hover:rotate-12 select-none">🔬</div>
            <div className="mb-6 relative h-48 rounded-2xl overflow-hidden border border-white/5">
              <div className="w-full h-full bg-[#1e293b] flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
                <svg viewBox="0 0 200 120" className="w-full h-full opacity-60">
                  <defs>
                    <linearGradient id="sky2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#b45309", stopOpacity: 0.3 }} />
                      <stop offset="100%" style={{ stopColor: "#1e293b", stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <rect width="200" height="120" fill="url(#sky2)" />
                  <g stroke="#c85a54" strokeWidth="2" fill="none" opacity="0.4">
                    {[20, 40, 60, 80, 100, 120, 140, 160, 180].map(x => (
                      <path key={x} d={`M ${x},120 L ${x},40 Q ${x + 10},20 ${x + 20},40 L ${x + 20},120`} />
                    ))}
                  </g>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/20 font-sci-fi text-[40px] font-bold tracking-widest blur-[1px]">CORDOBA</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-u-cordoba text-white text-[10px] font-bold font-sci-fi px-3 py-1 rounded-full uppercase tracking-widest">Wilayah Barat</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold font-sci-fi text-white mb-3 group-hover:text-gold-dust transition-colors">UMAYYAH II: ANDALUSIA</h3>
            <p className="text-slate-400 text-sm font-content leading-relaxed flex-1">
              Era keemasan di Spanyol. Jelajahi Cordoba sebagai pusat ilmu pengetahuan dunia. Pelajari toleransi beragama (La Convivencia) dan kemajuan astronomi serta kedokteran.
            </p>
            <div className="mt-6 flex items-center gap-2 text-gold-dust font-bold text-xs font-sci-fi group-hover:translate-x-2 transition-transform">
              MULAI MISI <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
          </button>

        </div>

        <p className="mt-12 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
          SMPN 2 MALANG // CHRONO-PORTAL V2.5
        </p>
      </div>
    </div>
  );
};