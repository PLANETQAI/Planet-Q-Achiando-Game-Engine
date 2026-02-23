
'use client';

import AssetInitializationGrid from './AssetInitializationGrid';
import LogicProcessingSession from './LogicProcessingSession';
import ChatInterface from './ChatInterface';
import { Bolt, Loader2 } from 'lucide-react';
import { getSimulationConfig, VIBE_STEPS } from '@/lib/vibeCoder';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VibeCoderOverlay({ children, onSend, status, prompt, hideEditor = false, gameConfig = null }) {
    const [currentStep, setCurrentStep] = useState(null);
    const [steps, setSteps] = useState([]);
    const [activeTab, setActiveTab] = useState('preview'); // 'preview' or 'chat'

    useEffect(() => {
        if (status === 'generating') {
            const config = getSimulationConfig(prompt);
            // If it's a puzzle, skip asset generation step or rename it
            const filteredSteps = config.steps.map(s => {
                if (s.id === VIBE_STEPS.ASSETS && prompt.toLowerCase().includes('puzzle')) {
                    return { ...s, id: 'structure', duration: 3000 };
                }
                return s;
            });
            setSteps(filteredSteps);

            let currentIdx = 0;
            const executeStep = (idx) => {
                if (idx >= filteredSteps.length) return;
                const step = filteredSteps[idx];
                setCurrentStep(step.id);
                setTimeout(() => executeStep(idx + 1), step.duration);
            };
            executeStep(0);
        } else {
            setCurrentStep(null);
        }
    }, [status, prompt]);

    const activeStepIdx = steps.findIndex(s => s.id === currentStep);
    const progressPercent = status === 'generating' ? Math.round(((activeStepIdx + 1) / steps.length) * 100) : 0;

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#0a0a0f] font-display text-white relative">
            {/* Minimalist Header */}
            {!hideEditor && (
                <header className="h-20 flex items-center justify-between px-12 bg-transparent z-50 absolute top-0 left-0 right-0">
                    <div className="flex items-center gap-4">
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(102,104,240,0.5)]">
                            <Bolt className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter italic leading-none">VibeCoder AI</h1>
                            <div className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase mt-1">Next-Gen Engine</div>
                        </div>
                    </div>

                    {status === 'generating' && (
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                                Forging: <span className="text-white">{prompt || 'NEON WORLD'}</span>
                            </span>
                        </div>
                    )}
                </header>
            )}

            <main className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
                {/* Full Screen Generation Overlay */}
                <AnimatePresence>
                    {status === 'generating' && (
                        <motion.section
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-40 bg-[#0a0a0f] flex flex-col items-center"
                        >
                            {/* Animated Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

                            {/* Dynamic Content Based on Step */}
                            <div className="flex-1 w-full flex flex-col pt-24">
                                {currentStep === VIBE_STEPS.ASSETS && (
                                    <AssetInitializationGrid isActive={true} />
                                )}
                                {currentStep === VIBE_STEPS.LOGIC && (
                                    <LogicProcessingSession isActive={true} />
                                )}
                                {currentStep === VIBE_STEPS.READY && (
                                    <div className="flex-1 flex flex-col items-center justify-center">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-center space-y-4"
                                        >
                                            <div className="size-24 rounded-full bg-terminal-green/20 border-2 border-terminal-green flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,255,102,0.3)]">
                                                <Bolt className="w-12 h-12 text-terminal-green" />
                                            </div>
                                            <h2 className="text-3xl font-black text-white italic">ENGINE READY</h2>
                                            <p className="text-white/40 font-mono tracking-widest">INITIALIZATION COMPLETE</p>
                                        </motion.div>
                                    </div>
                                )}
                            </div>

                            {/* Global Bottom Progress */}
                            <div className="w-full max-w-4xl px-12 pb-20 space-y-6 relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-end justify-between">
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-mono tracking-[0.4em] uppercase font-black text-primary/60">
                                                Phase {activeStepIdx + 1} of {steps.length}
                                            </div>
                                            <h2 className="text-4xl font-black tracking-tighter italic flex items-center gap-4">
                                                {currentStep === VIBE_STEPS.ASSETS ? 'PREPARING ASSETS' :
                                                    currentStep === VIBE_STEPS.LOGIC ? 'HANDLING LOGIC' :
                                                        currentStep === 'structure' ? 'STRUCTURING GRID' : 'COMPLETE'}
                                                <span className="text-white/10 text-6xl">/</span>
                                            </h2>
                                        </div>
                                        <div className="text-6xl font-black tracking-tighter italic text-white/10">{progressPercent}%</div>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                            className="h-full bg-primary shadow-[0_0_20px_#6668f0] transition-all duration-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Mobile Tabs Header - Always visible on mobile when not generating */}
                {status !== 'generating' && !hideEditor && (
                    <div className="md:hidden w-full flex p-2 bg-[#050505] border-b border-white/5 gap-2 z-50 pt-20">
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-colors ${activeTab === 'preview' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-white/50 border border-transparent'}`}
                        >
                            Game Preview
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-colors ${activeTab === 'chat' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-white/50 border border-transparent'}`}
                        >
                            Chat & Logic
                        </button>
                    </div>
                )}

                {/* The actual Game View (only visible when not generating) */}
                <div className={`flex-1 relative z-10 bg-black ${status !== 'generating' && activeTab !== 'preview' ? 'hidden md:block' : ''}`}>
                    {children}
                </div>

                {/* Side Chat - Only visible during or after play */}
                {status !== 'generating' && (
                    <aside className={`w-full md:w-[400px] border-t md:border-t-0 md:border-l border-white/5 bg-[#0d0d14] flex flex-col z-50 ${activeTab !== 'chat' ? 'hidden md:flex' : 'flex'}`}>
                        <div className="hidden md:flex p-4 border-b border-white/5 bg-white/[0.02] items-center gap-2">
                            <div className="size-2 rounded-full bg-terminal-green"></div>
                            <span className="text-[10px] font-black tracking-widest uppercase text-white/50">Runtime Assistant</span>
                        </div>
                        <ChatInterface onSend={onSend} />
                    </aside>
                )}
            </main>
        </div>
    );
}
