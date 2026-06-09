<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RelationManagementController extends Controller
{
    public function index() {
        return Inertia::render('Administrator/RelationManagement', [
            'facilityPurposes' => FacilityPurpose::all(),
            'facilityPurposesEquipments' => FacilityPurposeEquipment::all(),
            'facilitySlots' => FacilitySlot::all(),
        ]);
    }
    //
}
