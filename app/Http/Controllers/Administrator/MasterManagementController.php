<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class MasterManagementController extends Controller
{
    public function index(Request $request)
    {
        // 必要なデータをモデルから取得（例）
        $buildings = \App\Models\Building::all()->sortBy('name')->values();
        $facilities = \App\Models\Facility::all()->sortBy('name')->values();
        $equipments = \App\Models\Equipment::all()->sortBy('name')->values();
        $purposes = \App\Models\Purpose::all()->sortBy('name')->values();
        $slots = \App\Models\Slot::all()->sortBy('name')->values();

        return response()->json([
            'buildings' => $buildings,
            'facilities' => $facilities,
            'equipments' => $equipments,
            'purposes' => $purposes,
            'slots' => $slots,

            'initialTab' => $request->query('tab', 'registration'),
            // submitUrl情報をpropsで渡す
            'submitUrls' => [
                'facility_store' => '/administrator/facilities',
                'facility_update' => '/administrator/facilities',
                'building_store' => '/administrator/buildings',
                'building_update' => '/administrator/buildings',
                'purpose_store' => '/administrator/purposes',
                'purpose_update' => '/administrator/purposes',
                'equipment_store' => '/administrator/equipment',
                'equipment_update' => '/administrator/equipment',
                'slot_store' => '/administrator/slots',
                'slot_update' => '/administrator/slots',
            ],
        ]);
    }
}