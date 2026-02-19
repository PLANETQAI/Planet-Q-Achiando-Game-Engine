
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Star, Crosshair, Trophy, Sword, Zap } from 'lucide-react';

export default function GameCard({ game }) {
    const getCategoryIcon = (cat) => {
        switch (cat?.toLowerCase()) {
            case 'shooter': return <Crosshair className="w-4 h-4" />;
            case 'racing': return <Trophy className="w-4 h-4" />;
            case 'fighting': return <Sword className="w-4 h-4" />;
            default: return <Zap className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (cat) => {
        switch (cat?.toLowerCase()) {
            case 'shooter': return 'border-primary text-primary';
            case 'racing': return 'border-amber-400 text-amber-400';
            case 'fighting': return 'border-rose-500 text-rose-500';
            default: return 'border-secondary text-secondary';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -12 }}
            viewport={{ once: true }}
            className="group relative h-full flex flex-col bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-3xl hover:border-white/20 transition-all duration-500 shadow-2xl"
        >
            {/* Thumbnail Section */}
            <div className="aspect-[16/10] relative z-0 overflow-hidden bg-[#0d0d14]">
                {game.config?.background ? (
                    <img
                        src={`/assets/${game.config.background}`}
                        alt={game.name}
                        className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all group-hover:scale-110 duration-700"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                        <div className="absolute inset-0 planetq-grid opacity-10" />
                        <span className="text-6xl filter grayscale opacity-20">🕹️</span>
                    </div>
                )}

                {/* Glass Badge */}
                <div className={`absolute top-6 left-6 px-4 py-2 rounded-2xl border-2 backdrop-blur-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${getCategoryColor(game.category)}`}>
                    {getCategoryIcon(game.category)}
                    {game.category}
                </div>

                {/* Centered Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 scale-90 group-hover:scale-100">
                    <Link
                        href={`/play/${game.id}`}
                        className="size-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                    >
                        <Play className="w-8 h-8 fill-black ml-1" />
                    </Link>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black text-white italic tracking-tighter group-hover:text-primary transition-colors duration-300">
                        {game.name}
                    </h3>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-black text-white/60 tracking-tighter">4.9</span>
                    </div>
                </div>

                <p className="text-white/40 text-sm font-medium leading-relaxed mb-8 flex-1">
                    {game.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {game.tags?.map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/30 border border-white/5 group-hover:border-white/10 group-hover:text-white/50 transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
