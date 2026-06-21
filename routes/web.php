<?php
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AdministratorSessionCheck;
use App\Http\Controllers\Administrator\AuthController as AdminAuthController;
use App\Http\Controllers\Administrator\DashboardController;
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

// routes/web.php
Route::get('/{any}', function () {
    return view('app'); // Reactをマウントするための空のBladeファイル
})->where('any', '.*');