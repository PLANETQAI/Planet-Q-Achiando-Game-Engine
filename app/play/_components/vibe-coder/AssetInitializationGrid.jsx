
'use client';

import { motion } from 'framer-motion';
import { Image, Palette, Volume2, Music, Target, Layers } from 'lucide-react';

const ASSETS = [
    { id: 'player', label: 'Hero Sprite', type: 'Texture', icon: Image },
    { id: 'enemy', label: 'Enemy Sheet', type: 'Atlas', icon: Palette },
    { id: 'bg', label: 'World Texture', type: 'Background', icon: Layers },
    { id: 'sfx', label: 'Audio Buffer', type: 'Sample', icon: Volume2 },
    { id: 'music', label: 'Ambient Loop', type: 'Stream', icon: Music },
    { id: 'ui', label: 'HUD Elements', type: 'Interface', icon: Target },
];

export default function AssetInitializationGrid({ isActive }) {
    if (!isActive) return null;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-12">
            <div className="grid grid-cols-3 gap-6 w-full max-w-4xl">
                {ASSETS.map((asset, i) => (
                    <motion.div
                        key={asset.id}
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
                        className="group relative bg-[#13131f] border border-white/5 rounded-2xl p-6 hover:border-primary/50 transition-colors"
                    >
                        <div className="absolute top-4 right-4 text-[10px] font-mono text-terminal-green animate-pulse">
                            PREPARING
                        </div>

                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                            <asset.icon className="w-6 h-6" />
                        </div>

                        <div>
                            <div className="text-lg font-bold text-white mb-1">{asset.label}</div>
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">{asset.type}</div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1.5, delay: i * 0.15 + 0.5 }}
                                    className="h-full bg-primary shadow-[0_0_10px_#6668f0]"
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
