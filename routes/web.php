<?php
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AdministratorSessionCheck;
use App\Http\Controllers\Administrator\AuthController as AdminAuthController;

use App\Http\Controllers\User\AuthController as UserAuthController;


Route::prefix('administrator')
    ->group(function () {
    // ログイン処理（POST）
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::get('/login', function () {
        return view('app');
    })->name('login');
});


Route::get('/administrator/{any?}', function () {
    return view('app'); // 管理者用レイアウト
})->where('any', '.*');

// 一般ユーザー用
Route::get('/user/{any?}', function () {
    return view('app'); // ユーザー用レイアウト（もし必要なら別のviewでもOK）
})->where('any', '.*');