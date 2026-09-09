<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__ . '/settings.php';

Route::get('/github-analyzer', function () {
    return Inertia::render('github-analyzer');
});

Route::get('/github-compare', function () {
    return Inertia::render('github-compare');
});

