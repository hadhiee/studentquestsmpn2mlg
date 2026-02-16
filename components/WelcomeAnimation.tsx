import React, { useEffect, useState } from 'react';

interface WelcomeAnimationProps {
    playerName: string;
    avatarUrl?: string;
    onComplete: () => void;
}

export const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ playerName, avatarUrl, onComplete }) => {
    const [phase, setPhase] = useState<'portal' | 'reveal' | 'complete'>('portal');
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

    useEffect(() => {
        // Generate random particles
        const newParticles = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 0.5,
        }));
        setParticles(newParticles);

        // Phase transitions
        const timer1 = setTimeout(() => setPhase('reveal'), 1500);
        const timer2 = setTimeout(() => setPhase('complete'), 3500);
        const timer3 = setTimeout(() => onComplete(), 5000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] bg-void-dark flex items-center justify-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-holo-blue/20 via-void-dark to-gold-dust/20 animate-pulse"></div>

            {/* Particles */}
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute w-2 h-2 bg-gold-dust rounded-full animate-ping"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        animationDelay: `${particle.delay}s`,
                        opacity: 0.6,
                    }}
                />
            ))}

            {/* Radial Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.3)_0%,transparent_70%)] animate-pulse"></div>

            {/* Main Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl">
                {phase === 'portal' && (
                    <div className="animate-fade-in">
                        <div className="relative inline-block mb-8">
                            <div className="w-32 h-32 mx-auto border-4 border-holo-blue rounded-full animate-spin-slow"></div>
                            <div className="absolute inset-0 w-32 h-32 mx-auto border-4 border-gold-dust rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-holo-blue to-gold-dust rounded-full blur-xl animate-pulse"></div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-sci-fi text-holo-blue tracking-[0.3em] animate-pulse">
                            INISIALISASI PORTAL TEMPORAL...
                        </h2>
                    </div>
                )}

                {phase === 'reveal' && (
                    <div className="animate-slide-up">
                        {/* Avatar with Epic Glow */}
                        {avatarUrl && (
                            <div className="relative inline-block mb-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-holo-blue to-gold-dust rounded-full blur-3xl animate-pulse scale-150"></div>
                                <div className="relative w-40 h-40 mx-auto rounded-full border-4 border-gold-dust p-2 bg-slate-900 shadow-[0_0_50px_rgba(251,191,36,0.5)]">
                                    <img src={avatarUrl} alt={playerName} className="w-full h-full rounded-full object-cover" />
                                </div>
                                <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-black px-3 py-1 rounded-full font-sci-fi animate-bounce shadow-lg">
                                    ONLINE
                                </div>
                            </div>
                        )}

                        {/* Welcome Text */}
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-black font-sci-fi text-transparent bg-clip-text bg-gradient-to-r from-holo-blue via-white to-gold-dust animate-pulse tracking-tighter">
                                SELAMAT DATANG
                            </h1>
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-gold-dust blur-2xl opacity-50"></div>
                                <h2 className="relative text-4xl md:text-6xl font-black font-sci-fi text-gold-dust tracking-wider">
                                    AGEN {playerName.toUpperCase()}
                                </h2>
                            </div>
                        </div>

                        {/* Status Messages */}
                        <div className="mt-12 space-y-3 text-holo-blue font-mono text-sm">
                            <p className="animate-pulse">✓ Koneksi temporal: <span className="text-green-400 font-bold">STABIL</span></p>
                            <p className="animate-pulse" style={{ animationDelay: '0.2s' }}>✓ Identitas agen: <span className="text-green-400 font-bold">TERVERIFIKASI</span></p>
                            <p className="animate-pulse" style={{ animationDelay: '0.4s' }}>✓ Akses database sejarah: <span className="text-green-400 font-bold">GRANTED</span></p>
                            <p className="animate-pulse" style={{ animationDelay: '0.6s' }}>✓ Sinkronisasi dengan {Math.floor(Math.random() * 20 + 10)} agen lain: <span className="text-green-400 font-bold">AKTIF</span></p>
                        </div>
                    </div>
                )}

                {phase === 'complete' && (
                    <div className="animate-fade-in">
                        <div className="text-6xl mb-6 animate-bounce">🎮</div>
                        <h3 className="text-3xl font-sci-fi text-white mb-4 tracking-widest">
                            MISI DIMULAI!
                        </h3>
                        <p className="text-slate-400 font-content text-lg">
                            Bersiaplah untuk petualangan sejarah yang epik...
                        </p>
                        <div className="mt-8 flex justify-center">
                            <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-holo-blue to-gold-dust animate-[shimmer_1s_ease-in-out]" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Epic Flash Effect */}
            {phase === 'complete' && (
                <div className="absolute inset-0 bg-white animate-[flash_0.5s_ease-out]"></div>
            )}

            {/* Scanline Effect */}
            <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20"></div>
        </div>
    );
};
