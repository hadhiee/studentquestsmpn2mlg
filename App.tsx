import React, { useState, useEffect } from 'react';
import { GameState, PlayerStats, Competitor } from './types';
import { StartScreen } from './components/StartScreen';
import { LevelSelect } from './components/LevelSelect';
import { GameInterface } from './components/GameInterface';
import { DynastySelection } from './components/DynastySelection';
import { DynastyBriefing } from './components/DynastyBriefing';
import { CLASSMATES_NAMES, LEVEL_1_MAP_NODES } from './constants';
import { supabase } from './supabaseClient';
import { WelcomeAnimation } from './components/WelcomeAnimation';
import { OnlinePlayers } from './components/OnlinePlayers';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthCallback } from './components/AuthCallback';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(
    window.location.hash.includes('access_token')
      ? GameState.AUTH_CALLBACK
      : GameState.START
  );
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [renderState, setRenderState] = useState<GameState>(
    window.location.hash.includes('access_token')
      ? GameState.AUTH_CALLBACK
      : GameState.START
  );
  const [selectedDynasty, setSelectedDynasty] = useState<'umayyah1' | 'umayyah2' | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    name: 'Cadet',
    email: '',
    school: 'SMPN 2 Malang',
    score: 0,
    energy: 3,
    artifacts: [],
    completedLevels: [],
    currentNodeIndex: 0
  });

  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [realPlayers, setRealPlayers] = useState<Competitor[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomePlayerData, setWelcomePlayerData] = useState<{ name: string; avatarUrl?: string } | null>(null);

  useEffect(() => {
    const bots: Competitor[] = CLASSMATES_NAMES.map((name, index) => {
      const seed = name.replace(/\s/g, '') + index;
      return {
        id: `bot-${index}`,
        name: name,
        score: 0,
        energy: 3,
        currentNodeIndex: 0,
        pathHistory: [0],
        currentActivity: 'Mempelajari Peta...',
        lastUpdate: Date.now(),
        lastAnswerStatus: 'none',
        status: 'online' as const,
        avatarUrl: `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`
      };
    });
    setCompetitors(bots);

    // Supabase Auth Listener
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        handleAuthUser(session.user);
      }
    };
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Only handle initial sign-in events
      if ((event === 'SIGNED_IN') && session) {
        handleAuthUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthUser = async (user: any) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setIsAdmin(profile.email === 'hadhiee@gmail.com');
        setPlayerStats((prev) => ({
          ...prev,
          name: profile.full_name || user.user_metadata.full_name || 'Agen',
          email: profile.email || user.email,
          avatarUrl: profile.avatar_url || user.user_metadata.avatar_url,
          score: profile.score ?? 0,
          energy: profile.energy ?? 3,
          completedLevels: profile.completed_levels || [],
          userId: user.id,
        }));
        if (gameState === GameState.START) {
          switchState(GameState.DYNASTY_SELECT);
        }
      } else {
        const adminEmail = 'hadhiee@gmail.com';
        const isUserAdmin = user.email === adminEmail;
        setIsAdmin(isUserAdmin);

        const newProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata.full_name || 'Agen Baru',
          avatar_url: user.user_metadata.avatar_url,
          score: 0,
          energy: 3,
          school: 'SMPN 2 Malang',
          is_guest: false
        };
        const { error } = await supabase.from('profiles').insert([newProfile]);
        if (!error) {
          setPlayerStats(prev => ({
            ...prev,
            name: newProfile.full_name,
            email: newProfile.email,
            avatarUrl: newProfile.avatar_url,
            userId: user.id
          }));
          if (gameState === GameState.START) {
            switchState(GameState.DYNASTY_SELECT);
          }
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  // Real-time Score Sync
  useEffect(() => {
    if (!playerStats.userId) return;

    const syncScore = async () => {
      await supabase
        .from('profiles')
        .update({
          score: playerStats.score,
          energy: playerStats.energy,
          updated_at: new Date().toISOString()
        })
        .eq('id', playerStats.userId);
    };

    const timer = setTimeout(syncScore, 2000); // Debounce sync
    return () => clearTimeout(timer);
  }, [playerStats.score, playerStats.energy, playerStats.userId]);

  // Sync REAL players from Supabase to show in Online Panel
  useEffect(() => {
    const fetchRealPlayers = async () => {
      // Fetch users active in the last 10 minutes
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .gt('updated_at', tenMinutesAgo)
        .order('score', { ascending: false });

      if (data) {
        const players: Competitor[] = data
          .filter(p => p.id !== playerStats.userId) // Exclude current user
          .map(p => ({
            id: p.id,
            name: p.full_name,
            score: p.score || 0,
            energy: p.energy || 3,
            currentNodeIndex: p.current_node_index || 0,
            pathHistory: [],
            currentActivity: p.is_guest ? 'Agen Tamu' : 'Agen SSO',
            lastUpdate: new Date(p.updated_at).getTime(),
            status: 'online',
            avatarUrl: p.avatar_url || `https://api.dicebear.com/7.x/lorelei/svg?seed=${p.id}`
          }));
        setRealPlayers(players);
      }
    };

    const interval = setInterval(fetchRealPlayers, 8000); // Refresh every 8s
    fetchRealPlayers();
    return () => clearInterval(interval);
  }, [playerStats.userId]);

  useEffect(() => {
    if (gameState === GameState.START || gameState === GameState.DYNASTY_SELECT || gameState === GameState.DYNASTY_BRIEFING || gameState === GameState.ADMIN || gameState === GameState.AUTH_CALLBACK) return;

    const interval = setInterval(() => {
      setCompetitors(prev => {
        return prev.map((bot): Competitor => {
          if (bot.currentNodeIndex >= LEVEL_1_MAP_NODES.length - 1) {
            return {
              ...bot,
              currentActivity: 'Misi Selesai (Menunggu di Base)',
              status: 'online'
            };
          }

          const currentNode = LEVEL_1_MAP_NODES[bot.currentNodeIndex];
          const nextNodeIndex = bot.currentNodeIndex + 1;
          const nextNode = LEVEL_1_MAP_NODES[nextNodeIndex];

          const roll = Math.random();
          let shouldAdvance = false;
          let answerStatus: 'correct' | 'wrong' | 'none' = 'none';

          if (currentNode.type === 'MATERIAL') {
            if (roll > 0.45) shouldAdvance = true;
          } else {
            if (roll > 0.6) {
              shouldAdvance = true;
              answerStatus = 'correct';
            } else if (roll < 0.2) {
              answerStatus = 'wrong';
            }
          }

          let newScore = bot.score;
          let newEnergy = bot.energy;
          let newIndex = bot.currentNodeIndex;
          let newHistory = [...bot.pathHistory];
          let newActivity = bot.currentActivity;

          if (shouldAdvance) {
            newIndex = nextNodeIndex;
            newHistory.push(newIndex);
            const points = currentNode.type === 'MATERIAL' ? 50 : 100;
            newScore += points + Math.floor(Math.random() * 20);
            newActivity = `Bergerak menuju ${nextNode ? nextNode.label : 'Final'}...`;
          } else {
            if (answerStatus === 'wrong') {
              newEnergy = Math.max(0, newEnergy - 1);
              newActivity = `Gagal menjawab soal di ${currentNode.label}. Mencoba kembali...`;
            } else {
              const activities = [
                `Menganalisis taktik di ${currentNode.label}...`,
                "Mencari jawaban di arsip...",
                "Menghitung strategi perjalanan...",
                "Menjawab kuis temporal..."
              ];
              newActivity = activities[Math.floor(Math.random() * activities.length)];
            }
          }

          return {
            ...bot,
            score: newScore,
            energy: newEnergy,
            currentNodeIndex: newIndex,
            pathHistory: newHistory,
            currentActivity: newActivity,
            lastAnswerStatus: answerStatus,
            lastUpdate: Date.now()
          };
        }).sort((a, b) => b.score - a.score);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [gameState]);

  const switchState = (newState: GameState) => {
    if (newState === gameState) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setGameState(newState);
      setRenderState(newState);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 500);
  };

  const handleStart = async (name: string, email: string, avatarUrl: string, className: string) => {
    const guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;

    // Save guest to Supabase
    try {
      await supabase.from('profiles').insert([{
        id: guestId,
        full_name: name,
        email: email || `guest_${guestId}@chrono.quest`,
        avatar_url: avatarUrl,
        is_guest: true,
        class_name: className,
        score: 0,
        energy: 3,
        updated_at: new Date().toISOString()
      }]);
    } catch (e) {
      console.warn("Guest tracking failed:", e);
    }

    setPlayerStats(prev => ({
      ...prev,
      name,
      email,
      avatarUrl,
      userId: guestId
    }));
    setWelcomePlayerData({ name, avatarUrl });
    setShowWelcome(true);
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    switchState(GameState.DYNASTY_SELECT);
  };

  const handleSelectDynasty = (dynasty: 'umayyah1' | 'umayyah2') => {
    setSelectedDynasty(dynasty);
    switchState(GameState.DYNASTY_BRIEFING);
  };

  const handleStartMission = () => {
    setActiveLevel(1);
    const startIdx = selectedDynasty === 'umayyah2' ? 6 : 0;
    setPlayerStats(prev => ({ ...prev, currentNodeIndex: startIdx }));
    switchState(GameState.PLAYING);
  };

  const handleSelectLevel = (levelId: number) => {
    setActiveLevel(levelId);
    switchState(GameState.PLAYING);
  };

  const handleUpdateStats = (newStats: PlayerStats) => {
    setPlayerStats(newStats);
    if (newStats.userId) {
      supabase.from('profiles').update({
        score: newStats.score,
        energy: newStats.energy,
        completed_levels: newStats.completedLevels,
        current_node_index: newStats.currentNodeIndex,
        updated_at: new Date().toISOString()
      }).eq('id', newStats.userId).then(({ error }) => {
        if (error) console.error('Error saving progress:', error);
      });
    }
  };

  const handleGameOver = (win: boolean) => {
    if (win) {
      setPlayerStats(prev => ({
        ...prev,
        completedLevels: [...prev.completedLevels, activeLevel]
      }));
      switchState(GameState.VICTORY);
    } else {
      switchState(GameState.GAME_OVER);
    }
  };

  const handleExitGame = () => {
    switchState(GameState.DYNASTY_SELECT);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setPlayerStats({
      name: 'Cadet',
      email: '',
      school: 'SMPN 2 Malang',
      score: 0,
      energy: 3,
      artifacts: [],
      completedLevels: [],
      currentNodeIndex: 0
    });
    switchState(GameState.START);
  };

  return (
    <div className="antialiased font-content text-white h-screen w-screen overflow-x-hidden relative">
      {/* Admin Quick Access Button */}
      {isAdmin && renderState !== GameState.ADMIN && (
        <button
          onClick={() => switchState(GameState.ADMIN)}
          className="fixed bottom-4 left-4 z-[9999] bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold font-sci-fi text-xs shadow-lg flex items-center gap-2 border-2 border-black"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          ADMIN DASHBOARD
        </button>
      )}

      {/* Online Players Panel & Logout - Show everywhere except START & ADMIN screen */}
      {renderState !== GameState.START && renderState !== GameState.ADMIN && renderState !== GameState.AUTH_CALLBACK && !showWelcome && (
        <OnlinePlayers
          competitors={[...realPlayers, ...competitors]}
          currentPlayerName={playerStats.name}
          onLogout={handleLogout}
        />
      )}

      <div className={`page-transition w-full h-full ${isTransitioning ? 'page-exit' : 'page-active'}`}>
        {renderState === GameState.START && <StartScreen onStart={handleStart} />}

        {renderState === GameState.ADMIN && (
          <AdminDashboard onBack={() => switchState(GameState.START)} />
        )}

        {renderState === GameState.AUTH_CALLBACK && (
          <AuthCallback onComplete={() => {
            window.history.replaceState({}, document.title, '/');
            switchState(GameState.DYNASTY_SELECT);
          }} />
        )}

        {renderState === GameState.DYNASTY_SELECT && (
          <DynastySelection onSelect={handleSelectDynasty} />
        )}

        {renderState === GameState.DYNASTY_BRIEFING && selectedDynasty && (
          <DynastyBriefing
            dynasty={selectedDynasty}
            onStart={handleStartMission}
            onBack={() => switchState(GameState.DYNASTY_SELECT)}
          />
        )}

        {renderState === GameState.LEVEL_SELECT && (
          <LevelSelect playerStats={playerStats} competitors={competitors} onSelectLevel={handleSelectLevel} />
        )}

        {renderState === GameState.PLAYING && (
          <GameInterface
            levelId={activeLevel}
            playerStats={playerStats}
            competitors={competitors}
            onUpdateStats={handleUpdateStats}
            onGameOver={handleGameOver}
            onExit={handleExitGame}
          />
        )}

        {(renderState === GameState.GAME_OVER || renderState === GameState.VICTORY) && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className={`max-w-md w-full p-8 rounded-2xl border-4 text-center ${renderState === GameState.VICTORY ? 'border-gold-dust bg-slate-900' : 'border-red-600 bg-red-950'}`}>
              <h2 className="text-4xl font-sci-fi font-bold mb-4">
                {renderState === GameState.VICTORY ? 'MISI SUKSES!' : 'KEGAGALAN SISTEM'}
              </h2>
              <p className="mb-8 text-lg">
                {renderState === GameState.VICTORY
                  ? `Selamat, Agen ${playerStats.name}. Anda telah mengamankan sejarah Bani Umayyah.`
                  : 'Energi temporal habis. Anda ditarik paksa kembali ke masa kini.'}
              </p>
              <div className="flex justify-center gap-4">
                <button onClick={() => switchState(GameState.DYNASTY_SELECT)} className="bg-white text-black px-6 py-3 rounded font-bold hover:bg-gray-200 transition-colors">
                  KEMBALI KE PORTAL
                </button>
                {renderState === GameState.GAME_OVER && (
                  <button
                    onClick={() => {
                      setPlayerStats(prev => ({ ...prev, energy: 3, currentNodeIndex: 0 }));
                      switchState(GameState.PLAYING);
                    }}
                    className="bg-red-600 text-white px-6 py-3 rounded font-bold hover:bg-red-500 transition-colors"
                  >
                    COBA LAGI
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Epic Welcome Animation */}
      {showWelcome && welcomePlayerData && (
        <WelcomeAnimation
          playerName={welcomePlayerData.name}
          avatarUrl={welcomePlayerData.avatarUrl}
          onComplete={handleWelcomeComplete}
        />
      )}
    </div>
  );
};

export default App;