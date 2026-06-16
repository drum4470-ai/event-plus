<?php
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AdministratorSessionCheck;
use App\Http\Controllers\Administrator\AuthController as AdminAuthController;
use App\Http\Controllers\Administrator\DashboardController;
use App\Http\Controllers\Administrator\MasterManagementController;
use App\Http\Controllers\Administrator\RelationManagementController;
use App\Http\Controllers\Administrator\AccountController;


use App\Http\Controllers\User\AuthController as UserAuthController;

Route::prefix('administrator')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLoginForm'])->name('administrator.login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('administrator.login.submit');
});

// 2. ミドルウェアが必要なルートグループ
Route::prefix('administrator')->middleware([AdministratorSessionCheck::class])->group(function () {


    Route::get('/master', [MasterManagementController::class, 'index'])->name('master.index');
    Route::get('/relation', [RelationManagementController::class, 'index'])->name('relation.index');
    Route::get('/account', [AccountController::class, 'index'])->name('account.index');

    // ダッシュボード
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('administrator.dashboard');
    // Route::post('/logout', [AdminAuthController::class, 'logout'])->name('administrator.logout');未実装


});


// アカウント管理


// ユーザー登録


// イベント管理


// 
// 