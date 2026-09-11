<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GitHubSearchHistory extends Model
{
    protected $table = 'github_search_histories';
    protected $fillable = [
        'username',
        'name',
        'avatar',
        'developer_score',
    ];
}
