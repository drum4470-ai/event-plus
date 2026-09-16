<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\UserController;


// 管理者ログイン画面
Route::get('/administrator/login', function () {
    return view('app');
});

// 利用者ログイン画面
Route::get('/login', function () {
    return view('app');
});

Route::post('/user/registration', [UserController::class, 'store']);

Route::get('/reset-password/{token}', function ($token) {
    return view('app');
})->name('password.reset');


// 管理者画面
Route::get('/administrator/{any?}', function () {
    return view('app');
})->where('any', '.*');

// 利用者画面
Route::get('/user/{any?}', function () {
    return view('app');
})->where('any', '.*');

