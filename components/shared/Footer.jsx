
export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-md" />
                        <span className="font-bold text-gray-400">Q-Game Generator</span>
                    </div>

                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">Discord</a>
                    </div>

                    <div className="text-sm text-gray-600">
                        © 2026 Q-Game Inc.
                    </div>
                </div>
            </div>
        </footer>
    );
}
