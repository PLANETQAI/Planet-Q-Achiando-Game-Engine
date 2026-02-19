
'use client';

import { motion } from 'framer-motion';
import { Sparkles, Wand2, Search } from 'lucide-react';
import { useState } from 'react';

const EXAMPLES = [
    { label: "Noir Runner", icon: "🌃" },
    { label: "Neon Racer", icon: "🏎️" },
    { label: "Samurai Duel", icon: "⚔️" },
    { label: "Space Siege", icon: "🛸" },
];

export default function Hero() {
    const [prompt, setPrompt] = useState('');

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
            {/* PlanetQ Perspective Grid Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 perspective-grid opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b1e] via-transparent to-[#0a0b1e]" />
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-[20%] left-[10%] size-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] size-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-4xl px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 hover:border-primary/50 transition-colors cursor-default">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">PlanetQ AI Game Engine v2.0</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter italic">
                        DREAM IT.<br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary">PLAY IT.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/40 mb-12 max-w-2xl mx-auto font-medium tracking-tight">
                        The world's first true AI game engine. Describe any game in plain English and watch it come to life in seconds.
                    </p>

                    {/* PlanetQ Prompt Area */}
                    <div className="relative max-w-3xl mx-auto mb-8 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative bg-[#0d0d14]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-2 flex flex-col items-center shadow-2xl">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe your dream game... e.g. A fast-paced cyberpunk shooter with neon rain"
                                className="w-full h-32 bg-transparent border-none focus:ring-0 text-white placeholder-white/20 p-6 text-lg resize-none custom-scrollbar font-medium"
                            />

                            <div className="w-full flex items-center justify-between p-4 pt-0">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-bold text-white/30 tracking-widest uppercase">
                                    <Sparkles className="w-3 h-3" /> 2.4B Params Active
                                </div>

                                <button className="group relative px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-2xl font-black text-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,242,255,0.4)] flex items-center gap-3">
                                    <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    GENERATE GAME
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Example Capsules */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mr-2">Try an example:</span>
                        {EXAMPLES.map((ex, i) => (
                            <button
                                key={i}
                                onClick={() => setPrompt(ex.label)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold text-white/60 transition-all hover:border-primary/40 hover:text-white flex items-center gap-2"
                            >
                                <span>{ex.icon}</span> {ex.label}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20"
            >
                <div className="w-px h-20 bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>
        </div>
    );
}
