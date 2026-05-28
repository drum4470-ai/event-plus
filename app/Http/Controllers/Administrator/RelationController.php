<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Building;
use App\Models\Facility;
use App\Models\Slot;
use App\Models\Equipment;
use App\Models\Purpose;
use App\Models\FacilityPurpose;          
use App\Models\FacilityPurposeEquipment;
use App\Models\FacilitySlot;             
use Inertia\Inertia;

class RelationController extends Controller
{

    
    public function create()
    {
        
        return Inertia::render('administrator/relation-registration', [
            'buildings'         => Building::all(),
            'facilities'        => Facility::with('building')->get(),
            'purposes'          => Purpose::all(),
            'equipments'        => Equipment::all(),
            'slots'             => Slot::all(),
            
            'relatedPurposes'   => FacilityPurpose::with(['facility.building', 'purpose'])->get(),
            'relatedEquipments' => FacilityPurposeEquipment::with(['facilityPurpose.facility.building', 'facilityPurpose.purpose', 'equipment'])->get(),
            'relatedSlots'      => FacilitySlot::with(['facility.building', 'slot'])->get(),
            
        ]);
    }
    
    /**
     * 🔵 施設 - 目的 紐付け保存処理
     */
    public function storeBuildingFacilityPurpose(Request $request)
    {
        // 💡 building_id は facility に紐づいているため、バリデーションと保存から除外
        $validated = $request->validate([
            'facility_id' => 'required|exists:facilities,facility_id',
            'purpose_id'  => 'required|exists:purposes,purpose_id',
        ]);

        FacilityPurpose::firstOrCreate($validated);

        return redirect()->back()->with('message', '施設と目的の紐付けを登録しました');
    }


    public function storeEquipment(Request $request)
    {
        $validated = $request->validate([
            'facility_id'  => 'required|exists:facilities,facility_id',
            'purpose_id'   => 'required|exists:purposes,purpose_id',
            'equipment_id' => 'required|exists:equipment,equipment_id',
        ]);

        $facilityPurpose = FacilityPurpose::firstOrCreate([
            'facility_id' => $validated['facility_id'],
            'purpose_id'  => $validated['purpose_id'],
        ]);

        FacilityPurposeEquipment::firstOrCreate([
            'facility_purpose_id' => $facilityPurpose->id,
            'equipment_id'        => $validated['equipment_id'],
        ]);

        return redirect()->back()->with('message', '設備の紐付けを登録しました');
    }

    public function storeSlot(Request $request)
    {
        $validated = $request->validate([
            'facility_id' => 'required|exists:facilities,facility_id',
            'slot_ids'    => 'required|array|min:1',
            'slot_ids.*'  => 'exists:slots,slot_id',
        ]);

        foreach ($validated['slot_ids'] as $slot_id) {
            FacilitySlot::firstOrCreate([
                'facility_id' => $validated['facility_id'],
                'slot_id'     => $slot_id,
            ]);
        }

        return redirect()->back()->with('message', count($validated['slot_ids']) . '個の時間枠を登録しました');
    }

  
    public function edit()
    {
        return Inertia::render('administrator/relation-edit', [
            'buildings'         => Building::all(),
            'facilities'        => Facility::with('building')->get(),
            'purposes'          => Purpose::all(),
            'equipments'        => Equipment::all(),
            'slots'             => Slot::all(),

            'relatedPurposes'   => FacilityPurpose::with(['facility.building', 'purpose'])->get(),
            'relatedEquipments' => FacilityPurposeEquipment::with(['facilityPurpose.facility.building', 'facilityPurpose.purpose', 'equipment'])->get(),
            'relatedSlots'      => FacilitySlot::with(['facility.building', 'slot'])->get(),

        ]);
    }

   
    public function destroyBuildingFacilityPurpose($id)
    {
        FacilityPurpose::findOrFail($id)->delete();
        return redirect()->back()->with('message', '施設と目的の紐付けを削除しました');
    }

    public function destroyBuildingFacilityPurposeEquipment($id)
    {
        FacilityPurposeEquipment::findOrFail($id)->delete();
        return redirect()->back()->with('message', '設備の紐付けを削除しました');
    }

   
    public function destroySlot($id)
    {
        FacilitySlot::findOrFail($id)->delete();
        return redirect()->back()->with('message', '時間枠の紐付けを削除しました');
    }
}