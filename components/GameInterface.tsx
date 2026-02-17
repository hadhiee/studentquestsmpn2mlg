import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Question, PlayerStats, Artifact, Competitor, MaterialContent } from '../types';
import { generateQuestion, getHistoricalFact } from '../services/geminiService';
import { LEVELS, FALLBACK_QUESTIONS, MAX_ENERGY, POINTS_PER_QUESTION, LEVEL_1_MAP_NODES } from '../constants';
import { ArtifactModal } from './ArtifactModal';
import { MaterialModal } from './MaterialModal';
import { Leaderboard } from './Leaderboard';
import { MapBoard } from './MapBoard';
import { ChatSystem } from './ChatSystem';

interface GameInterfaceProps {
    levelId: number;
    playerStats: PlayerStats;
    competitors: Competitor[];
    onUpdateStats: (newStats: PlayerStats) => void;
    onGameOver: (win: boolean) => void;
    onExit: () => void;
}

export const GameInterface: React.FC<GameInterfaceProps> = ({ levelId, playerStats, competitors, onUpdateStats, onGameOver, onExit }) => {
    const [viewMode, setViewMode] = useState<'MAP' | 'QUIZ' | 'DASHBOARD'>('MAP');
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [loading, setLoading] = useState(false);
    const [energy, setEnergy] = useState(MAX_ENERGY);
    const [currentScore, setCurrentScore] = useState(playerStats.score);
    const [currentNodeIndex, setCurrentNodeIndex] = useState(playerStats.currentNodeIndex || 0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const [showArtifact, setShowArtifact] = useState<Artifact | null>(null);
    const [activeMaterial, setActiveMaterial] = useState<MaterialContent | null>(null);
    const [fact, setFact] = useState<string>('');

    const [isTeacherMode, setIsTeacherMode] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [teacherFeedbackMsg, setTeacherFeedbackMsg] = useState<{ id: string, msg: string } | null>(null);
    const [liveLogs, setLiveLogs] = useState<{ id: string, text: string, time: string }[]>([]);

    const canAccessTeacherMode = playerStats.email === 'hadhiee@gmail.com';
    const selectedStudent = competitors.find(c => c.id === selectedStudentId);

    // Monitor logs for teacher
    useEffect(() => {
        if (!isTeacherMode) return;

        const latestMove = competitors.find(c => Date.now() - c.lastUpdate < 4000);
        if (latestMove) {
            const logText = latestMove.lastAnswerStatus === 'correct'
                ? `${latestMove.name} menjawab BENAR di ${LEVEL_1_MAP_NODES[latestMove.currentNodeIndex].label}`
                : latestMove.lastAnswerStatus === 'wrong'
                    ? `${latestMove.name} menjawab SALAH di ${LEVEL_1_MAP_NODES[latestMove.currentNodeIndex].label}`
                    : `${latestMove.name} sedang: ${latestMove.currentActivity}`;

            const newLog = { id: Date.now().toString(), text: logText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) };
            setLiveLogs(prev => [newLog, ...prev].slice(0, 20));
        }
    }, [competitors, isTeacherMode]);

    const loadQuestionForNode = useCallback(async (nodeIndex: number) => {
        setLoading(true);
        setSelectedOption(null);
        setFeedback(null);
        const node = LEVEL_1_MAP_NODES[nodeIndex];
        let q: Question | undefined;
        if (node.questionId) q = FALLBACK_QUESTIONS.find(fq => fq.id === node.questionId);
        if (!q) {
            const context = [`Lokasi saat ini: ${node.label}`];
            q = await generateQuestion(levelId, context);
        }
        if (!q) q = FALLBACK_QUESTIONS[nodeIndex % FALLBACK_QUESTIONS.length];
        setCurrentQuestion(q);
        setLoading(false);
        setViewMode('QUIZ');
    }, [levelId]);

    useEffect(() => {
        getHistoricalFact().then(setFact);
    }, [currentNodeIndex]);

    const handleNodeClick = (index: number) => {
        if (index === currentNodeIndex) {
            const node = LEVEL_1_MAP_NODES[index];
            if (node.type === 'MATERIAL' && node.materialContent) setActiveMaterial(node.materialContent);
            else loadQuestionForNode(index);
        }
    };

    const handleMaterialClose = () => {
        setActiveMaterial(null);
        const nextNodeIdx = currentNodeIndex + 1;
        const newScore = currentScore + 50;
        setCurrentScore(newScore);
        onUpdateStats({ ...playerStats, score: newScore, currentNodeIndex: nextNodeIdx });
        setCurrentNodeIndex(nextNodeIdx);
    };

    const handleAnswer = (index: number) => {
        if (selectedOption !== null || !currentQuestion) return;
        setSelectedOption(index);
        if (index === currentQuestion.correctIndex) {
            setFeedback('correct');
            const newScore = currentScore + POINTS_PER_QUESTION;
            setCurrentScore(newScore);
            const nextNodeIdx = currentNodeIndex + 1;
            onUpdateStats({ ...playerStats, score: newScore, currentNodeIndex: nextNodeIdx });
            if (nextNodeIdx >= LEVEL_1_MAP_NODES.length) {
                setTimeout(() => {
                    const newArtifact: Artifact = {
                        id: `art-${Date.now()}`,
                        name: 'Peta Dunia Al-Idrisi',
                        description: 'Peta dunia paling akurat di abad pertengahan yang dibuat oleh kartografer Muslim untuk Raja Roger II.',
                        imageUrl: 'https://picsum.photos/seed/map/200/200',
                        obtainedAtLevel: levelId
                    };
                    setShowArtifact(newArtifact);
                }, 1500);
            } else {
                setTimeout(() => {
                    setCurrentNodeIndex(nextNodeIdx);
                    setViewMode('MAP');
                }, 2000);
            }
        } else {
            setFeedback('wrong');
            const newEnergy = energy - 1;
            setEnergy(newEnergy);
            if (newEnergy <= 0) setTimeout(() => onGameOver(false), 2000);
            else setTimeout(() => setViewMode('MAP'), 3000);
        }
    };

    const handleArtifactClose = () => {
        setShowArtifact(null);
        onGameOver(true);
    };

    const handleSendFeedback = (studentId: string, type: 'correct' | 'incorrect') => {
        setTeacherFeedbackMsg({ id: studentId, msg: `Feedback "${type === 'correct' ? 'Bagus!' : 'Coba Lagi'}" terkirim!` });
        setTimeout(() => setTeacherFeedbackMsg(null), 2000);
    };

    const handleBroadcast = () => {
        const msg = { id: 'broadcast', text: "GURU: Tetap semangat agen temporal! Masa depan ada di tangan kalian.", time: "NOW" };
        setLiveLogs(prev => [msg, ...prev]);
        alert("Pesan motivasi dikirim ke seluruh kelas!");
    };

    return (
        <div className="min-h-screen bg-void-dark text-white flex flex-col relative overflow-hidden">
            {/* HUD Header */}
            <header className="bg-slate-900/95 border-b border-slate-700 p-3 md:p-4 sticky top-0 z-40 flex justify-between items-center shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-2 md:gap-4">
                    <button onClick={onExit} className="text-slate-400 hover:text-white transition-colors p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div className="flex flex-col">
                        <span className="text-[8px] md:text-xs text-slate-400 font-sci-fi">ENERGI</span>
                        <div className="flex gap-0.5 md:gap-1">
                            {[...Array(MAX_ENERGY)].map((_, i) => (
                                <div key={i} className={`h-1.5 md:h-2 w-4 md:w-6 rounded-full ${i < energy ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-slate-700'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-center hidden md:block">
                    <h1 className="text-gold-dust font-sci-fi tracking-widest text-sm uppercase">MISI: {LEVELS.find(l => l.id === levelId)?.title}</h1>
                    <p className="text-[10px] text-slate-500 max-w-md truncate mx-auto font-mono">{fact || "Sinkronisasi data sejarah..."}</p>
                </div>

                <div className="flex items-center gap-4">
                    {canAccessTeacherMode && (
                        <div className="flex items-center gap-3 bg-slate-800/50 p-1 px-3 rounded-full border border-slate-700">
                            <button
                                onClick={() => setViewMode(viewMode === 'DASHBOARD' ? 'MAP' : 'DASHBOARD')}
                                className={`text-[10px] font-bold font-sci-fi px-3 py-1 rounded-full transition-all ${viewMode === 'DASHBOARD' ? 'bg-emerald-600 text-white shadow-[0_0_10px_#10b981]' : 'text-slate-400 hover:text-emerald-400'}`}
                            >
                                DASHBOARD
                            </button>
                            <div className="w-px h-4 bg-slate-700"></div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold ${isTeacherMode ? 'text-green-400' : 'text-slate-500'}`}>MONITOR</span>
                                <button
                                    onClick={() => { setIsTeacherMode(!isTeacherMode); if (isTeacherMode) setSelectedStudentId(null); }}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${isTeacherMode ? 'bg-green-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${isTeacherMode ? 'left-6' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col items-end">
                        <span className="text-[8px] md:text-xs text-slate-400 font-sci-fi uppercase">SINKRONISASI</span>
                        <div className="w-16 md:w-24 bg-slate-700 h-1.5 md:h-2 rounded-full overflow-hidden">
                            <div className="bg-holo-blue h-full transition-all duration-500 shadow-[0_0_8px_#0ea5e9]" style={{ width: `${(currentNodeIndex / LEVEL_1_MAP_NODES.length) * 100}%` }}></div>
                        </div>
                        <span className="text-[10px] md:text-xs font-mono text-gold-dust mt-0.5 md:mt-1">{currentScore} PTS</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl flex flex-col gap-6 relative">

                {viewMode === 'MAP' && (
                    <div className="transition-all duration-500 flex-1 flex flex-col relative">
                        <h2 className="text-holo-blue font-sci-fi text-sm md:text-lg mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 md:w-3 md:h-3 bg-holo-blue rounded-full animate-pulse"></span>
                            RADAR TAKTIS REAL-TIME
                        </h2>
                        <div className="relative flex-1">
                            <MapBoard
                                nodes={LEVEL_1_MAP_NODES}
                                currentNodeIndex={currentNodeIndex}
                                onNodeClick={handleNodeClick}
                                isTeacherMode={canAccessTeacherMode && isTeacherMode}
                                competitors={competitors}
                                playerStats={playerStats}
                                selectedStudentId={selectedStudentId}
                                onStudentClick={setSelectedStudentId}
                            />

                            {isTeacherMode && selectedStudent && (
                                <div className="absolute bottom-4 right-4 z-50 w-80 bg-slate-900/95 backdrop-blur border-2 border-emerald-500/50 rounded-xl p-5 shadow-2xl animate-fade-in ring-1 ring-emerald-400/20">
                                    <div className="flex justify-between items-start mb-4 border-b border-slate-700 pb-2">
                                        <div className="flex items-center gap-3">
                                            <img src={selectedStudent.avatarUrl} className="w-12 h-12 rounded-full border-2 border-emerald-500 shadow-lg" alt="" />
                                            <div>
                                                <h3 className="text-emerald-400 font-bold font-sci-fi text-sm truncate w-32">{selectedStudent.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                    <p className="text-[10px] text-slate-400 font-mono">AKTIF | {selectedStudent.score} PTS</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedStudentId(null)} className="text-slate-500 hover:text-white text-xl">✕</button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-800 p-2 rounded border border-slate-700">
                                                <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Energi</p>
                                                <div className="flex gap-1">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className={`h-1.5 w-full rounded-full ${i < selectedStudent.energy ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-slate-800 p-2 rounded border border-slate-700">
                                                <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Status</p>
                                                <p className={`text-[10px] font-bold ${selectedStudent.lastAnswerStatus === 'correct' ? 'text-green-400' : selectedStudent.lastAnswerStatus === 'wrong' ? 'text-red-400' : 'text-blue-400'}`}>
                                                    {selectedStudent.lastAnswerStatus === 'correct' ? '✓ BENAR' : selectedStudent.lastAnswerStatus === 'wrong' ? '⚠ SALAH' : 'PENGAMATAN'}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Aktivitas</p>
                                            <div className="text-xs text-white bg-slate-800 p-2.5 rounded border border-slate-700 italic">
                                                "{selectedStudent.currentActivity}"
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-slate-700">
                                            {teacherFeedbackMsg && teacherFeedbackMsg.id === selectedStudent.id ? (
                                                <div className="text-center py-2 bg-green-900/30 rounded border border-green-500/30 text-green-300 text-xs font-bold animate-pulse">
                                                    {teacherFeedbackMsg.msg}
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleSendFeedback(selectedStudent.id, 'correct')} className="flex-1 bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-600/50 py-2 rounded text-xs font-bold transition-all">👍 BENAR</button>
                                                    <button onClick={() => handleSendFeedback(selectedStudent.id, 'incorrect')} className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/50 py-2 rounded text-xs font-bold transition-all">⚠️ SALAH</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {viewMode === 'DASHBOARD' && canAccessTeacherMode && (
                    <div className="flex-1 flex flex-col md:flex-row gap-6 animate-fade-in overflow-hidden">
                        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                            <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div>
                                    <h2 className="text-emerald-400 font-sci-fi text-xl">CONTROL CENTER GURU</h2>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Misi: Ekspedisi Umayyah - Kelas 7 SMPN 2 Malang</p>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={handleBroadcast} className="bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/50 px-4 py-2 rounded-lg text-xs font-bold text-emerald-300 transition-all flex items-center gap-2">
                                        <span>📣</span> BROADCAST PESAN
                                    </button>
                                    <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-700 text-center min-w-[80px]">
                                        <p className="text-[10px] text-slate-500 font-bold">TOTAL SKOR</p>
                                        <p className="text-xl font-bold text-gold-dust">
                                            {Math.round([...competitors, { score: currentScore }].reduce((acc, c) => acc + c.score, 0))}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pr-2 pb-10 flex-1">
                                {competitors.map((student) => {
                                    const feedbackActive = teacherFeedbackMsg && teacherFeedbackMsg.id === student.id;
                                    return (
                                        <div key={student.id} className={`bg-slate-800/40 border-2 rounded-xl p-4 transition-all hover:bg-slate-800/60 ${feedbackActive ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-slate-700/50'}`}>
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden">
                                                    <img src={student.avatarUrl} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-bold text-white truncate">{student.name}</h4>
                                                        <span className="text-[10px] text-gold-dust font-mono font-bold bg-slate-900 px-1.5 rounded">{student.score} PTS</span>
                                                    </div>
                                                    <div className="flex gap-1 mt-1">
                                                        {[...Array(3)].map((_, i) => (
                                                            <div key={i} className={`h-1 flex-1 rounded-full ${i < student.energy ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-400 mb-2 truncate font-mono">📍 {LEVEL_1_MAP_NODES[student.currentNodeIndex]?.label || 'Basis'}</p>
                                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-3">
                                                <div className="bg-emerald-500 h-full transition-all duration-1000 shadow-[0_0_5px_#10b981]" style={{ width: `${(student.currentNodeIndex / LEVEL_1_MAP_NODES.length) * 100}%` }}></div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleSendFeedback(student.id, 'correct')} className="flex-1 text-[9px] font-bold bg-slate-900/50 border border-slate-700 hover:bg-green-900/30 text-slate-400 hover:text-green-400 py-1.5 rounded transition-all">👍 BENAR</button>
                                                <button onClick={() => handleSendFeedback(student.id, 'incorrect')} className="flex-1 text-[9px] font-bold bg-slate-900/50 border border-slate-700 hover:bg-red-900/30 text-slate-400 hover:text-red-400 py-1.5 rounded transition-all">⚠️ SALAH</button>
                                                <button onClick={() => { setViewMode('MAP'); setSelectedStudentId(student.id); }} className="px-3 bg-slate-900 border border-slate-700 hover:bg-holo-blue/30 text-slate-500 hover:text-holo-blue py-1.5 rounded transition-all" title="Lihat Lokasi">🎯</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="w-full md:w-80 bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden flex flex-col">
                            <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
                                <h3 className="text-emerald-400 font-sci-fi text-xs tracking-widest uppercase flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> LIVE LOGS
                                </h3>
                                <button onClick={() => setLiveLogs([])} className="text-[10px] text-slate-500 hover:text-white uppercase font-bold">Clear</button>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 font-mono">
                                {liveLogs.length === 0 && <p className="text-[10px] text-slate-600 text-center py-10 italic">Menunggu transmisi data...</p>}
                                {liveLogs.map(log => (
                                    <div key={log.id} className={`text-[10px] leading-tight pb-2 border-b border-slate-800 animate-slide-in ${log.id === 'broadcast' ? 'text-emerald-300 font-bold bg-emerald-900/10 p-1 rounded' : 'text-slate-400'}`}>
                                        <span className="text-slate-600">[{log.time}]</span> {log.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'QUIZ' && (
                    <div className="flex-1 bg-slate-900/90 border border-slate-600 rounded-xl p-6 relative animate-fade-in shadow-2xl">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64">
                                <div className="w-12 h-12 border-4 border-holo-blue border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-holo-blue font-sci-fi text-sm">MENGAKSES DATABASE SEJARAH...</p>
                            </div>
                        ) : currentQuestion ? (
                            <div className="max-w-3xl mx-auto">
                                <div className="flex justify-between items-center mb-4 md:mb-6">
                                    <span className="bg-slate-800 text-gold-dust px-2 md:px-3 py-1 rounded text-[9px] md:text-[10px] font-bold border border-slate-600 uppercase tracking-widest">
                                        LOKASI: {LEVEL_1_MAP_NODES[currentNodeIndex].label}
                                    </span>
                                    <button onClick={() => setViewMode('MAP')} className="text-[10px] md:text-xs text-slate-400 hover:text-white font-bold">TUTUP</button>
                                </div>

                                <h3 className="text-lg md:text-2xl font-bold font-content mb-6 md:mb-8 leading-relaxed text-center">
                                    {currentQuestion.text}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentQuestion.options.map((option, idx) => {
                                        let btnClass = "p-4 rounded-lg border-2 text-left transition-all duration-300 relative group ";
                                        if (selectedOption === null) {
                                            btnClass += "bg-slate-800 border-slate-700 hover:border-holo-blue hover:bg-slate-750";
                                        } else {
                                            if (idx === currentQuestion.correctIndex) btnClass += "bg-green-900/40 border-green-500 text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
                                            else if (idx === selectedOption) btnClass += "bg-red-900/40 border-red-500 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
                                            else btnClass += "bg-slate-800 border-slate-700 opacity-50";
                                        }

                                        return (
                                            <button key={idx} onClick={() => handleAnswer(idx)} disabled={selectedOption !== null} className={btnClass}>
                                                <div className="flex items-center gap-3">
                                                    <span className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] md:text-xs font-mono border border-slate-600 group-hover:border-holo-blue transition-colors">
                                                        {String.fromCharCode(65 + idx)}
                                                    </span>
                                                    <span className="font-content text-base md:text-lg">{option}</span>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>

                                {feedback && (
                                    <div className={`mt-6 p-4 rounded-lg border-2 flex gap-4 items-start animate-bounce-subtle ${feedback === 'correct' ? 'bg-green-900/30 border-green-500/50' : 'bg-red-900/30 border-red-500/50'}`}>
                                        <div className={`text-2xl mt-1 ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                                            {feedback === 'correct' ? '✓' : '⚠'}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold font-sci-fi text-sm mb-1 ${feedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                                                {feedback === 'correct' ? 'DATA VALID' : 'SINKRONISASI GAGAL'}
                                            </h4>
                                            <p className="text-sm text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
                                            <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-widest">Memperbarui sistem radar dalam 3 detik...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-red-500 font-bold">KONEKSI TERPUTUS. SILAKAN COBA LAGI.</div>
                        )}
                    </div>
                )}

            </main>

            {viewMode === 'MAP' && (
                <div className="hidden xl:block fixed right-4 top-24 bottom-4 w-64 z-10 pointer-events-none opacity-80 transition-all hover:opacity-100">
                    <div className="pointer-events-auto h-full">
                        <Leaderboard competitors={competitors} playerStats={playerStats} />
                    </div>
                </div>
            )}

            {/* Floating Chat System */}
            <ChatSystem competitors={competitors} playerStats={playerStats} />

            {showArtifact && <ArtifactModal artifact={showArtifact} onClose={handleArtifactClose} />}
            {activeMaterial && <MaterialModal content={activeMaterial} onClose={handleMaterialClose} />}

            <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-50 bg-[length:100%_4px,3px_100%]"></div>
        </div>
    );
};