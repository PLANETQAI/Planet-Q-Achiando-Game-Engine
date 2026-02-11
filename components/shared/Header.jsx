
import Link from 'next/link';

export default function Header() {
    return (
        <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-lg" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Q-Game
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Explore
                    </Link>
                    <Link href="/play" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Create
                    </Link>
                    <Link href="/library" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Library
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link
                        href="/play"
                        className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors"
                    >
                        Start Creating
                    </Link>
                </div>
            </div>
        </header>
    );
}
