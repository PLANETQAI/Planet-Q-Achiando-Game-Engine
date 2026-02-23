'use client';

import { useState } from 'react';
import VibeCoderOverlay from './vibe-coder/VibeCoderOverlay';
import GamePreview from './GamePreview';
import { getGameById } from '@/lib/gameRegistry';
import { saveGame, getSavedGameById } from '@/lib/storage';

export default function GameEditor({ mode, id }) {
    // Try to load from storage first, then from registry
    const initialGame = id ? (getSavedGameById(id) || getGameById(id)) : null;

    const [status, setStatus] = useState(id ? 'ready' : 'idle');
    const [gameConfig, setGameConfig] = useState(initialGame);
    const [prompt, setPrompt] = useState('');

    const handleGenerate = async (userPrompt) => {
        setPrompt(userPrompt);
        setStatus('generating');

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userPrompt,
                    currentConfig: gameConfig // Pass current config for iterative editing
                })
            });

            if (!response.ok) throw new Error('Generation failed');

            const finalConfig = await response.json();

            setGameConfig(finalConfig);
            saveGame(finalConfig);
            setStatus('ready');
        } catch (error) {
            console.error('Generation Error:', error);
            setStatus('idle');
            alert('Vibe Coding failed. Check console for details.');
        }
    };

    if (mode === 'view') {
        return (
            <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#0a0a0f] font-display text-white relative">
                <GamePreview
                    gameConfig={gameConfig}
                    status={status}
                    autoPlay={!!id}
                />
            </div>
        );
    }

    return (
        <VibeCoderOverlay
            onSend={handleGenerate}
            status={status}
            prompt={prompt}
            gameConfig={gameConfig}
        >
            <GamePreview
                gameConfig={gameConfig}
                status={status}
                autoPlay={!!id}
            />
        </VibeCoderOverlay>
    );
}
