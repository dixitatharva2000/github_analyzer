import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {
    const { url } = usePage();

    const isActive = (path: string) => url === path;

    return (
        <nav className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

                <div>
                    <h1 className="text-white font-bold text-xl">
                        GitHub Analyzer
                    </h1>

                    <p className="text-slate-500 text-xs">
                        Developer Intelligence Platform
                    </p>
                </div>

                <div className="flex items-center gap-2">

                    <Link
                        href="/github-analyzer"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/github-analyzer')
                            ? 'bg-emerald-500 text-slate-950'
                            : 'text-slate-300 hover:bg-slate-800'
                            }`}
                    >
                        Analyzer
                    </Link>

                    <Link
                        href="/github-compare"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/github-compare')
                            ? 'bg-emerald-500 text-slate-950'
                            : 'text-slate-300 hover:bg-slate-800'
                            }`}
                    >
                        Compare
                    </Link>

                </div>

            </div>
        </nav>
    );
}