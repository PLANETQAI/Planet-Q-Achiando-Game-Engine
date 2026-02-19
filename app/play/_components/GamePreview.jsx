'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Play, RotateCcw, Maximize, Loader2, Square } from 'lucide-react';

const PhaserGame = dynamic(() => import('./PhaserGame'), { ssr: false });

export default function GamePreview({ gameConfig, status, autoPlay }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [scenes, setScenes] = useState({ shooter: null, racing: null, platformer: null });
    const hasAutoPlayed = useRef(false);

    useEffect(() => {
        if (autoPlay && status === 'ready' && !isPlaying && !hasAutoPlayed.current) {
            hasAutoPlayed.current = true;
            handlePlay();
        }
    }, [status, autoPlay]);

    useEffect(() => {
        const loadScenes = async () => {
            try {
                const [shooterMod, racingMod, skyRacerMod, fighterMod, platformerMod, puzzleMod] = await Promise.all([
                    import('@/games/shooter/core/BaseShooter'),
                    import('@/games/racing/core/BaseRacer'),
                    import('@/games/racing/core/SkyRacer'),
                    import('@/games/fighter/core/BaseFighter'),
                    import('@/games/platformer/core/BasePlatformer'),
                    import('@/games/puzzle/core/BasePuzzle')
                ]);
                setScenes({
                    shooter: shooterMod.default,
                    racing: racingMod.default,
                    skyRacer: skyRacerMod.default,
                    fighter: fighterMod.default,
                    platformer: platformerMod.default
                });
            } catch (error) {
                console.error('Failed to load game scenes:', error);
            }
        };
        loadScenes();
    }, []);

    const activeScene = gameConfig?.category === 'racing'
        ? scenes.racing
        : gameConfig?.category === 'platform-racing'
            ? scenes.skyRacer
            : gameConfig?.category === 'fighting'
                ? scenes.fighter
                : gameConfig?.category === 'platformer'
                    ? scenes.platformer
                    : scenes.shooter;

    const handlePlay = () => {
        if (!activeScene) {
            console.warn('Game scene not yet loaded');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsPlaying(true);
            setIsLoading(false);
        }, 600);
    };

    const handleStop = () => {
        setIsPlaying(false);
    };

    const isReady = status === 'ready';
    const isGenerating = status === 'generating';

    const phaserConfig = useMemo(() => ({
        scene: [activeScene],
        data: gameConfig?.config
    }), [activeScene, gameConfig?.config]);

    return (
        <div className="flex-1 relative group bg-[#050505] h-full min-h-[400px] overflow-hidden">
            {isPlaying && activeScene ? (
                <PhaserGame config={phaserConfig} />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    {gameConfig?.config?.background && isReady ? (
                        <div className="absolute inset-0">
                            <img
                                src={`/assets/${gameConfig.config.background}`}
                                className="w-full h-full object-cover opacity-30 brightness-50"
                                alt="Splash"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-[url('/grid-bg.svg')] bg-cover opacity-10" />
                    )}

                    <div className="relative z-10 text-center">
                        {isGenerating ? (
                            <div className="space-y-4">
                                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto opacity-50" />
                                <p className="text-primary font-mono text-sm animate-pulse uppercase tracking-[0.2em]">Quantum Engine Syncing...</p>
                            </div>
                        ) : isReady ? (
                            <div className="space-y-4 cursor-pointer" onClick={handlePlay}>
                                <div className="w-20 h-20 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-500 group/play shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]">
                                    <Play className="w-10 h-10 text-primary fill-current ml-1 group-hover/play:scale-110 transition-transform" />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-widest uppercase">{gameConfig?.name}</h2>
                                <p className="text-white/40 font-mono text-xs uppercase tracking-[0.2em] animate-pulse">Click to Initialise</p>
                            </div>
                        ) : (
                            <div className="space-y-2 opacity-30">
                                <div className="w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🎮</span>
                                </div>
                                <p className="text-white/40 font-mono text-sm uppercase">Awaiting Vibe Instruction</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Overlay UI (Play/Pause etc) */}
            <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 p-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 transition-all duration-500 ${isPlaying || isGenerating || !isReady ? 'opacity-0 pointer-events-none translate-y-[-20px]' : 'opacity-100 translate-y-0'}`}>
                <button
                    onClick={handlePlay}
                    disabled={isLoading || !activeScene}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-xs font-bold hover:bg-primary/40 transition-colors text-primary border border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                    Run Vibe
                </button>
                <div className="w-px h-4 bg-white/10 mx-1"></div>
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60">
                    <RotateCcw className="w-3 h-3" />
                </button>
            </div>

            {/* Stop Button (Only when playing) */}
            {isPlaying && (
                <button
                    onClick={handleStop}
                    className="absolute bottom-12 left-12 z-10 flex items-center gap-3 px-6 py-2 rounded-lg bg-red-500/10 text-xs font-black hover:bg-red-500/20 transition-all text-red-400 border border-red-500/20 backdrop-blur-md uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    Terminate Process
                </button>
            )}

            {/* Game Info Overlay */}
            <div className="absolute top-6 right-6 text-right pointer-events-none z-10">
                <div className="text-[32px] font-black italic tracking-tighter text-white/90 leading-none drop-shadow-lg">
                    {gameConfig?.name || 'VIBE EXPERIMENT'}
                </div>
                <div className="text-[10px] font-mono text-primary font-bold tracking-widest mt-1">
                    {status === 'generating' ? 'GENERATING...' : 'STABLE BUILD v0.1.2'}
                </div>
            </div>
        </div>
    );
}
