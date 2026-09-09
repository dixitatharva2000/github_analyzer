<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GitHubController;

Route::get('/apitest', function () {
    return response()->json([
        "status" => true,
        "msg" => "GitHub Analyzer API is working fine",
    ]);
});

Route::get('/test', [GitHubController::class, 'test']);

Route::get('/github/user/{username}', [GitHubController::class, 'getUser']);

Route::get('/github/user/{username}/repos', [GitHubController::class, 'getRepositories']);

Route::get('/github/user/{username}/stats', [GitHubController::class, 'getStats']);
