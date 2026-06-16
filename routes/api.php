<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Administrator\Master\FacilityController;
use App\Http\Controllers\Administrator\Master\BuildingController;
use App\Http\Controllers\Administrator\Master\EquipmentController;
use App\Http\Controllers\Administrator\Master\PurposeController;
use App\Http\Controllers\Administrator\Master\SlotController;
use App\Http\Controllers\Administrator\Relation\FacilityPurposeEquipmentController;
use App\Http\Controllers\Administrator\Relation\FacilityPurposeController;
use App\Http\Controllers\Administrator\Relation\FacilitySlotController;
// ... 他のコントローラー

// APIは自動的に api/administrator/... のようになる
Route::prefix('administrator')->group(function () {
    // リソース管理 
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