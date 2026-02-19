
const STORAGE_KEY = 'planet_q_games';

export const saveGame = (gameConfig) => {
    if (typeof window === 'undefined') return;

    try {
        const games = getAllSavedGames();
        const index = games.findIndex(g => g.id === gameConfig.id);

        if (index >= 0) {
            games[index] = gameConfig;
        } else {
            games.push(gameConfig);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
        return true;
    } catch (e) {
        console.error('Failed to save game:', e);
        return false;
    }
};

export const getAllSavedGames = () => {
    if (typeof window === 'undefined') return [];

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to load games:', e);
        return [];
    }
};

export const getSavedGameById = (id) => {
    const games = getAllSavedGames();
    return games.find(g => g.id === id) || null;
};

export const deleteGame = (id) => {
    if (typeof window === 'undefined') return;

    try {
        const games = getAllSavedGames();
        const filtered = games.filter(g => g.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
    } catch (e) {
        console.error('Failed to delete game:', e);
        return false;
    }
};
