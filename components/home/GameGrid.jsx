
'use client';
import { useState } from 'react';
import GameCard from './GameCard';
import { getAllGames } from '@/lib/gameRegistry';
import { LayoutGrid } from 'lucide-react';

export default function GameGrid() {
    const [activeFilter, setActiveFilter] = useState('all');

    const allGames = getAllGames().filter(g =>
        ['shooter', 'racing', 'platform-racing', 'fighting'].includes(g.category?.toLowerCase())
    );

    const filteredGames = activeFilter === 'all'
        ? allGames
        : allGames.filter(g => g.category?.toLowerCase().includes(activeFilter.toLowerCase()));

    const filters = [
        { id: 'all', label: 'All Engines' },
        { id: 'shooter', label: 'Shooters' },
        { id: 'racing', label: 'Racing' },
        { id: 'fighting', label: 'Fighting' }
    ];

    return (
        <section id="gallery" className="py-32 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col items-center mb-20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Galactic Arcade</span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-12">FEATURED WORLDS</h2>

                    {/* PlanetQ Pill Filters */}
                    <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                        {filters.map(f => (
                            <button
                                key={f.id}
                                onClick={() => setActiveFilter(f.id)}
                                className={`px-6 py-2.5 rounded-xl transition-all text-xs font-black uppercase tracking-widest ${activeFilter === f.id
                                        ? 'bg-primary text-black shadow-[0_0_20px_rgba(0,242,255,0.4)]'
                                        : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredGames.map(game => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            </div>
        </section>
    );
}
