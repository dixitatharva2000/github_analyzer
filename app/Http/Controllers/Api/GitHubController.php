<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


class GitHubController extends Controller
{
    public function test()
    {
        return response()->json([
            "status" => true,
            "msg" => "GitHub Controller is working!",
        ]);
    }

    public function getUser($username)
    {
        $response = Http::get("https://api.github.com/users/{$username}");

        if ($response->failed()) {
            return response()->json([
                'status' => false,
                'message' => 'GitHub user not found'
            ], 404);
        }

        $user = $response->json();

        return response()->json([
            'status' => true,
            'data' => [
                'username' => $user['login'] ?? null,
                'name' => $user['name'] ?? null,
                'avatar' => $user['avatar_url'] ?? null,
                'bio' => $user['bio'] ?? null,
                'location' => $user['location'] ?? null,
                'company' => $user['company'] ?? null,
                'blog' => $user['blog'] ?? null,
                'followers' => $user['followers'] ?? 0,
                'following' => $user['following'] ?? 0,
                'public_repos' => $user['public_repos'] ?? 0,
                'profile_url' => $user['html_url'] ?? null,
                'created_at' => $user['created_at'] ?? null,
            ]
        ]);
    }

    public function getRepositories($username)
    {
        $response = Http::get("https://api.github.com/users/{$username}/repos", [
            'sort' => 'updated',
            'per_page' => 10,
        ]);

        if ($response->failed()) {
            return response()->json([
                'status' => false,
                'message' => 'Repositories not found'
            ], 404);
        }

        $repositories = collect($response->json())->map(function ($repo) {
            return [
                'name' => $repo['name'] ?? null,
                'description' => $repo['description'] ?? null,
                'language' => $repo['language'] ?? null,
                'stars' => $repo['stargazers_count'] ?? 0,
                'forks' => $repo['forks_count'] ?? 0,
                'watchers' => $repo['watchers_count'] ?? 0,
                'repo_url' => $repo['html_url'] ?? null,
                'updated_at' => $repo['updated_at'] ?? null,
            ];
        });

        return response()->json([
            'status' => true,
            'data' => $repositories
        ]);
    }

    public function getStats($username)
    {
        $response = Http::get("https://api.github.com/users/{$username}/repos", [
            'per_page' => 100,
        ]);

        if ($response->failed()) {
            return response()->json([
                'status' => false,
                'message' => 'Unable to fetch GitHub repositories'
            ], 404);
        }

        $repos = collect($response->json());

        $totalStars = $repos->sum('stargazers_count');
        $totalForks = $repos->sum('forks_count');

        $languages = $repos
            ->pluck('language')
            ->filter()
            ->countBy()
            ->sortDesc();

        $topLanguage = $languages->keys()->first();

        $topRepository = $repos
            ->sortByDesc('stargazers_count')
            ->first();

        $userResponse = Http::get("https://api.github.com/users/{$username}");

        $user = $userResponse->successful()
            ? $userResponse->json()
            : [];

        $score = 0;

        // Repository score - max 20
        $score += min($repos->count() * 2, 20);

        // Stars score - max 20
        $score += min($totalStars, 20);

        // Followers score - max 20
        $score += min(($user['followers'] ?? 0), 20);

        // Language diversity - max 20
        $score += min($languages->count() * 4, 20);

        // Profile completeness - max 20
        $profileScore = 0;

        if (!empty($user['name'])) {
            $profileScore += 5;
        }

        if (!empty($user['bio'])) {
            $profileScore += 5;
        }

        if (!empty($user['location'])) {
            $profileScore += 5;
        }

        if (!empty($user['blog'])) {
            $profileScore += 5;
        }

        $score += $profileScore;

        return response()->json([
            'status' => true,
            'data' => [
                'total_repositories' => $repos->count(),
                'total_stars' => $totalStars,
                'total_forks' => $totalForks,
                'top_language' => $topLanguage,
                'languages' => $languages,
                'developer_score' => $score,
                'top_repository' => $topRepository ? [
                    'name' => $topRepository['name'],
                    'stars' => $topRepository['stargazers_count'],
                    'url' => $topRepository['html_url'],
                ] : null,
            ]
        ]);
    }
}
