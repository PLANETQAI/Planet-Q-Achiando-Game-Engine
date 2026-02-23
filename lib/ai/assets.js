
/**
 * Generates an image URL based on a description.
 * Defaults to Pollinations AI for speed and cost-efficiency.
 */
export const generateAssetUrl = (description, type = 'general') => {
    // Determine specialized suffixes for background removal
    let suffix = "";
    if (type === 'character' || type === 'enemy' || type === 'item') {
        suffix = " on a solid black background, centered, professional game asset, 2d sprite, high quality";
    } else if (type === 'background') {
        suffix = " beautiful game background environment, immersive, high resolution, no text";
    }

    const fullPrompt = encodeURIComponent(description + suffix);
    // Pollinations AI endpoint
    return `https://image.pollinations.ai/prompt/${fullPrompt}?width=512&height=512&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
};

/**
 * Helper to determine if a game type needs image assets.
 */
export const needsAssets = (category, type) => {
    if (category === 'puzzle') return false;
    if (type === 'math-platformer') return false; // Uses procedural shapes/text
    return true;
};
