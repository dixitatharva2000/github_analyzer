import Navbar from '@/components/Navbar';
import { useState } from 'react';

export default function GitHubCompare() {
    const [userOne, setUserOne] = useState('');
    const [userTwo, setUserTwo] = useState('');

    const [statsOne, setStatsOne] = useState<any>(null);
    const [statsTwo, setStatsTwo] = useState<any>(null);

    const [developerOne, setDeveloperOne] = useState<any>(null);
    const [developerTwo, setDeveloperTwo] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCompare = async () => {
        if (!userOne.trim() || !userTwo.trim()) {
            setError('Please enter both GitHub usernames');
            return;
        }

        setLoading(true);
        setError('');

        setDeveloperOne(null);
        setDeveloperTwo(null);
        setStatsOne(null);
        setStatsTwo(null);

        try {
            // Fetch profiles
            const [responseOne, responseTwo] = await Promise.all([
                fetch(`/api/github/user/${userOne}`),
                fetch(`/api/github/user/${userTwo}`)
            ]);

            const [dataOne, dataTwo] = await Promise.all([
                responseOne.json(),
                responseTwo.json()
            ]);

            if (!responseOne.ok || !dataOne.status) {
                setError(`${userOne} not found`);
                return;
            }

            if (!responseTwo.ok || !dataTwo.status) {
                setError(`${userTwo} not found`);
                return;
            }

            setDeveloperOne(dataOne.data);
            setDeveloperTwo(dataTwo.data);

            // Fetch stats
            const [statsResponseOne, statsResponseTwo] = await Promise.all([
                fetch(`/api/github/user/${userOne}/stats`),
                fetch(`/api/github/user/${userTwo}/stats`)
            ]);

            const [statsDataOne, statsDataTwo] = await Promise.all([
                statsResponseOne.json(),
                statsResponseTwo.json()
            ]);

            if (statsResponseOne.ok && statsDataOne.status) {
                setStatsOne(statsDataOne.data);
            }

            if (statsResponseTwo.ok && statsDataTwo.status) {
                setStatsTwo(statsDataTwo.data);
            }

        } catch (err) {
            setError('Something went wrong while comparing developers');
        } finally {
            setLoading(false);
        }
    };
    const comparisonMetrics =
        developerOne && developerTwo && statsOne && statsTwo
            ? [
                {
                    label: 'Developer Score',
                    one: statsOne.developer_score,
                    two: statsTwo.developer_score,
                },
                {
                    label: 'Repositories',
                    one: developerOne.public_repos,
                    two: developerTwo.public_repos,
                },
                {
                    label: 'Followers',
                    one: developerOne.followers,
                    two: developerTwo.followers,
                },
                {
                    label: 'Total Stars',
                    one: statsOne.total_stars,
                    two: statsTwo.total_stars,
                },
                {
                    label: 'Total Forks',
                    one: statsOne.total_forks,
                    two: statsTwo.total_forks,
                },
            ]
            : [];

    const winsOne = comparisonMetrics.filter(
        (item) => item.one > item.two
    ).length;

    const winsTwo = comparisonMetrics.filter(
        (item) => item.two > item.one
    ).length;

    const overallWinner =
        winsOne > winsTwo
            ? developerOne
            : winsTwo > winsOne
                ? developerTwo
                : null;
    return (
        <div className="min-h-screen bg-slate-950">

            <Navbar />

            <div className="px-4 py-10">
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
                            {error && (
                                <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-center">
                                    {error}
                                </div>
                            )}
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
                            {loading ? 'Comparing...' : 'Compare Developers'}
                        </button>

                    </div>


                    {developerOne && developerTwo && statsOne && statsTwo && (
                        <div className="mt-8">

                            {/* Profile Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Developer One */}
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                    <div className="flex items-center gap-5">

                                        <img
                                            src={developerOne.avatar}
                                            alt={developerOne.username}
                                            className="w-20 h-20 rounded-2xl border border-slate-700"
                                        />

                                        <div>
                                            <h2 className="text-2xl text-white font-bold">
                                                {developerOne.name || developerOne.username}
                                            </h2>

                                            <p className="text-emerald-400">
                                                <a
                                                    href={developerOne.profile_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="hover:underline"
                                                >
                                                    @{developerOne.username}
                                                </a>
                                            </p>

                                            <p className="text-slate-400 text-sm mt-2">
                                                {developerOne.bio || 'No bio available'}
                                            </p>
                                        </div>

                                    </div>
                                </div>

                                {/* Developer Two */}
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                    <div className="flex items-center gap-5">

                                        <img
                                            src={developerTwo.avatar}
                                            alt={developerTwo.username}
                                            className="w-20 h-20 rounded-2xl border border-slate-700"
                                        />

                                        <div>
                                            <h2 className="text-2xl text-white font-bold">
                                                {developerTwo.name || developerTwo.username}
                                            </h2>

                                            <p className="text-emerald-400">
                                                <a
                                                    href={developerTwo.profile_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="hover:underline"
                                                >
                                                    @{developerTwo.username}
                                                </a>
                                            </p>

                                            <p className="text-slate-400 text-sm mt-2">
                                                {developerTwo.bio || 'No bio available'}
                                            </p>
                                        </div>

                                    </div>
                                </div>

                            </div>

                            {/* Comparison */}
                            <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

                                <div className="p-6 border-b border-slate-800">

                                    <p className="text-emerald-400 text-sm font-medium">
                                        Head to Head
                                    </p>

                                    <h2 className="text-2xl text-white font-bold">
                                        Developer Comparison
                                    </h2>

                                </div>

                                {developerOne && developerTwo && statsOne && statsTwo && (
                                    <div className="mt-6 bg-gradient-to-br from-emerald-500/10 to-slate-900
                    border border-emerald-500/20 rounded-2xl p-8 text-center">

                                        <p className="text-emerald-400 text-sm font-medium">
                                            Battle Result
                                        </p>

                                        <h2 className="text-3xl text-white font-bold mt-2">
                                            Overall Winner
                                        </h2>

                                        {overallWinner ? (
                                            <>
                                                <img
                                                    src={overallWinner.avatar}
                                                    alt={overallWinner.username}
                                                    className="w-24 h-24 rounded-2xl mx-auto mt-6
                               border-2 border-emerald-500"
                                                />

                                                <div className="text-5xl mt-4">
                                                    🏆
                                                </div>

                                                <h3 className="text-2xl text-white font-bold mt-3">
                                                    {overallWinner.name || overallWinner.username}
                                                </h3>

                                                <p className="text-emerald-400 mt-1">
                                                    <a
                                                        href={developerOne.profile_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="hover:underline"
                                                    >@{overallWinner.username}</a>
                                                </p>

                                                <div className="flex justify-center items-center gap-5 mt-6">

                                                    <div className="bg-slate-950 rounded-xl px-6 py-4">
                                                        <p className="text-3xl text-white font-bold">
                                                            {winsOne}
                                                        </p>

                                                        <p className="text-slate-500 text-sm">
                                                            @{developerOne.username}
                                                        </p>
                                                    </div>

                                                    <span className="text-slate-500 font-bold">
                                                        VS
                                                    </span>

                                                    <div className="bg-slate-950 rounded-xl px-6 py-4">
                                                        <p className="text-3xl text-white font-bold">
                                                            {winsTwo}
                                                        </p>

                                                        <p className="text-slate-500 text-sm">
                                                            @{developerTwo.username}
                                                        </p>
                                                    </div>

                                                </div>

                                                <p className="text-slate-400 mt-6">
                                                    Wins the GitHub Developer Battle
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-5xl mt-6">
                                                    🤝
                                                </div>

                                                <h3 className="text-2xl text-white font-bold mt-3">
                                                    It's a Draw
                                                </h3>

                                                <p className="text-slate-400 mt-2">
                                                    Both developers won the same number of categories.
                                                </p>
                                            </>
                                        )}

                                    </div>
                                )}

                                {/* Table Header */}
                                <div className="grid grid-cols-3 bg-slate-950 px-6 py-4">

                                    <p className="text-white font-semibold">
                                        @{developerOne.username}
                                    </p>

                                    <p className="text-slate-500 text-center">
                                        Metric
                                    </p>

                                    <p className="text-white font-semibold text-right">
                                        @{developerTwo.username}
                                    </p>

                                </div>

                                {comparisonMetrics.map((item) => {

                                    const winner =
                                        item.one > item.two
                                            ? 1
                                            : item.two > item.one
                                                ? 2
                                                : 0;

                                    return (
                                        <div
                                            key={item.label}
                                            className="grid grid-cols-3 items-center px-6 py-5 border-t border-slate-800"
                                        >
                                            <div
                                                className={
                                                    winner === 1
                                                        ? 'text-emerald-400 font-bold'
                                                        : 'text-white font-semibold'
                                                }
                                            >
                                                {item.one}

                                                {winner === 1 && (
                                                    <span className="ml-2">
                                                        🏆
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-center text-slate-400 text-sm">
                                                {item.label}
                                            </div>

                                            <div
                                                className={
                                                    winner === 2
                                                        ? 'text-emerald-400 font-bold text-right'
                                                        : 'text-white font-semibold text-right'
                                                }
                                            >
                                                {winner === 2 && (
                                                    <span className="mr-2">
                                                        🏆
                                                    </span>
                                                )}
                                                {item.two}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}