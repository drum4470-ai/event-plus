<?php
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AdministratorSessionCheck;

use App\Http\Controllers\Administrator\Master\FacilityController;
use App\Http\Controllers\Administrator\Master\BuildingController;
use App\Http\Controllers\Administrator\Master\EquipmentController;
use App\Http\Controllers\Administrator\Master\PurposeController;
use App\Http\Controllers\Administrator\Master\SlotController;
use App\Http\Controllers\Administrator\Relation\FacilityPurposeEquipmentController;
use App\Http\Controllers\Administrator\Relation\FacilityPurposeController;
use App\Http\Controllers\Administrator\Relation\FacilitySlotController;

use App\Http\Controllers\Administrator\AuthController as AdminAuthController;
use App\Http\Controllers\Administrator\DashboardController;
use App\Http\Controllers\Administrator\MasterManagementController;
use App\Http\Controllers\Administrator\RelationManagementnController;
use App\Http\Controllers\Administrator\AccountController;


use App\Http\Controllers\User\AuthController as UserAuthController;

Route::prefix('administrator')->group(function () {
    Route::get('/login', [AdminAuthController::class, 'showLoginForm'])->name('administrator.login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('administrator.login.submit');
});

// 2. ミドルウェアが必要なルートグループ
Route::prefix('administrator')->middleware([AdministratorSessionCheck::class])->group(function () {


    Route::get('/master', [MasterManagementController::class, 'index'])->name('master.index');
    
    // ダッシュボード
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('administrator.dashboard');
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('administrator.logout');

    // リソース管理 (これらはこのままでOK: /administrator/facilities になる)
    Route::resource('facilities', FacilityController::class);
    Route::resource('buildings', BuildingController::class);
    Route::resource('equipment', EquipmentController::class);
    Route::resource('purposes', PurposeController::class);
    Route::resource('slots', SlotController::class);

    // リレーション管理
    Route::resource('facility-purpose-equipment', FacilityPurposeEquipmentController::class);
    Route::resource('facility-purpose', FacilityPurposeController::class);
    Route::resource('facility-slot', FacilitySlotController::class);
});


// アカウント管理


// ユーザー登録


// イベント管理


// 
// 