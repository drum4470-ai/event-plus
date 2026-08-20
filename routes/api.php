<?php

use App\Http\Controllers\Administrator\RelationManagementController;
use App\Http\Controllers\Administrator\DashboardController;
use App\Http\Controllers\Administrator\MasterManagementController;
use App\Http\Controllers\Administrator\AccountController;
use App\Http\Controllers\Administrator\AuthController as AdminAuthController;


use App\Http\Controllers\Administrator\Master\FacilityController;
use App\Http\Controllers\Administrator\Master\BuildingController;
use App\Http\Controllers\Administrator\Master\EquipmentController;
use App\Http\Controllers\Administrator\Master\PurposeController;
use App\Http\Controllers\Administrator\Master\SlotController;
use App\Http\Controllers\Administrator\Relation\FacilityPurposeEquipmentController;
use App\Http\Controllers\Administrator\Relation\FacilityPurposeController;
use App\Http\Controllers\Administrator\Relation\FacilitySlotController;


// Route::middleware(['web'])->prefix('administrator')->group(function () {
//     Route::post('/login', [AdminAuthController::class, 'login']);
// });
// Route::middleware('auth:sanctum')->get('/test', function (\Illuminate\Http\Request $request) {
//     return response()->json([
//         'check' => auth()->check(),
//         'user' => auth()->user(),
//     ]);
// });
Route::middleware('auth:sanctum')->prefix('administrator')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/master', [MasterManagementController::class, 'index']);
    Route::get('/relation', [RelationManagementController::class, 'index']);

    Route::post('/logout', [AdminAuthController::class, 'logout']);

    // 各マスター管理の API
    Route::apiResource('facilities', FacilityController::class);
    Route::apiResource('buildings', BuildingController::class);
    Route::apiResource('equipments', EquipmentController::class);
    Route::apiResource('purposes', PurposeController::class);
    Route::apiResource('slots', SlotController::class);
    Route::apiResource('facility-purpose-equipments', FacilityPurposeEquipmentController::class);
    Route::apiResource('facility-purposes', FacilityPurposeController::class);
    Route::apiResource('facility-slots', FacilitySlotController::class);

    Route::apiResource('accounts', AccountController::class);
    Route::patch('/accounts/{user}/password', [AccountController::class, 'updatePassword']);
    // ... 他のコントローラーもここに追加
});
