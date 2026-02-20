import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface StartScreenProps {
  onStart: (name: string, email: string, avatarUrl: string, className: string) => void;
}

const PRESET_SEEDS = [
  "Arka", "Kaila", "Gibran", "Nayla", "Farel",
  "Laras", "Zikri", "Tiara", "Baim", "Alya"
];

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [classInput, setClassInput] = useState('');
  const [selectedSeed, setSelectedSeed] = useState(PRESET_SEEDS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  useEffect(() => {
    setCustomAvatarUrl(`https://api.dicebear.com/7.x/lorelei/svg?seed=${selectedSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9&flip=true`);
  }, [selectedSeed]);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      alert(error.message);
      setIsAuthenticating(false);
    }
  };

  const handleStartGame = () => {
    if (!nameInput.trim()) {
      alert("Harap masukkan nama agen!");
      return;
    }
    setIsAuthenticating(true);
    setTimeout(() => {
      onStart(nameInput, '', customAvatarUrl, classInput);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/10 via-transparent to-[#0f172a] z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=2070&auto=format&fit=crop"
          className="w-full h-full object-cover opacity-20 blur-[2px]"
          alt="Backdrop"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0%,transparent_70%)] animate-pulse"></div>
      </div>

      <div className="z-20 max-w-4xl w-full flex flex-col items-center">
        {/* Logo/Brand Section */}
        <div className="text-center mb-6 md:mb-10 animate-fade-in group">
          <div className="relative inline-block mb-4 md:mb-6">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-3 md:p-4 border-2 md:border-4 border-holo-blue shadow-[0_0_50px_rgba(14,165,233,0.3)] group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
              <img src="/icon-512.png" className="w-full h-full object-contain" alt="Logo" />
              <div className="absolute inset-0 bg-gradient-to-tr from-holo-blue/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gold-dust text-slate-900 text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded shadow-xl animate-bounce">v2.5</div>
          </div>

          <h1 className="text-4xl md:text-7xl font-black font-sci-fi text-white mb-2 tracking-tighter drop-shadow-lg">
            CHRONO<span className="text-holo-blue">QUEST</span>
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-slate-500"></div>
            <p className="text-gold-dust font-sci-fi text-[10px] md:text-sm tracking-[0.3em] font-bold uppercase">Siswa Jelajah Waktu</p>
            <div className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-slate-500"></div>
          </div>
        </div>

        {/* Login Panel */}
        <div className="bg-white/10 backdrop-blur-2xl p-1 rounded-[2.5rem] md:rounded-[3rem] border border-white/20 shadow-2xl w-full max-w-4xl ring-1 ring-white/10 animate-slide-up">
          <div className="bg-slate-900/90 rounded-[2.3rem] md:rounded-[2.8rem] p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 items-center">

            {/* Avatar Selection */}
            <div className="w-full md:w-1/3 bg-slate-800/40 rounded-3xl p-5 border border-white/5 text-center">
              <h3 className="text-slate-500 font-sci-fi text-[9px] tracking-widest mb-4 uppercase font-bold">IDENTITAS VISUAL</h3>
              <div className="relative mb-5 flex justify-center">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-holo-blue to-gold-dust p-1 shadow-lg">
                  <div className="w-full h-full bg-slate-900 rounded-[1.2rem] overflow-hidden">
                    <img src={customAvatarUrl} alt="Avatar" className="w-full h-full object-cover scale-110" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {PRESET_SEEDS.map((seed) => (
                  <button
                    key={seed}
                    onClick={() => setSelectedSeed(seed)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedSeed === seed ? 'border-gold-dust scale-105 shadow-md' : 'border-slate-700 hover:border-slate-500 opacity-60'}`}
                  >
                    <img src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`} alt={seed} />
                  </button>
                ))}
              </div>
            </div>

            {/* Form Section */}
            <div className="flex-1 w-full flex flex-col gap-6">
              {isAuthenticating ? (
                <div className="flex flex-col items-center justify-center py-12 gap-5">
                  <div className="w-12 h-12 border-4 border-holo-blue border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-holo-blue font-sci-fi text-xs tracking-[0.2em] animate-pulse">SINKRONISASI TRANSMISI...</p>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-slate-900 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all active:scale-95 shadow-xl"
                  >
                    <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5" />
                    <span className="font-sci-fi text-[10px] md:text-xs tracking-widest uppercase">MASUK DENGAN GOOGLE</span>
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-700"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] font-mono">ATAU MODE TAMU</span>
                    <div className="flex-grow border-t border-slate-700"></div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-800/60 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-700 focus-within:border-holo-blue transition-all">
                      <label className="block text-[8px] md:text-[9px] text-slate-500 mb-1 font-sci-fi uppercase font-bold tracking-widest">Nama Lengkap Siswa</label>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full bg-transparent text-white focus:outline-none font-bold text-sm md:text-base placeholder:text-slate-700 uppercase"
                        placeholder="NAMA ANDA"
                      />
                    </div>
                    <div className="bg-slate-800/60 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-700 focus-within:border-holo-blue transition-all">
                      <label className="block text-[8px] md:text-[9px] text-slate-500 mb-1 font-sci-fi uppercase font-bold tracking-widest">Kelas / No. Absen</label>
                      <input
                        type="text"
                        value={classInput}
                        onChange={(e) => setClassInput(e.target.value)}
                        className="w-full bg-transparent text-white focus:outline-none font-bold text-sm md:text-base placeholder:text-slate-700 uppercase"
                        placeholder="MISAL: 7A / 01"
                      />
                    </div>
                  </div>

                  <button
                    disabled={!nameInput}
                    onClick={handleStartGame}
                    className={`w-full bg-gradient-to-r from-holo-blue to-sky-600 hover:from-gold-dust hover:to-amber-500 text-white hover:text-black font-black py-4 md:py-5 rounded-2xl md:rounded-3xl transition-all shadow-[0_10px_30px_rgba(14,165,233,0.3)] active:scale-95 flex items-center justify-center gap-3 group overflow-hidden ${!nameInput && 'opacity-30 grayscale cursor-not-allowed'}`}
                  >
                    <span className="font-sci-fi text-xs md:text-sm tracking-[0.2em] uppercase z-10">MASUK KE PORTAL WAKTU</span>
                    <span className="text-xl z-10 group-hover:translate-x-3 transition-transform">🚀</span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Credit */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] font-bold">Server SMPN 2 Malang Aktif</p>
          </div>
          <p className="text-[9px] text-slate-700 font-mono uppercase tracking-widest">© 2026 Powered by Gemini AI</p>
        </div>
      </div>
    </div>
  );
};