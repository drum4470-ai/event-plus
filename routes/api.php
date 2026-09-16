<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Administrator\AuthController as AdminAuthController;
use App\Http\Controllers\Administrator\DashboardController as AdminDashboardController;
use App\Http\Controllers\Administrator\MasterManagementController;
use App\Http\Controllers\Administrator\RelationManagementController;
use App\Http\Controllers\Administrator\AccountController;
use App\Http\Controllers\Administrator\Master\FacilityController;
use App\Http\Controllers\Administrator\Master\BuildingController;
use App\Http\Controllers\Administrator\Master\EquipmentController;
use App\Http\Controllers\Administrator\Master\PurposeController;
use App\Http\Controllers\Administrator\Master\SlotController;
use App\Http\Controllers\Administrator\Relation\FacilityPurposeEquipmentController;
use App\Http\Controllers\Administrator\Relation\FacilityPurposeController;
use App\Http\Controllers\Administrator\Relation\FacilitySlotController;

use App\Http\Controllers\User\AuthController as UserAuthController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\User\ResetPasswordController;
use App\Http\Controllers\User\ForgotPasswordController;

use App\Http\Controllers\User\ApplicationController;

Route::post('/administrator/login', [AdminAuthController::class, 'login']);
Route::post('/user/login', [UserAuthController::class, 'login']);
// Route::post('/user-registration', [UserController::class, 'store']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/reset-password', [ResetPasswordController::class,'resetpassword']);

Route::middleware('auth:admin')->prefix('administrator')->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);
    Route::get('/master', [MasterManagementController::class, 'index']);
    Route::get('/relation', [RelationManagementController::class, 'index']);
    Route::patch('/accounts/{user}/password', [AccountController::class, 'updatePassword']);    
    Route::apiResource('facilities', FacilityController::class);
    Route::apiResource('buildings', BuildingController::class);
    Route::apiResource('equipments', EquipmentController::class);
    Route::apiResource('purposes', PurposeController::class);
    Route::apiResource('slots', SlotController::class);
    Route::apiResource('facility-purpose-equipments', FacilityPurposeEquipmentController::class);
    Route::apiResource('facility-purposes', FacilityPurposeController::class);
    Route::apiResource('facility-slots', FacilitySlotController::class);
    Route::apiResource('accounts', AccountController::class);
    
    });
    
    Route::middleware('auth:user')->prefix('user')->group(function () {
        Route::post('/logout', [UserAuthController::class, 'logout']);
        Route::get('/dashboard', [UserDashboardController::class, 'index']);
        Route::apiResource('/edit', UserController::class);
        Route::get('/applications/relations', [RelationManagementController::class, 'index']);
        Route::apiResource('/applications', ApplicationController::class);
        Route::apiResource('/applications/search', ApplicationController::class);
    });