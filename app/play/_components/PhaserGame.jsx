
'use client';

import { useEffect, useRef, useState } from 'react';
import * as Phaser from 'phaser';
import MobileControls from './MobileControls';

export default function PhaserGame({ config, category }) {
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

        // Find the active running scene
        const scenes = gameRef.current.scene.getScenes(true);
        if (scenes.length > 0) {
            const activeScene = scenes[0];
            // Emit as a custom event the scene can listen to
            activeScene.events.emit('vibe-mobile-action', action);
        }
    };

    return (
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            <div ref={parentRef} className="w-full h-full" />

            {isTouch && (
                <MobileControls
                    category={category}
                    onAction={handleMobileAction}
                />
            )}
        </div>
    );
}

