
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
    return (
        <div className="relative overflow-hidden min-h-[80vh] flex items-center justify-center bg-[url('/grid-bg.svg')] bg-cover bg-center">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/0 via-black/50 to-black z-0" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl" />
            <div className="absolute top-40 -left-20 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl" />

            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-300">AI-Powered Game Generation</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 tracking-tight">
                        Dream It. <span className="text-purple-500">Code It.</span> Play It.
                    </h1>

                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Describe your game idea and watch as our AI writes the code in real-time.
                        Create professional-grade shooters and racers in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/play"
                            className="px-8 py-4 bg-white text-black text-lg font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            Start Creating <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="#gallery"
                            className="px-8 py-4 bg-white/10 text-white text-lg font-bold rounded-full hover:bg-white/20 backdrop-blur-md transition-colors border border-white/10"
                        >
                            View Gallery
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
