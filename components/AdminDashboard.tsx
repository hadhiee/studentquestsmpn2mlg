import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { GameState } from '../types';

interface AdminDashboardProps {
    onBack: () => void;
}

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    score: number;
    energy: number;
    school: string;
    class_name?: string;
    updated_at: string;
    avatar_url?: string;
    is_guest?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSSO: 0,
        totalGuests: 0,
        avgScore: 0
    });

    useEffect(() => {
        fetchUsers();

        // Subscribe to real-time changes
        const profileSubscription = supabase
            .channel('public:profiles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                fetchUsers();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(profileSubscription);
        };
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('score', { ascending: false });

            if (error) throw error;

            if (data) {
                setUsers(data as UserProfile[]);

                const sso = data.filter(u => !u.is_guest).length;
                const guests = data.filter(u => u.is_guest).length;
                const totalScore = data.reduce((acc, curr) => acc + (curr.score || 0), 0);

                setStats({
                    totalUsers: data.length,
                    totalSSO: sso,
                    totalGuests: guests,
                    avgScore: data.length > 0 ? Math.round(totalScore / data.length) : 0
                });
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6 font-content">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold font-sci-fi text-gold-dust tracking-tighter">ADMIN COMMAND CENTER</h1>
                    <p className="text-slate-400">Monitoring real-time aktivitas agen di seluruh lini masa.</p>
                </div>
                <button
                    onClick={onBack}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-xl border border-slate-600 transition-all flex items-center gap-2 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    KEMBALI KE GAME
                </button>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm">
                    <p className="text-slate-500 text-xs font-sci-fi uppercase tracking-wider mb-1">Total Agen</p>
                    <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm">
                    <p className="text-blue-500 text-xs font-sci-fi uppercase tracking-wider mb-1">Agen SSO</p>
                    <p className="text-3xl font-bold text-white">{stats.totalSSO}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm">
                    <p className="text-amber-500 text-xs font-sci-fi uppercase tracking-wider mb-1">Agen Tamu</p>
                    <p className="text-3xl font-bold text-white">{stats.totalGuests}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm">
                    <p className="text-green-500 text-xs font-sci-fi uppercase tracking-wider mb-1">Rata-rata Skor</p>
                    <p className="text-3xl font-bold text-white">{stats.avgScore} <span className="text-sm font-normal text-slate-500 italic">pts</span></p>
                </div>
            </div>

            {/* Main Table Area */}
            <div className="max-w-7xl mx-auto bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
                    <h2 className="text-xl font-bold font-sci-fi text-white">RIWAYAT AKTIVITAS AGEN</h2>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-500 text-xs font-bold font-sci-fi uppercase tracking-widest leading-none">Live Sync</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/40 text-slate-400 text-xs uppercase tracking-widest">
                                <th className="px-6 py-4 font-bold">Agen</th>
                                <th className="px-6 py-4 font-bold">Email / Status</th>
                                <th className="px-6 py-4 font-bold">Sekolah</th>
                                <th className="px-6 py-4 font-bold text-right">Skor</th>
                                <th className="px-6 py-4 font-bold text-right">Update Terakhir</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                                        Memuat data intelijen...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                                        Belum ada agen yang terdaftar di lini masa.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border-2 border-slate-700 flex-shrink-0">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                                            {user.full_name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">{user.full_name}</p>
                                                    <p className={`text-[10px] ${user.is_guest ? 'text-amber-500' : 'text-blue-500'} font-sci-fi uppercase tracking-wider`}>
                                                        {user.is_guest ? 'Guest Agent' : 'SSO Agent'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {user.email || 'None'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {user.school || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-2xl font-bold text-holo-blue font-sci-fi tracking-tighter">{user.score}</span>
                                            <span className="text-[10px] text-slate-500 font-sci-fi ml-1">pts</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-500 text-xs font-mono">
                                            {new Date(user.updated_at).toLocaleString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                day: '2-digit',
                                                month: 'short'
                                            })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
