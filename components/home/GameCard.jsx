
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Star } from 'lucide-react';

export default function GameCard({ game }) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group relative bg-gray-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-purple-500/50 transition-colors"
        >
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-800 relative z-0 group-hover:bg-gray-700 transition-colors overflow-hidden">
                {game.config?.background ? (
                    <img
                        src={`/assets/${game.config.background}`}
                        alt={game.name}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all group-hover:scale-110 duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                        <span className="text-4xl text-white/20">🎮</span>
                    </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Link
                        href={`/play/${game.id}`}
                        className="px-6 py-3 bg-white text-black rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        <Play className="w-4 h-4 fill-black" /> Play Now
                    </Link>
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">{game.category}</span>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">{game.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <span className="text-sm font-bold">4.9</span>
                    </div>
                </div>

                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {game.description}
                </p>

                <div className="flex flex-wrap gap-2">
                    {game.tags?.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-white/5 rounded-md text-xs text-gray-300 border border-white/5">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
