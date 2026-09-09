import { useState } from 'react';

export default function GitHubCompare() {
    const [userOne, setUserOne] = useState('');
    const [userTwo, setUserTwo] = useState('');

    const handleCompare = () => {
        console.log('Compare:', userOne, userTwo);
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10">

            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-10">

                    <p className="text-emerald-400 text-sm font-medium">
                        Developer Battle
                    </p>

                    <h1 className="text-4xl md:text-5xl text-white font-bold mt-2">
                        GitHub Compare
                    </h1>

                    <p className="text-slate-400 mt-3">
                        Compare two GitHub developers side by side
                    </p>

                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 items-end">

                        {/* Developer One */}
                        <div>

                            <label className="text-slate-300 text-sm">
                                Developer One
                            </label>

                            <input
                                type="text"
                                value={userOne}
                                onChange={(e) => setUserOne(e.target.value)}
                                placeholder="Enter GitHub username"
                                className="w-full mt-2 bg-slate-950
                                           border border-slate-700
                                           text-white
                                           placeholder-slate-500
                                           rounded-xl px-5 py-3
                                           focus:outline-none
                                           focus:ring-2
                                           focus:ring-emerald-500"
                            />

                        </div>

                        {/* VS */}
                        <div className="flex justify-center pb-2">

                            <div className="w-12 h-12 rounded-full
                                            bg-emerald-500
                                            text-slate-950
                                            font-bold
                                            flex items-center justify-center">
                                VS
                            </div>

                        </div>

                        {/* Developer Two */}
                        <div>

                            <label className="text-slate-300 text-sm">
                                Developer Two
                            </label>

                            <input
                                type="text"
                                value={userTwo}
                                onChange={(e) => setUserTwo(e.target.value)}
                                placeholder="Enter GitHub username"
                                className="w-full mt-2 bg-slate-950
                                           border border-slate-700
                                           text-white
                                           placeholder-slate-500
                                           rounded-xl px-5 py-3
                                           focus:outline-none
                                           focus:ring-2
                                           focus:ring-emerald-500"
                            />

                        </div>

                    </div>

                    <button
                        onClick={handleCompare}
                        className="w-full mt-6
                                   bg-emerald-500
                                   hover:bg-emerald-400
                                   text-slate-950
                                   font-semibold
                                   py-3 rounded-xl
                                   transition"
                    >
                        Compare Developers
                    </button>

                </div>

            </div>

        </div>
    );
}