<?php

namespace App\Http\Controllers\Administrator\Relation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\FacilitySlot;

class FacilitySlotController extends Controller
{
    public function index()
    {
        return FacilitySlot::with([
            'facility',
            'slot',
        ])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'facility_id' => 'required|exists:facilities,id',
            'slot_id' => 'required|exists:slots,id',
        ]);

        return FacilitySlot::create($validated);
    }

    public function update(Request $request, FacilitySlot $facilitySlot)
    {
        $facilitySlot->update($request->all());

        return response()->json($facilitySlot);
    }

    public function destroy(FacilitySlot $facilitySlot)
    {
        $facilitySlot->delete();

        return response()->json([
            'message' => '削除しました'
        ]);
    }
}