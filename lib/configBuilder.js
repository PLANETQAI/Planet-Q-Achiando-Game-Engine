
import { getGameById } from './gameRegistry';

export const buildGameConfig = (baseId, prompt) => {
    const baseGame = getGameById(baseId);
    if (!baseGame) return null;

    // Deep clone the config
    const config = JSON.parse(JSON.stringify(baseGame.config));
    const normalizedPrompt = prompt.toLowerCase();

    // Basic "vibe" overrides based on keywords
    // This simulates the AI "understanding" and applying the vibe

    // Speed modifications
    if (normalizedPrompt.includes('fast') || normalizedPrompt.includes('speed') || normalizedPrompt.includes('intense')) {
        if (config.player) config.player.speed *= 1.5;
        if (config.weapon) config.weapon.fireRate *= 0.6; // Lower is faster fire
        if (config.car) config.car.maxSpeed *= 1.3;
    }

    if (normalizedPrompt.includes('slow') || normalizedPrompt.includes('zen') || normalizedPrompt.includes('relaxing')) {
        if (config.player) config.player.speed *= 0.7;
        if (config.car) config.car.maxSpeed *= 0.7;
    }

    // Colors / Visual mods (simulation)
    if (normalizedPrompt.includes('neon') || normalizedPrompt.includes('glow')) {
        config.vibe = 'neon';
    }

    if (normalizedPrompt.includes('retro') || normalizedPrompt.includes('pixel')) {
        config.vibe = 'retro';
    }

    if (normalizedPrompt.includes('rain') || normalizedPrompt.includes('cyber')) {
        config.vibe = 'rainy-cyber';
    }

    return {
        ...baseGame,
        config,
        generatedAt: new Date().toISOString(),
        userPrompt: prompt
    };
};
