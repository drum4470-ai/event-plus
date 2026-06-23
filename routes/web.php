<?php
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AdministratorSessionCheck;
use App\Http\Controllers\Administrator\AuthController as AdminAuthController;

use App\Http\Controllers\User\AuthController as UserAuthController;

// routes/web.php
// 1. 認証不要なルート（ログインなど）
Route::prefix('api/administrator')->group(function () {
    // Route::post('/login', [AdminAuthController::class, 'login']);
});

// 3. SPA用ルーティング（上記にマッチしないものは全て React へ）
// routes/web.php

// 管理者用
Route::get('/administrator/{any?}', function () {
    return view('app'); // 管理者用レイアウト
})->where('any', '.*');

// 一般ユーザー用
Route::get('/user/{any?}', function () {
    return view('app'); // ユーザー用レイアウト（もし必要なら別のviewでもOK）
})->where('any', '.*');