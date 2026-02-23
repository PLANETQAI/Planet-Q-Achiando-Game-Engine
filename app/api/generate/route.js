
import { generateGameConfig } from '@/lib/ai/llm';
import { generateAssetUrl, needsAssets } from '@/lib/ai/assets';

export async function POST(req) {
    try {
        const { prompt, currentConfig } = await req.json();

        // 1. Generate Config from LLM
        const config = await generateGameConfig(prompt, currentConfig);

        // 2. Identify and Forge Assets
        if (needsAssets(config.category, config.config?.level?.type)) {
            // Forge Background
            if (config.config.background && (typeof config.config.background === 'string')) {
                config.config.background = generateAssetUrl(`${config.name} game world background, ${config.description}`, 'background');
            }

            // Forge Player
            if (config.config.player?.asset) {
                config.config.player.asset = generateAssetUrl(`main character sprite for ${config.name}, a ${config.config.player.asset}`, 'character');
            }

            // Forge Enemies/Spawns
            if (config.config.spawn?.asset) {
                config.config.spawn.asset = generateAssetUrl(`enemy sprite for ${config.name}, a ${config.config.spawn.asset}`, 'enemy');
            }
        }

        return new Response(JSON.stringify(config), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("API Generation Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
