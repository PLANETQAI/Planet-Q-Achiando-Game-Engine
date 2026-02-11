
'use client';

import { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function ChatInterface({ onSend }) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'ai', text: "I've updated the movement physics. Ready for the next \"vibe\" instruction." }
    ]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { role: 'user', text: input }]);
        onSend?.(input);
        setInput('');
        // Mock response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: "Got it. Adjusting the vibe parameters now..." }]);
        }, 1000);
    };

    return (
        <div className="h-[320px] border-t border-white/10 flex flex-col bg-background-dark/40 backdrop-blur-md">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">Vibe Prompt</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`size-6 rounded flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-primary/20' : 'bg-white/10'}`}>
                            {msg.role === 'ai' ? <Bot className="w-3 h-3 text-primary" /> : <User className="w-3 h-3 text-white/60" />}
                        </div>
                        <div className={`rounded-2xl px-4 py-2 text-sm max-w-[80%] ${msg.role === 'ai'
                                ? 'bg-white/5 text-white/80 border border-white/10 rounded-tl-none'
                                : 'bg-primary/20 text-white border border-primary/20 rounded-tr-none'
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 pt-0">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none pr-12 text-white placeholder-white/30"
                        placeholder="Type a new vibe prompt..."
                        rows={2}
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-3 bottom-3 size-8 bg-primary rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        <Send className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
}
