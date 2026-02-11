
'use client';

import { useState } from 'react';
import VibeCoderOverlay from './vibe-coder/VibeCoderOverlay';
import GamePreview from './GamePreview';
import { getGameById } from '@/lib/gameRegistry';

export default function GameEditor({ mode, id }) {
    const existingGame = id ? getGameById(id) : null;
    const [status, setStatus] = useState(id ? 'ready' : 'idle');
    const [gameConfig, setGameConfig] = useState(existingGame);

    const handleGenerate = (prompt) => {
        setStatus('generating');
        const isRacing = prompt.toLowerCase().includes('race') || prompt.toLowerCase().includes('car');
        const templateId = isRacing ? 'arcade-racer-01' : 'space-invaders-01';
        const template = getGameById(templateId);

        // Simulate generation delay
        setTimeout(() => {
            setGameConfig({
                ...template,
                name: prompt.split(' ').slice(0, 3).join(' ').toUpperCase() || 'NEW VIBE',
                id: 'generated-' + Date.now(),
            });
            setStatus('ready');
        }, 4000);
    };

    return (
        <VibeCoderOverlay onSend={handleGenerate} status={status}>
            <GamePreview
                gameConfig={gameConfig}
                status={status}
                autoPlay={!!id}
            />
        </VibeCoderOverlay>
    );
}
