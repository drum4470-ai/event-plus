<?php

namespace App\Http\Controllers\Administrator\Relation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\FacilityPurposeEquipment;
use App\Models\FacilityPurpose;


class FacilityPurposeEquipmentController extends Controller
{
    public function index() {
        return Inertia::render('administrator/facility-purpose-equipment/index', [
            'items' => FacilityPurposeEquipment::with(['facilityPurpose', 'equipment'])->get()
        ]);
    }

    public function create() {
        return Inertia::render('administrator/facility-purpose-equipment/create', [
            'facilityPurposes' => FacilityPurpose::with(['facility', 'purpose'])->get(),
            'equipments' => Equipment::all(),
        ]);
    }

    public function show($id) {
        $facilityPurposeEquipment = FacilityPurposeEquipment::with(['facilityPurpose.facility', 'facilityPurpose.purpose', 'equipment'])->findOrFail($id);
        return Inertia::render('administrator/facility-purpose-equipment/show', [
            'item' => $facilityPurposeEquipment
        ]);
    }

    public function edit($id) {
        $facilityPurposeEquipment = FacilityPurposeEquipment::findOrFail($id);
        return Inertia::render('administrator/facility-purpose-equipment/edit', [
            'item' => $facilityPurposeEquipment,
            'facilityPurposes' => FacilityPurpose::with(['facility', 'purpose'])->get(),
            'equipments' => Equipment::all(),
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'facility_purpose_id' => 'required|exists:facility_purposes,id',
            'equipment_id' => 'required|exists:equipments,equipment_id',
        ]);
        FacilityPurposeEquipment::create($validated);
        return redirect()->back();
    }

    public function update(Request $request, $id) {
        $validated = $request->validate([
            'facility_purpose_id' => 'required|exists:facility_purposes,id',
            'equipment_id' => 'required|exists:equipments,equipment_id',
        ]);
        FacilityPurposeEquipment::where('id', $id)->update($validated);
        return redirect()->back();
    }

    public function destroy($id) {
        DB::statement('PRAGMA foreign_keys = OFF');
        FacilityPurposeEquipment::where('id', $id)->delete();
        DB::statement('PRAGMA foreign_keys = ON');
        return redirect()->back();
    }
}
