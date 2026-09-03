<?php

namespace App\Http\Controllers\Administrator\Relation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FacilityPurposeEquipment;

class FacilityPurposeEquipmentController extends Controller
{
    public function index()
    {
        return FacilityPurposeEquipment::with([
            'facility_purpose',
            'equipment',
        ])->get();
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'facility_purpose_id' => 'required|exists:facility_purposes,facility_purpose_id',
            'equipment_id' => 'required|exists:equipments,equipment_id',
        ]);

        return FacilityPurposeEquipment::create($validated);
    }


    public function update(Request $request, FacilityPurposeEquipment $facilityPurposeEquipment)
    {
        $validated = $request->validate([
            'facility_purpose_id' => 'required|exists:facility_purposes,facility_purpose_id',
            'equipment_id' => 'required|exists:equipments,equipment_id',
        ]);

        $facilityPurposeEquipment->update($validated);

        return response()->json($facilityPurposeEquipment);
    }


    public function destroy(FacilityPurposeEquipment $facilityPurposeEquipment)
    {
        $facilityPurposeEquipment->delete();

        return response()->json([
            'message' => '削除しました'
        ]);
    }
}