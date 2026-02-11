
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function CodeSimulator({ isActive }) {
    const scrollRef = useRef(null);
    const [logs, setLogs] = useState([
        { time: '12:04:21', text: 'Initializing procedural materials...', type: 'info' },
        { time: '12:04:22', text: 'Global lighting baked (Lumen Engine)', type: 'success' }
    ]);

    useEffect(() => {
        if (!isActive) return;

        setLogs([]); // Reset logs when starting new generation
        const interval = setInterval(() => {
            const msgs = [
                { text: 'Compiling PlayerMovement.js', type: 'info' },
                { text: 'Integrating jump physics... OK', type: 'detail' },
                { text: 'Applying neon trail particle system... OK', type: 'detail' },
                { text: 'Syncing audio reactive scale... OK', type: 'detail' },
                { text: 'Rebuilding EnvironmentShader.glsl', type: 'info' },
                { text: 'Optimizing render queue...', type: 'info' }
            ];
            const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
            setLogs(prev => [...prev.slice(-20), {
                time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                ...randomMsg
            }]);
        }, 2000);

        return () => clearInterval(interval);
    }, [isActive]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden glassmorphism rounded-tl-xl">
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-primary">terminal</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">Vibe Coder Terminal</span>
                </div>
                <span className="text-[10px] font-mono text-white/30 italic">Active generation logs...</span>
            </div>

            <div ref={scrollRef} className="flex-1 p-4 font-mono text-[13px] overflow-y-auto custom-scrollbar bg-terminal-bg/50">
                <div className="space-y-2">
                    {logs.map((log, i) => (
                        <div key={i} className={`${log.type === 'detail' ? 'pl-4 border-l border-white/10 ml-1' : ''}`}>
                            {log.type !== 'detail' ? (
                                <div className="text-white/40 flex gap-2">
                                    <span className="text-primary/60">{log.time}</span>
                                    {log.type === 'success' ? (
                                        <span className="text-terminal-green">✓ {log.text}</span>
                                    ) : (
                                        <span><span className="text-primary">➜</span> {log.text}</span>
                                    )}
                                </div>
                            ) : (
                                <div className="text-white/40 text-xs">{log.text.replace('OK', '')} <span className="text-terminal-green">OK</span></div>
                            )}
                        </div>
                    ))}

                    <div className="text-terminal-green blinking-cursor mt-2">
                        $ Monitoring vibe stream...
                    </div>
                </div>
            </div>
        </div>
    );
}
