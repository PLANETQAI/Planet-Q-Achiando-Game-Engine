
'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';

export default function PhaserGame({ config }) {
    const gameRef = useRef(null);
    const parentRef = useRef(null);

    useEffect(() => {
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
            }
        };

        const game = new Phaser.Game(gameConfig);
        gameRef.current = game;

        const sceneClass = Array.isArray(config.scene) ? config.scene[0] : config.scene;

        if (sceneClass) {
            game.events.once('ready', () => {
                const sceneKey = sceneClass.name || 'DefaultScene';
                // Add the scene and start it with data
                game.scene.add(sceneKey, sceneClass, true, config.data);
            });
        }

        return () => {
            if (gameRef.current) {
                const game = gameRef.current;
                gameRef.current = null;

                try {
                    if (game.sound) {
                        game.sound.stopAll();
                    }
                    game.destroy(true);
                } catch (e) {
                    // Ignore AudioContext errors during destruction/unmount
                    if (e.message?.includes('AudioContext')) {
                        console.warn('Silent Phaser AudioContext cleanup');
                    } else {
                        throw e;
                    }
                }
            }
        };
    }, [config]);

    return <div ref={parentRef} className="w-full h-full flex items-center justify-center" />;
}
