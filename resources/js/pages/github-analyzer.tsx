import Navbar from '@/components/Navbar';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export default function GitHubAnalyzer() {
    const [username, setUsername] = useState('');
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [repos, setRepos] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);

    const [recentSearches, setRecentSearches] = useState<any[]>([]);

    const fetchRecentSearches = async () => {
        try {
            const response = await fetch('/api/github/history/recent');
            const data = await response.json();

            if (response.ok && data.status) {
                setRecentSearches(data.data);
            }
        } catch (error) {
            console.error('Unable to load recent searches');
        }
    };

    useEffect(() => {
        fetchRecentSearches();
    }, []);

    const handleSearch = async () => {
        if (!username.trim()) {
            setError('Please enter a GitHub username');
            return;
        }

        setLoading(true);
        setError('');
        setUser(null);
        setRepos([]);

        try {
            const response = await fetch(
                `/api/github/user/${username}`
            );

            const data = await response.json();

            if (!response.ok || !data.status) {
                setError(data.message || 'User not found');
                return;
            }

            setUser(data.data);

            const repoResponse = await fetch(
                `/api/github/user/${username}/repos`
            );

            const repoData = await repoResponse.json();

            if (repoResponse.ok && repoData.status) {
                setRepos(repoData.data);
            }

            const statsResponse = await fetch(
                `/api/github/user/${username}/stats`
            );

            const statsData = await statsResponse.json();

            if (statsResponse.ok && statsData.status) {
                setStats(statsData.data);

                await fetchRecentSearches();
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const languageData = stats?.languages
        ? Object.entries(stats.languages).map(([name, value]) => ({
            name,
            value: Number(value),
        }))
        : [];

    const developerScore = stats?.developer_score ?? 0;

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Strong';
        if (score >= 40) return 'Growing';

        return 'Beginner';
    };

    const analyzeAgain = async (selectedUsername: string) => {
        setUsername(selectedUsername);

        setLoading(true);
        setError('');
        setUser(null);
        setRepos([]);
        setStats(null);

        try {
            const response = await fetch(
                `/api/github/user/${selectedUsername}`
            );

            const data = await response.json();

            if (!response.ok || !data.status) {
                setError(data.message || 'User not found');
                return;
            }

            setUser(data.data);

            const repoResponse = await fetch(
                `/api/github/user/${selectedUsername}/repos`
            );

            const repoData = await repoResponse.json();

            if (repoResponse.ok && repoData.status) {
                setRepos(repoData.data);
            }

            const statsResponse = await fetch(
                `/api/github/user/${selectedUsername}/stats`
            );

            const statsData = await statsResponse.json();

            if (statsResponse.ok && statsData.status) {
                setStats(statsData.data);

                await fetchRecentSearches();
            }

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });

        } catch (error) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const deleteHistory = async (id: number) => {
        try {
            const response = await fetch(
                `/api/github/history/${id}`,
                {
                    method: 'DELETE',
                }
            );

            const data = await response.json();

            if (response.ok && data.status) {
                setRecentSearches((current) =>
                    current.filter((item) => item.id !== id)
                );
            }
        } catch (error) {
            console.error('Unable to delete history');
        }
    };

    const clearAllHistory = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to clear all search history?'
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch('/api/github/history', {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok && data.status) {
                setRecentSearches([]);
            }
        } catch (error) {
            console.error('Unable to clear history');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">

            <Navbar />

            <div className="px-4 py-10">

                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full text-sm text-emerald-400 mb-4">
                            GitHub Developer Intelligence
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            GitHub Analyzer
                        </h1>

                        <p className="text-slate-400 mt-3">
                            Discover developer profiles, repositories and activity
                            insights in seconds.
                        </p>
                    </div>

                    {recentSearches.length > 0 && (
                        <section className="mb-10">

                            <div className="mb-5 flex items-end justify-between gap-4">

                                <div>
                                    <p className="text-emerald-400 text-sm font-medium">
                                        Search History
                                    </p>

                                    <h2 className="text-2xl font-bold text-white">
                                        Recently Analyzed
                                    </h2>

                                    <p className="text-slate-500 text-sm mt-1">
                                        Developers you've analyzed recently
                                    </p>
                                </div>

                                <button
                                    onClick={clearAllHistory}
                                    className="text-sm text-red-400
                   border border-red-500/20
                   hover:bg-red-500/10
                   px-4 py-2 rounded-lg transition"
                                >
                                    Clear All
                                </button>

                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                                {recentSearches.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-slate-900 border border-slate-800
                               rounded-2xl p-5
                               hover:border-emerald-500/40
                               transition"
                                    >

                                        <div className="flex items-center gap-4">

                                            <img
                                                src={item.avatar}
                                                alt={item.username}
                                                className="w-12 h-12 rounded-xl"
                                            />

                                            <div className="min-w-0">

                                                <h3 className="text-white font-semibold truncate">
                                                    {item.name || item.username}
                                                </h3>

                                                <p className="text-slate-500 text-sm truncate">
                                                    @{item.username}
                                                </p>

                                            </div>

                                        </div>

                                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-800">

                                            <div>
                                                <p className="text-slate-500 text-xs">
                                                    Developer Score
                                                </p>

                                                <p className="text-emerald-400 text-xl font-bold">
                                                    {item.developer_score}
                                                    <span className="text-slate-600 text-sm font-normal">
                                                        /100
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">

                                                <button
                                                    onClick={() => analyzeAgain(item.username)}
                                                    className="text-sm text-slate-300
                   hover:text-emerald-400 transition"
                                                >

                                                </button>

                                                <button
                                                    onClick={() => deleteHistory(item.id)}
                                                    className="text-sm text-red-400
                   hover:text-red-300 transition"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    </div>
                                ))}

                            </div>

                        </section>
                    )}

                    {/* Search */}
                    <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-6">

                        <div className="flex flex-col md:flex-row gap-3">

                            {/* Username Input */}
                            <div className="relative flex-1">

                                <input
                                    type="text"
                                    placeholder="Enter GitHub username..."
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                    className="w-full bg-slate-950 border border-slate-700
                       text-white placeholder-slate-500
                       rounded-xl px-5 py-3 pr-12
                       focus:outline-none
                       focus:ring-2
                       focus:ring-emerald-500"
                                />

                                {/* Clear Button */}
                                {username && (
                                    <button
                                        type="button"
                                        onClick={() => setUsername('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2
                           text-slate-500 hover:text-white
                           transition"
                                        title="Clear"
                                    >
                                        <X size={18} />
                                    </button>
                                )}

                            </div>

                            {/* Analyze Button */}
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="bg-emerald-500 hover:bg-emerald-400
                   text-slate-950 font-semibold
                   px-7 py-3 rounded-xl
                   transition duration-200
                   disabled:opacity-50"
                            >
                                {loading ? 'Analyzing...' : 'Analyze Profile'}
                            </button>

                        </div>

                        {error && (
                            <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                    </div>

                    {/* Profile */}
                    {user && (
                        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 md:p-8">

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                                    <div className="relative">
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="w-28 h-28 rounded-2xl object-cover border-4 border-slate-800"
                                        />

                                        <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-emerald-500 border-4 border-slate-900 rounded-full"></div>
                                    </div>

                                    <div className="text-center sm:text-left">

                                        <h2 className="text-3xl font-bold text-white">
                                            {user.name || user.username}
                                        </h2>

                                        <p className="text-emerald-400 mt-1">
                                            @{user.username}
                                        </p>

                                        <p className="text-slate-400 mt-3 max-w-xl">
                                            {user.bio || 'No bio available'}
                                        </p>

                                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">

                                            {user.location && (
                                                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-sm">
                                                    📍 {user.location}
                                                </span>
                                            )}

                                            {user.company && (
                                                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-sm">
                                                    🏢 {user.company}
                                                </span>
                                            )}

                                        </div>

                                    </div>

                                </div>

                                <a
                                    href={user.profile_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="border border-slate-700
                                           text-white hover:bg-slate-800
                                           px-5 py-3 rounded-xl
                                           transition text-center"
                                >
                                    View GitHub →
                                </a>

                            </div>

                            {/* Profile Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">

                                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                                    <p className="text-slate-500 text-sm">
                                        Repositories
                                    </p>

                                    <h3 className="text-3xl text-white font-bold mt-1">
                                        {user.public_repos}
                                    </h3>
                                </div>

                                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                                    <p className="text-slate-500 text-sm">
                                        Followers
                                    </p>

                                    <h3 className="text-3xl text-white font-bold mt-1">
                                        {user.followers}
                                    </h3>
                                </div>

                                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                                    <p className="text-slate-500 text-sm">
                                        Following
                                    </p>

                                    <h3 className="text-3xl text-white font-bold mt-1">
                                        {user.following}
                                    </h3>
                                </div>

                            </div>

                        </div>
                    )}
                    {/* Stats */}
                    {stats && (
                        <div className="mt-8">

                            <div className="mb-5">
                                <p className="text-emerald-400 text-sm font-medium">
                                    Developer Insights
                                </p>

                                <h2 className="text-2xl md:text-3xl text-white font-bold">
                                    Profile Statistics
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                                {/* Total Stars */}
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-500 text-sm">
                                                Total Stars
                                            </p>

                                            <h3 className="text-3xl text-white font-bold mt-2">
                                                {stats.total_stars}
                                            </h3>
                                        </div>

                                        <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-xl">
                                            ⭐
                                        </div>
                                    </div>
                                </div>

                                {/* Total Forks */}
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-500 text-sm">
                                                Total Forks
                                            </p>

                                            <h3 className="text-3xl text-white font-bold mt-2">
                                                {stats.total_forks}
                                            </h3>
                                        </div>

                                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-xl">
                                            🍴
                                        </div>
                                    </div>
                                </div>

                                {/* Top Language */}
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-500 text-sm">
                                                Top Language
                                            </p>

                                            <h3 className="text-2xl text-white font-bold mt-2">
                                                {stats.top_language || 'Unknown'}
                                            </h3>
                                        </div>

                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-xl">
                                            💻
                                        </div>
                                    </div>
                                </div>

                                {/* Top Repository */}
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                    <p className="text-slate-500 text-sm">
                                        Top Repository
                                    </p>

                                    {stats.top_repository ? (
                                        <>
                                            <h3 className="text-lg text-white font-bold mt-2 truncate">
                                                {stats.top_repository.name}
                                            </h3>

                                            <div className="flex items-center justify-between mt-3">

                                                <span className="text-yellow-400 text-sm">
                                                    ⭐ {stats.top_repository.stars}
                                                </span>

                                                <a
                                                    href={stats.top_repository.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-emerald-400 text-sm hover:underline"
                                                >
                                                    Open →
                                                </a>

                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-slate-500 mt-2">
                                            No repository
                                        </p>
                                    )}
                                </div>

                            </div>

                        </div>
                    )}

                    {stats && (
                        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                                {/* Score Circle */}
                                <div className="flex justify-center">

                                    <div
                                        className="relative w-52 h-52 rounded-full flex items-center justify-center"
                                        style={{
                                            background: `conic-gradient(
                            #10b981 ${developerScore * 3.6}deg,
                            #1e293b 0deg
                        )`,
                                        }}
                                    >

                                        <div className="absolute w-40 h-40 bg-slate-900 rounded-full flex flex-col items-center justify-center">

                                            <span className="text-5xl font-bold text-white">
                                                {developerScore}
                                            </span>

                                            <span className="text-slate-500">
                                                / 100
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                {/* Score Information */}
                                <div>

                                    <p className="text-emerald-400 text-sm font-medium">
                                        Developer Rating
                                    </p>

                                    <h2 className="text-3xl font-bold text-white mt-1">
                                        Developer Score
                                    </h2>

                                    <p className="text-slate-400 mt-3 leading-6">
                                        This score analyzes repository activity, stars,
                                        followers, language diversity and profile completeness.
                                    </p>

                                    <div className="mt-6">

                                        <span className="inline-flex bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full font-medium">
                                            {getScoreLabel(developerScore)} Profile
                                        </span>

                                    </div>

                                    {/* Score Scale */}
                                    <div className="grid grid-cols-4 gap-2 mt-7 text-center text-xs">

                                        <div className="bg-slate-950 rounded-lg p-3">
                                            <p className="text-slate-500">0–39</p>
                                            <p className="text-white mt-1">Beginner</p>
                                        </div>

                                        <div className="bg-slate-950 rounded-lg p-3">
                                            <p className="text-slate-500">40–59</p>
                                            <p className="text-white mt-1">Growing</p>
                                        </div>

                                        <div className="bg-slate-950 rounded-lg p-3">
                                            <p className="text-slate-500">60–79</p>
                                            <p className="text-white mt-1">Strong</p>
                                        </div>

                                        <div className="bg-slate-950 rounded-lg p-3">
                                            <p className="text-slate-500">80–100</p>
                                            <p className="text-white mt-1">Excellent</p>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>
                    )}

                    {stats && languageData.length > 0 && (
                        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">

                            <div className="mb-6">
                                <p className="text-emerald-400 text-sm font-medium">
                                    Technology Stack
                                </p>

                                <h2 className="text-2xl font-bold text-white">
                                    Language Distribution
                                </h2>

                                <p className="text-slate-500 text-sm mt-1">
                                    Languages used across public repositories
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                                {/* Chart */}
                                <div className="h-[300px]">

                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>

                                            <Pie
                                                data={languageData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={110}
                                                paddingAngle={4}
                                            >

                                                {languageData.map((entry, index) => (
                                                    <Cell
                                                        key={entry.name}
                                                        fill={[
                                                            '#10b981',
                                                            '#3b82f6',
                                                            '#f59e0b',
                                                            '#8b5cf6',
                                                            '#ef4444',
                                                            '#06b6d4',
                                                        ][index % 6]}
                                                    />
                                                ))}

                                            </Pie>

                                            <Tooltip />

                                        </PieChart>
                                    </ResponsiveContainer>

                                </div>

                                {/* Language List */}
                                <div className="space-y-4">

                                    {languageData.map((language, index) => (

                                        <div
                                            key={language.name}
                                            className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-5 py-4"
                                        >

                                            <div className="flex items-center gap-3">

                                                <span
                                                    className="w-3 h-3 rounded-full"
                                                    style={{
                                                        backgroundColor: [
                                                            '#10b981',
                                                            '#3b82f6',
                                                            '#f59e0b',
                                                            '#8b5cf6',
                                                            '#ef4444',
                                                            '#06b6d4',
                                                        ][index % 6],
                                                    }}
                                                />

                                                <span className="text-slate-300">
                                                    {language.name}
                                                </span>

                                            </div>

                                            <span className="text-white font-semibold">
                                                {language.value} repos
                                            </span>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>
                    )}

                    {/* Repositories */}
                    {repos.length > 0 && (
                        <div className="mt-10">

                            <div className="flex items-center justify-between mb-5">

                                <div>
                                    <p className="text-emerald-400 text-sm font-medium">
                                        Projects
                                    </p>

                                    <h2 className="text-2xl md:text-3xl text-white font-bold">
                                        Latest Repositories
                                    </h2>
                                </div>

                                <span className="bg-slate-900 border border-slate-800 text-slate-400 px-4 py-2 rounded-xl text-sm">
                                    {repos.length} repositories
                                </span>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                                {repos.map((repo, index) => (
                                    <div
                                        key={index}
                                        className="group bg-slate-900
                                               border border-slate-800
                                               hover:border-emerald-500/50
                                               rounded-2xl p-6
                                               transition duration-300
                                               hover:-translate-y-1
                                               hover:shadow-xl
                                               flex flex-col justify-between
                                               min-h-[230px]"
                                    >

                                        <div>

                                            <div className="flex justify-between items-start gap-4">

                                                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
                                                    &lt;/&gt;
                                                </div>

                                                <a
                                                    href={repo.repo_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-slate-500
                                                           group-hover:text-emerald-400
                                                           transition"
                                                >
                                                    ↗
                                                </a>

                                            </div>

                                            <h3 className="text-xl text-white font-semibold mt-5 group-hover:text-emerald-400 transition">
                                                {repo.name}
                                            </h3>

                                            <p className="text-slate-400 mt-3 text-sm leading-6">
                                                {repo.description ||
                                                    'No description available'}
                                            </p>

                                        </div>

                                        <div className="border-t border-slate-800 mt-6 pt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">

                                            <span>
                                                ⭐ {repo.stars}
                                            </span>

                                            <span>
                                                🍴 {repo.forks}
                                            </span>

                                            <span>
                                                👀 {repo.watchers}
                                            </span>

                                            <span className="ml-auto bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full">
                                                {repo.language || 'Unknown'}
                                            </span>

                                        </div>

                                    </div>
                                ))}

                            </div>

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}