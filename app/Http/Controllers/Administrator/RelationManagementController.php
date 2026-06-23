<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;


class RelationManagementController extends Controller
{
    public function index()
    {
        $facilityPurpses = FacilityPurpose::all()->sortBy('name')->values();
        $facilityPurpseEquipment = FacilityPurposeEquipment::all()->sortBy('name')->values();
        $facilitySlots = FacilitySlot::all()->sortBy('name')->values();


       return response()->json([
            'facilityPurposes' => $facilityPurpses,
            'facilityPurpseEquipment' => $facilityPurpseEquipment,
            'facilitySlots' => $facilitySlots,
        ]);
    }

    // 未実装
}