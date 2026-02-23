
'use client';

import { useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import { RotateCcw, Square } from 'lucide-react';
import MobileControls from './MobileControls';

export default function PhaserGame({ config, category, name, status, onStop }) {
    const gameRef = useRef(null);
    const parentRef = useRef(null);
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        // Detect touch device
        setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);

        if (!parentRef.current) return;

        const gameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: parentRef.current,
            backgroundColor: '#000000',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 800,
                height: 600
            }
        };

        const game = new Phaser.Game(gameConfig);
        gameRef.current = game;

        const sceneClass = Array.isArray(config.scene) ? config.scene[0] : config.scene;

        if (sceneClass) {
            game.events.once('ready', () => {
                const sceneKey = sceneClass.name || 'DefaultScene';
                game.scene.add(sceneKey, sceneClass, true, config.data);
            });
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
            }
        };

    }, [config]);

    const handleMobileAction = (action) => {
        if (!gameRef.current) return;

        const scenes = gameRef.current.scene.getScenes(true);
        if (scenes.length > 0) {
            const activeScene = scenes[0];
            activeScene.events.emit('vibe-mobile-action', action);
        }
    };

    const handleRestart = () => {
        if (!gameRef.current) return;
        const scenes = gameRef.current.scene.getScenes(true);
        if (scenes.length > 0) {
            scenes[0].scene.restart();
        }
    };

    return (
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            <div ref={parentRef} className="w-full h-full" />

            {/* In-Game Modern Header (Mobile Optimized) */}
            <div className="absolute top-4 left-4 right-4 z-[60] flex items-start justify-between pointer-events-none">
                <div className="flex flex-col bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/5">
                    <div className="text-sm md:text-xl font-black italic text-white leading-none tracking-tight">
                        {name || 'VIBE EXPERIMENT'}
                    </div>
                    <div className="text-[7px] font-mono text-primary font-bold tracking-[0.2em] mt-1.5 uppercase opacity-80">
                        {status === 'generating' ? 'SYNCING...' : 'LIVE SESSION'}
                    </div>
                </div>

                <div className="flex gap-2 pointer-events-auto">
                    <button
                        onClick={handleRestart}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 active:scale-95 transition-all backdrop-blur-md"
                        title="Restart Session"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onStop}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-black text-red-400 hover:bg-red-500/20 active:scale-95 transition-all backdrop-blur-md uppercase tracking-widest"
                    >
                        <Square className="w-4 h-4 fill-current" />
                        <span className="hidden sm:inline">Terminate</span>
                    </button>
                </div>
            </div>

            {isTouch && (
                <MobileControls
                    category={category}
                    onAction={handleMobileAction}
                />
            )}
        </div>
    );
}
