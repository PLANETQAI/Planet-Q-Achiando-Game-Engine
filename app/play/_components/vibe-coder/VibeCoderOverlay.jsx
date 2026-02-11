
'use client';

import CodeSimulator from './CodeSimulator';
import ChatInterface from './ChatInterface';
import { Bolt, Settings, Rocket, Play, Loader2 } from 'lucide-react';

export default function VibeCoderOverlay({ children, onSend, status }) {
    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#0a0a0f]">
            {/* Toolbar */}
            <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0f] z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                        <Bolt className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold tracking-tight text-white">VIBE EDITOR</h1>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white/40">Project:</span>
                            <span className="text-xs font-mono text-primary">
                                {status === 'idle' ? 'New Project' : 'Active Vibe v1.2'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-4 px-4 py-1.5 bg-white/5 rounded-full border border-white/5">
                        <div className="flex items-center gap-2">
                            <div className={`size-2 rounded-full ${status === 'generating' ? 'bg-yellow-400 animate-pulse' : 'bg-terminal-green'}`}></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                                {status === 'generating' ? 'Syncing...' : 'Live Engine'}
                            </span>
                        </div>
                        <div className="w-px h-3 bg-white/10"></div>
                        <span className="text-[10px] font-mono text-white/40">Latency: 24ms</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 text-white/60 hover:text-white transition-colors">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                            <Rocket className="w-4 h-4" />
                            Publish
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Left Panel */}
                <section className="w-[450px] border-r border-white/10 flex flex-col glassmorphism h-full">
                    <CodeSimulator isActive={status === 'generating'} />
                    <ChatInterface onSend={onSend} />
                </section>

                {/* Right Panel (Game Preview) */}
                <section className="flex-1 relative bg-black flex flex-col">
                    {children}
                </section>
            </main>

            {/* Footer Status Bar */}
            <footer className="h-6 bg-black/80 border-t border-white/5 px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-white/40">FPS: 144</span>
                    <span className="text-[10px] font-mono text-white/40">Draw Calls: 1,402</span>
                    <span className="text-[10px] font-mono text-white/40">Memory: 412MB</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-primary font-bold">VIBE STRENGTH: 98%</span>
                </div>
            </footer>
        </div>
    );
}
