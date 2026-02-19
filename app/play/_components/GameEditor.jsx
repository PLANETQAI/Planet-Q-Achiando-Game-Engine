'use client';

import { useState } from 'react';
import VibeCoderOverlay from './vibe-coder/VibeCoderOverlay';
import GamePreview from './GamePreview';
import { getGameById } from '@/lib/gameRegistry';
import { selectGameId } from '@/lib/gameSelector';
import { buildGameConfig } from '@/lib/configBuilder';
import { saveGame, getSavedGameById } from '@/lib/storage';

export default function GameEditor({ mode, id }) {
    // Try to load from storage first, then from registry
    const initialGame = id ? (getSavedGameById(id) || getGameById(id)) : null;

    const [status, setStatus] = useState(id ? 'ready' : 'idle');
    const [gameConfig, setGameConfig] = useState(initialGame);
    const [prompt, setPrompt] = useState('');

    const handleGenerate = (userPrompt) => {
        setPrompt(userPrompt);
        setStatus('generating');

        // 1. Select the best template
        const templateId = selectGameId(userPrompt);

        // 2. Build the customized config
        const finalConfig = buildGameConfig(templateId, userPrompt);

        // Simulate generation delay for UX
        setTimeout(() => {
            setGameConfig(finalConfig);
            saveGame(finalConfig);
            setStatus('ready');
        }, 16000); // 16 seconds to cover all simulation steps (5 steps * ~3s)
    };

    return (
        <VibeCoderOverlay onSend={handleGenerate} status={status} prompt={prompt}>
            <GamePreview
                gameConfig={gameConfig}
                status={status}
                autoPlay={!!id}
            />
        </VibeCoderOverlay>
    );
}
