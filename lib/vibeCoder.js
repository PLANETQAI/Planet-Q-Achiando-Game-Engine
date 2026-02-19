
export const VIBE_STEPS = {
    ASSETS: 'assets',
    LOGIC: 'logic',
    READY: 'ready'
};

export const VIBE_MESSAGES = {
    [VIBE_STEPS.ASSETS]: [
        "Preparing game assets...",
        "Indexing sprite sheets...",
        "Optimizing textures...",
        "Loading audio buffers..."
    ],
    [VIBE_STEPS.LOGIC]: [
        "Handling game logic...",
        "Compiling scene scripts...",
        "Initializing physics world...",
        "Establishing game rules..."
    ],
    [VIBE_STEPS.READY]: [
        "Game engine ready."
    ]
};

export const getSimulationConfig = (prompt) => {
    return {
        steps: [
            { id: VIBE_STEPS.ASSETS, duration: 4000 },
            { id: VIBE_STEPS.LOGIC, duration: 6000 },
            { id: VIBE_STEPS.READY, duration: 1000 }
        ]
    };
};
