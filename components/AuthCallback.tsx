import React, { useEffect, useState } from 'react';
import { GameState } from '../types';

interface AuthCallbackProps {
    onComplete: () => void;
}

export const AuthCallback: React.FC<AuthCallbackProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('MEMINDAI SINYAL BIOMETRIK...');

    useEffect(() => {
        // Artificial progress bar
        const duration = 2500; // 2.5 seconds total
        const interval = 50;
        const step = 100 / (duration / interval);

        const timer = setInterval(() => {
            setProgress(prev => {
                const next = prev + step;

                if (next > 30 && next < 60) setStatus('MENVERIFIKASI TANDA TANGAN DIGITAL...');
                if (next > 60 && next < 90) setStatus('MENGHUBUNGKAN KE REKAM JEJAK WAKTU...');
                if (next >= 100) {
                    setStatus('AKSES DIBERIKAN. MEMUAT ANTARMUKA...');
                    clearInterval(timer);
                    setTimeout(onComplete, 800); // Small delay before transition
                    return 100;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-[#0f172a] flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>

            <div className="relative z-10 w-full max-w-md p-8 flex flex-col items-center">
                {/* Logo/Icon */}
                <div className="w-24 h-24 mb-8 relative">
                    <div className="absolute inset-0 border-4 border-holo-blue/30 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-4 border-holo-blue rounded-full flex items-center justify-center bg-slate-900 shadow-[0_0_30px_rgba(14,165,233,0.5)]">
                        <span className="text-4xl">🔐</span>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-sci-fi font-bold text-white mb-2 tracking-widest text-center">
                    OTENTIKASI SUKSES
                </h2>

                {/* Status Text */}
                <p className="font-mono text-holo-blue text-xs uppercase tracking-[0.2em] mb-8 h-6 text-center animate-pulse">
                    {status}
                </p>

                {/* Progress Bar Container */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700 relative shadow-inner">
                    {/* Progress Fill */}
                    <div
                        className="h-full bg-gradient-to-r from-holo-blue to-cyan-400 transition-all duration-100 ease-linear relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-holo-blue opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-holo-blue opacity-50"></div>

                {/* Security code decoration */}
                <div className="mt-8 font-mono text-[10px] text-slate-600 flex justify-between w-full">
                    <span>SEC-LEVEL-5</span>
                    <span>ID: {Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
};
