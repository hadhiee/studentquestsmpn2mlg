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
              <img
                src="/images/damascus.png"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Damascus Skyline"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200&auto=format&fit=crop';
                }}
              />
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
              <img
                src="/images/cordoba.png"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Mezquita de Cordoba"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=1200&auto=format&fit=crop';
                }}
              />
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