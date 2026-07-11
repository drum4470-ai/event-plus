<?php
use App\Http\Controllers\Administrator\DashboardController;
use App\Http\Controllers\Administrator\MasterManagementController;
use App\Http\Controllers\Administrator\RelationManagementController;
use App\Http\Controllers\Administrator\AccountController;
use App\Http\Controllers\Administrator\AuthController as AdminAuthController;
use App\Http\Middleware\AdministratorSessionCheck;

use App\Http\Controllers\Administrator\Master\FacilityController;
use App\Http\Controllers\Administrator\Master\BuildingController;
use App\Http\Controllers\Administrator\Master\EquipmentController;
use App\Http\Controllers\Administrator\Master\PurposeController;
use App\Http\Controllers\Administrator\Master\SlotController;
use App\Http\Controllers\Administrator\Relation\FacilityPurposeEquipmentController;
use App\Http\Controllers\Administrator\Relation\FacilityPurposeController;
use App\Http\Controllers\Administrator\Relation\FacilitySlotController;


// 2. 認証が必要な API ルート
Route::prefix('administrator')->middleware([AdministratorSessionCheck::class])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/master', [MasterManagementController::class, 'index']);
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    
    // 各マスター管理の API
    Route::apiResource('facilities', FacilityController::class);
    Route::apiResource('buildings', BuildingController::class);
    Route::apiResource('equipment', EquipmentController::class);
    Route::apiResource('purposes', PurposeController::class);
    Route::apiResource('slots', SlotController::class);
    Route::apiResource('facility-purpose-equipment', FacilityPurposeEquipmentController::class);
    Route::apiResource('facility-purpose', FacilityPurposeController::class);
    Route::apiResource('facility-slot', FacilitySlotController::class);
    // ... 他のコントローラーもここに追加
});
