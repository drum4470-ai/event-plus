<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Administrator\AuthController as AdminAuth;
use App\Http\Controllers\Administrator\MasterController;
use App\Http\Controllers\Administrator\DashboardController;
use App\Http\Controllers\Administrator\RelationController;
use App\Http\Controllers\Administrator\AccountController;

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

    // ログイン後ページ
    Route::middleware(['admin.check'])->group(function () {
        
        // URL: /administrator/dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
 
        // マスタ選択画面（登録用 / 編集用）
        Route::get('/master-selection', [MasterController::class, 'index'])->name('master.index');
        Route::get('/master-selection/edit', [MasterController::class, 'editIndex'])->name('master.editIndex'); // 💡 追加
        
        // マスタ登録
        Route::get('/master-registration/{type}/create', [MasterController::class, 'create'])->name('master.create');
        Route::post('/master-registration', [MasterController::class, 'store'])->name('master.store');
        
        // マスタ編集・更新・削除
        Route::get('/master-edit', [MasterController::class, 'edit'])->name('master.edit');
        Route::put('/master-edit/{id}', [MasterController::class, 'update'])->name('master.update');
        Route::delete('/master-edit/{id}', [MasterController::class, 'destroy'])->name('master.destroy');

       
        // 紐付け登録画面
        Route::get('/relation-registration', [RelationController::class, 'create'])->name('relation.create');
        
        // 各種紐付け保存処理
        Route::post('/relation-registration/facility-purpose', [RelationController::class, 'storeBuildingFacilityPurpose'])->name('relation.storeBuildingFacilityPurpose');
        Route::post('/relation-registration/equipment', [RelationController::class, 'storeEquipment'])->name('relation.storeEquipment');
        Route::post('/relation-registration/building-facility-slot', [RelationController::class, 'storeSlot'])->name('relation.storeSlot');
        
        // 紐付け一覧・編集画面
        Route::get('/relation-edit', [RelationController::class, 'edit'])->name('relation.edit');
        
        // 各種紐付け削除処理
        Route::delete('/relation-edit/facility-purpose/{id}', [RelationController::class, 'destroyBuildingFacilityPurpose'])->name('relation.destroyBuildingFacilityPurpose'); // 💡 修正
        Route::delete('/relation-edit/equipment/{id}', [RelationController::class, 'destroyEquipment'])->name('relation.destroyEquipment');
        Route::delete('/relation-edit/building-facility-slot/{id}', [RelationController::class, 'destroySlot'])->name('relation.destroySlot');

        // 管理者アカウント登録画面
        Route::get('/account-registration', [AccountController::class, 'index'])->name('account-registration.index');
        Route::get('/account-registration/create', [AccountController::class, 'create'])->name('account-registration.create');

        Route::post('/account-registration', [AccountController::class, 'store'])->name('account-registration.store');
        Route::get('/account-edit', [AccountController::class, 'edit'])->name('account-registration.edit');
        Route::put('/account-edit/{id}', [AccountController::class, 'update'])->name('account-registration.update');
        Route::delete('/account-edit/{id}', [AccountController::class, 'destroy'])->name('account-registration.destroy');

    });
});