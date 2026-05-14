
<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Administrator\AuthController as AdminAuth;
use App\Http\Controllers\Administrator\MasterRegistrationController;
use App\Http\Controllers\Administrator\DashboardController;
use App\Http\Controllers\User\AuthController as UserAuth;


/*
|--------------------------------------------------------------------------
| 1. 管理者専用ルート (Aシリーズ)
| URL: https://example.com/administrator/...
|--------------------------------------------------------------------------
*/
Route::prefix('administrator')->name('administrator.')->group(function () {

    // A1: 管理者ログイン (ログイン前)
    Route::get('/login', [AdminAuth::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AdminAuth::class, 'login']);

    // ログイン後ページ (middlewareは自作するか、各Controllerでチェック)
    Route::middleware(['admin.check'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/master-registration', [MasterRegistrationController::class, 'index'])->name('MasterRegistration.index');
        Route::get('/master-registration/create', [MasterRegistrationController::class, 'create'])->name('MasterRegistration.create');

        // これを追加！
        Route::post('/master-registration', [MasterRegistrationController::class, 'store'])->name('MasterRegistration.store');
    });
});

/*
| 2. 利用者専用ルート (Cシリーズ)
| URL: https://example.com/user/...
|--------------------------------------------------------------------------
*/
Route::prefix('user')->name('user.')->group(function () {

    // C1: 利用者ログイン (ログイン前)
    Route::get('/login', [UserAuth::class, 'showLoginForm'])->name('login');
    Route::post('/login', [UserAuth::class, 'login']);

    // Cシリーズ（ログイン後：要 auth:web）
    Route::middleware(['auth:web'])->group(function () {
        Route::get('/summary', function () {
            return Inertia::render('user/summary');
        })->name('summary');
    });
});
