<?php

namespace App\Http\Controllers\Administrator\Relation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FacilityPurpose;

class FacilityPurposeController extends Controller
{
    public function index()
    {
        return FacilityPurpose::with([
            'facility',
            'purpose',
        ])->get();
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
        'facility_id' => ['required', 'exists:facilities,facility_id'],
        'purpose_id' => ['required', 'exists:purposes,purpose_id'],
        ]);

        return FacilityPurpose::create($validated);
    }


    public function update(Request $request, FacilityPurpose $facilityPurpose)
    {
        $validated = $request->validate([
        'facility_id' => ['required', 'exists:facilities,facility_id'],
        'purpose_id' => ['required', 'exists:purposes,purpose_id'],
        ]);

        $facilityPurpose->update($validated);

        return response()->json($facilityPurpose);
    }


    public function destroy(FacilityPurpose $facilityPurpose)
    {
        $facilityPurpose->delete();

        return response()->json([
            'message' => '削除しました'
        ]);
    }
}