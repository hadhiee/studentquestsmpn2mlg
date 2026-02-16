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
  const [emailInput, setEmailInput] = useState('siswa@gmail.com');
  const [nameInput, setNameInput] = useState('');
  const [classInput, setClassInput] = useState('');
  const [selectedSeed, setSelectedSeed] = useState(PRESET_SEEDS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  useEffect(() => {
    setCustomAvatarUrl(`https://api.dicebear.com/7.x/lorelei/svg?seed=${selectedSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9&flip=true`);
  }, [selectedSeed]);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    const redirectUrl = window.location.origin;
    console.log('Initiating Google Login. Redirect URL:', redirectUrl);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
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
      onStart(nameInput, emailInput, customAvatarUrl, classInput);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] relative overflow-hidden">
      {/* Background Layer: Oasis with Temporal Distortion */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 via-transparent to-[#0f172a] z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1509023464722-18d996393ca8?q=80&w=2070&auto=format&fit=crop"
          className="w-full h-full object-cover opacity-30 blur-[2px]"
          alt="Desert Backdrop"
        />
        {/* Animated Particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.1)_0%,transparent_70%)] animate-pulse"></div>
      </div>

      {/* Hero Section: Mascot Characters */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 pointer-events-none z-20 hidden lg:flex justify-between px-20 items-end overflow-hidden">
        <div className="w-80 h-[500px] transition-transform duration-700 translate-y-20 animate-slide-up">
          <img src="https://api.dicebear.com/7.x/lorelei/svg?seed=Adventurer1&flip=false&backgroundColor=transparent" className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(14,165,233,0.4)]" alt="Agent 1" />
        </div>
        <div className="w-80 h-[500px] transition-transform duration-700 translate-y-20 animate-slide-up [animation-delay:200ms]">
          <img src="https://api.dicebear.com/7.x/lorelei/svg?seed=Adventurer2&flip=true&backgroundColor=transparent" className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]" alt="Agent 2" />
        </div>
      </div>

      <div className="z-30 text-center max-w-5xl px-6 w-full flex flex-col items-center">
        {/* Title Area */}
        <div className="mb-10 animate-fade-in relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gold-dust text-black text-[10px] font-black px-4 py-1 rounded-full font-sci-fi tracking-widest animate-bounce">
            EDISI DINASTI UMAYYAH
          </div>
          <h1 className="text-6xl md:text-8xl font-black font-sci-fi text-white tracking-tighter filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
            CHRONO<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-holo-blue to-gold-dust">QUEST</span>
          </h1>
          <p className="text-slate-300 font-content text-xl mt-2 tracking-[0.3em] font-bold uppercase opacity-80">
            Penjelajah Peradaban Islam
          </p>
        </div>

        {/* Login Panel */}
        <div className="bg-white/10 backdrop-blur-3xl p-1 rounded-[3rem] border border-white/20 shadow-2xl w-full max-w-4xl ring-1 ring-white/10 animate-slide-up">
          <div className="bg-slate-900/90 rounded-[2.8rem] p-8 flex flex-col md:flex-row gap-8 items-center">

            {/* Left: Avatar Selection */}
            <div className="flex-1 w-full bg-slate-800/40 rounded-3xl p-6 border border-white/5 text-center">
              <h3 className="text-slate-400 font-sci-fi text-[10px] tracking-widest mb-4 uppercase font-bold">PILIH AVATAR AGEN</h3>

              <div className="relative mb-6 flex justify-center">
                <div className="w-36 h-36 rounded-3xl bg-gradient-to-br from-holo-blue to-gold-dust p-1 shadow-[0_0_30px_rgba(14,165,233,0.3)]">
                  <div className="w-full h-full bg-slate-900 rounded-[1.4rem] overflow-hidden">
                    <img src={customAvatarUrl} alt="Your Avatar" className="w-full h-full object-cover scale-110" />
                  </div>
                </div>
                <div className="absolute -bottom-2 bg-white text-slate-900 text-[8px] font-black px-3 py-1 rounded-lg font-sci-fi shadow-lg uppercase tracking-tighter">
                  Visual Anda
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {PRESET_SEEDS.map((seed) => (
                  <button
                    key={seed}
                    onClick={() => setSelectedSeed(seed)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedSeed === seed ? 'border-gold-dust scale-110 shadow-lg' : 'border-slate-700 hover:border-slate-500'}`}
                  >
                    <img src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`} alt={seed} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Form & Action */}
            <div className="flex-1 w-full flex flex-col gap-5 text-left">
              {isAuthenticating ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4">
                  <div className="w-16 h-16 border-4 border-holo-blue border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-holo-blue font-sci-fi text-xs tracking-widest animate-pulse">SINKRONISASI PORTAL...</p>
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="text-white font-black font-sci-fi text-sm mb-1">DATA DIRI AGEN</h4>
                    <p className="text-slate-500 text-xs font-content">Masukkan nama Anda untuk memulai misi sejarah.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full bg-white text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                      <span className="font-sci-fi text-xs tracking-widest uppercase">Mulai dengan Google</span>
                    </button>

                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-slate-700"></div>
                      <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] font-mono">ATAU MODE TAMU</span>
                      <div className="flex-grow border-t border-slate-700"></div>
                    </div>

                    <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 focus-within:border-holo-blue transition-all">
                      <label className="block text-[9px] text-slate-500 mb-1 font-sci-fi uppercase font-bold">Nama Lengkap Siswa</label>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full bg-transparent text-white focus:outline-none font-bold placeholder:text-slate-700"
                        placeholder="NAMA LENGKAP..."
                      />
                    </div>
                    <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 focus-within:border-holo-blue transition-all">
                      <label className="block text-[9px] text-slate-500 mb-1 font-sci-fi uppercase font-bold">Kelas / Absen (Opsional)</label>
                      <input
                        type="text"
                        value={classInput}
                        onChange={(e) => setClassInput(e.target.value)}
                        className="w-full bg-transparent text-white focus:outline-none placeholder:text-slate-700"
                        placeholder="MISAL: 7A / 01"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleStartGame}
                    className="group relative bg-gradient-to-r from-holo-blue to-sky-600 hover:from-gold-dust hover:to-amber-500 text-white hover:text-black font-black py-5 px-6 rounded-2xl transition-all shadow-[0_10px_30px_rgba(14,165,233,0.3)] hover:shadow-gold-dust/40 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
                  >
                    <span className="font-sci-fi text-sm tracking-widest uppercase z-10">MULAI PETUALANGAN</span>
                    <span className="text-xl z-10 group-hover:translate-x-2 transition-transform">➡</span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                  </button>

                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest font-bold">Server SMPN 2 Malang Aktif</p>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Footer Credit */}
        <p className="mt-8 text-[10px] text-slate-600 font-mono tracking-widest uppercase">
          &copy; 2026 by Bu Lia powered AI
        </p>
      </div>

      {/* Retro Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] z-50 bg-[length:100%_4px]"></div>
    </div>
  );
};