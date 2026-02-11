
'use client';


import GameCard from './GameCard';
import { getAllGames } from '@/lib/gameRegistry';

export default function GameGrid() {
    const allGames = getAllGames().filter(g =>
        ['shooter', 'racing', 'platform-racing'].includes(g.category?.toLowerCase())
    );

    return (
        <section id="gallery" className="py-20 container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-bold text-white">Featured Games</h2>
                <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-medium">All</button>
                    <button className="px-4 py-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-sm font-medium">Shooter</button>
                    <button className="px-4 py-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-sm font-medium">Racing</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allGames.map(game => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </section>
    );
}
