
import { GAME_REGISTRY } from './gameRegistry';

const KEYWORD_MAP = {
    // Shooter Keywords
    'shooter': ['space-invaders-01', 'drone-strike-01', 'void-stalker-01', 'cyber-arena-01', 'star-guardian-01', 'cyber-city-01'],
    'space': ['space-invaders-01', 'void-stalker-01', 'star-guardian-01', 'stellar-hunt-01', 'starborne-3d-01'],
    'aliens': ['space-invaders-01', 'star-guardian-01', 'void-stalker-01'],
    'swarm': ['drone-strike-01', 'cyber-arena-01', 'cyber-city-01'],
    'bullet hell': ['bullet-hell-01', 'vibe-storm-01'],
    'hard': ['bullet-hell-01', 'danmaku-core'],
    'fantasy': ['dragon-slayer-01'],
    'dragon': ['dragon-slayer-01'],
    'casual': ['balloon-pop-01'],
    'pop': ['balloon-pop-01', 'vibe-storm-01'],
    '3d': ['starborne-3d-01'],
    'cyber': ['cyber-city-01', 'cyber-arena-01'],
    'city': ['cyber-city-01', 'urban-traffic-01'],
    'cyborg': ['cyber-city-01'],
    'rain': ['cyber-city-01'],

    // Fighting Keywords
    'fighting': ['cyber-city-01'],
    'sword': ['cyber-city-01'],
    'fight': ['cyber-city-01'],
    'melee': ['cyber-city-01'],

    // Racing Keywords
    'racing': ['arcade-racer-01', 'road-rage-01', 'grand-prix-01', 'urban-traffic-01', 'sky-climber-01'],
    'drive': ['arcade-racer-01', 'grand-prix-01'],
    'car': ['arcade-racer-01', 'grand-prix-01', 'urban-traffic-01'],
    'drift': ['arcade-racer-01', 'ghost-racer-01'],
    'time': ['ghost-racer-01', 'urban-traffic-01'],
    'city': ['urban-traffic-01'],
    'combat': ['road-rage-01'],
    'emoji': ['sky-climber-01'],
    'platform': ['sky-leap-01'],
    'jump': ['sky-leap-01']
};

export const selectGameId = (prompt) => {
    const normalizedPrompt = prompt.toLowerCase();
    const matches = {};

    // Check for explicit matches
    for (const [keyword, ids] of Object.entries(KEYWORD_MAP)) {
        if (normalizedPrompt.includes(keyword)) {
            ids.forEach(id => {
                matches[id] = (matches[id] || 0) + 1;
            });
        }
    }

    // Sort matches by frequency
    const sortedMatches = Object.entries(matches).sort((a, b) => b[1] - a[1]);

    if (sortedMatches.length > 0) {
        return sortedMatches[0][0];
    }

    // Default based on broad category if no specific keywords match
    if (normalizedPrompt.includes('shoot') || normalizedPrompt.includes('kill') || normalizedPrompt.includes('attack')) {
        return 'space-invaders-01';
    }

    if (normalizedPrompt.includes('race') || normalizedPrompt.includes('speed') || normalizedPrompt.includes('fast')) {
        return 'arcade-racer-01';
    }

    // Random default if nothing matches
    return 'space-invaders-01';
};
