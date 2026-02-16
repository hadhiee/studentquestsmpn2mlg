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

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [renderState, setRenderState] = useState<GameState>(GameState.START);
  const [selectedDynasty, setSelectedDynasty] = useState<'umayyah1' | 'umayyah2' | null>(null);

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
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
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
      // If still on start screen, move to next screen
      setGameState((current) => {
        if (current === GameState.START) {
          // We need to trigger the full switchState animation logic
          // pass user info directly or use useEffect to trigger switch
          // But inside async function, stick to simple state update or call helper outside
          return current;
        }
        return current;
      });
      // Trigger switch state safely
      if (gameState === GameState.START) {
        switchState(GameState.DYNASTY_SELECT);
      }
    } else {
      // Create profile if not exists
      const newProfile = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name || 'Agen Baru',
        avatar_url: user.user_metadata.avatar_url,
        score: 0,
        energy: 3,
        school: 'SMPN 2 Malang' // default
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
  };

  useEffect(() => {
    if (gameState === GameState.START || gameState === GameState.DYNASTY_SELECT || gameState === GameState.DYNASTY_BRIEFING) return;

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

  const handleStart = (name: string, email: string, avatarUrl: string) => {
    setPlayerStats(prev => ({ ...prev, name, email, avatarUrl }));
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
        current_node_index: newStats.currentNodeIndex
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

  return (
    <div className="antialiased font-content text-white h-screen w-screen overflow-x-hidden">
      <div className={`page-transition w-full h-full ${isTransitioning ? 'page-exit' : 'page-active'}`}>
        {renderState === GameState.START && <StartScreen onStart={handleStart} />}

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