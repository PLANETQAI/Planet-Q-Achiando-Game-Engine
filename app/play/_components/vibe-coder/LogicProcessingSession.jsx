
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sparkles, Brain, Cpu, Zap } from 'lucide-react';

const TIPS = [
    {
        title: "Tactical Depth",
        text: "Double-tap movement keys to DASH. Use it to dodge incoming projectiles or close the gap quickly.",
        icon: Zap
    },
    {
        title: "Combat Synergy",
        text: "The 3rd hit of your combo is a LAUNCHER. Use it to send enemies airborne for high-damage juggles.",
        icon: Sparkles
    },
    {
        title: "Engine Logic",
        text: "Holding Space builds power for a HEAVY ATTACK. Releasing it at full charge triggers a massive impact.",
        icon: Brain
    },
    {
        title: "Pro Tip",
        text: "Aerial Dives can be executed by holding DOWN + SPACE while in the air. High speed, high reward.",
        icon: Cpu
    }
];

export default function LogicProcessingSession({ isActive }) {
    const [tipIdx, setTipIdx] = useState(0);

    useEffect(() => {
        if (!isActive) return;
        const interval = setInterval(() => {
            setTipIdx(prev => (prev + 1) % TIPS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isActive]);

    if (!isActive) return null;

    const currentTip = TIPS[tipIdx];

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-12">
            <div className="w-full max-w-2xl space-y-12">
                {/* Loader */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative size-24">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-2 border-primary/20 rounded-full"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-t-2 border-primary rounded-full shadow-[0_0_15px_#6668f0]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Brain className="w-8 h-8 text-white/50 animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-bold tracking-tight text-white">Handling Game Logic</h2>
                        <p className="text-white/40 text-sm font-mono mt-1">INITIALIZING PHYSICS & COLLISION LAYERS</p>
                    </div>
                </div>

                {/* Info Session (Tips) */}
                <div className="bg-[#13131f] border border-white/5 rounded-3xl p-8 relative overflow-hidden h-[200px] flex items-center">
                    <div className="absolute -right-20 -bottom-20 size-64 bg-primary/5 blur-3xl rounded-full" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tipIdx}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="flex gap-8 items-start relative z-10"
                        >
                            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                <currentTip.icon className="w-8 h-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <div className="text-[10px] uppercase tracking-[0.3em] font-black text-primary/60">Informative Session</div>
                                <h3 className="text-2xl font-black text-white">{currentTip.title}</h3>
                                <p className="text-white/60 text-lg leading-relaxed">{currentTip.text}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
