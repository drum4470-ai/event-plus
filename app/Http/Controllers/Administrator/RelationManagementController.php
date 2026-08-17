<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Facility;
use App\Models\Purpose;
use App\Models\Equipment;
use App\Models\Slot;
use App\Models\FacilityPurpose;
use App\Models\FacilityPurposeEquipment;
use App\Models\FacilitySlot;

class RelationManagementController extends Controller
{
    public function index(Request $request)
    {
        $facilities = Facility::with([
            'buildings',

            // 施設 × 利用目的
            'facilityPurposes.purposes',

            // 施設 × 利用目的 × 設備
            'facilityPurposes.facilityPurposeEquipments.equipments',

            // 施設 × 時間枠
            'facilitySlots.slots',

        ])
        ->orderBy('building_id')
        ->orderBy('name')
        ->get();

        // indexメソッドの中に正しくレスポンスを配置する
        return response()->json([
            'facilities' => $facilities,
            'purposes' => Purpose::all(),
            'equipments' => Equipment::all(),
            'slots' => Slot::all(),
            'initialTab' => $request->query('tab', 'relation'),
        ]);
    }
}