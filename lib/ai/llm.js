
/**
 * Unified interface for calling LLMs (OpenAI/Claude).
 * Uses process.env for API keys.
 */

const SYSTEM_PROMPT = `
You are the VibeCoder AI, an elite game engine architect. 
Your goal is to transform user prompts into detailed, valid JSON game configurations for a Phaser-based engine.

CORE CATEGORIES:
1. shooter: Bullet hell or arcade space shooters.
2. racing: Top-down car racing or combat driving.
3. platform-racing: Upward climbing/jumping with emoji/simple graphics.
4. fighting: Side-view melee combat (Cyber City style).
5. platformer: Traditional jumping games (Mario style, Collect-athon, or Math Runner).
6. puzzle: Grid-based logic games (Word Search, Math Cross, Neon Flow).

JSON STRUCTURE RULES:
- Always return a JSON object with at least: id, name, description, category, tags, and config.
- ID must be unique (e.g. user-game-timestamp).
- Config structure depends on the category. Use existing patterns from the registry.
- For assets, generate descriptive prompts that will be sent to an image generator. 
- Characters/Enemies assets should specify "transparent background".

REFINEMENT RULES:
- If a currentConfig is provided, ONLY modify the parts requested by the editPrompt.
- Maintain consistency with the existing game theme.
`;

export async function generateGameConfig(userPrompt, currentConfig = null) {
    const isEditing = !!currentConfig;
    const model = process.env.ANTHROPIC_API_KEY ? 'claude-3-5-sonnet-20240620' : 'gpt-4o';
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error("Missing API Key (ANTHROPIC_API_KEY or OPENAI_API_KEY)");
    }

    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        {
            role: 'user',
            content: isEditing
                ? `CURRENT CONFIG: ${JSON.stringify(currentConfig)}\nUSER EDIT PROMPT: ${userPrompt}\nRefine the config accordingly. Return ONLY the JSON.`
                : `USER PROMPT: ${userPrompt}\nBuild a new game config. Return ONLY the JSON.`
        }
    ];

    try {
        const response = await fetch(
            process.env.ANTHROPIC_API_KEY
                ? 'https://api.anthropic.com/v1/messages'
                : 'https://api.openai.com/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    [process.env.ANTHROPIC_API_KEY ? 'x-api-key' : 'Authorization']: process.env.ANTHROPIC_API_KEY ? apiKey : `Bearer ${apiKey}`,
                    [process.env.ANTHROPIC_API_KEY ? 'anthropic-version' : '']: '2023-06-01'
                },
                body: JSON.stringify(
                    process.env.ANTHROPIC_API_KEY
                        ? { model, max_tokens: 4000, system: SYSTEM_PROMPT, messages: [messages[1]] }
                        : { model, messages, response_format: { type: "json_object" } }
                )
            }
        );

        const data = await response.json();
        const content = process.env.ANTHROPIC_API_KEY ? data.content[0].text : data.choices[0].message.content;

        // Clean and parse
        const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanContent);
    } catch (error) {
        console.error("LLM Generation Error:", error);
        throw error;
    }
}
