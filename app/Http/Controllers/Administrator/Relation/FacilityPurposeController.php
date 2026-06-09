<?php

namespace App\Http\Controllers\Administrator\Relation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FacilityPurposeController extends Controller
{
    public function index() {
        return Inertia::render('administrator/facility-purpose/index', [
            'items' => FacilityPurpose::with(['facility', 'purpose'])->get()
        ]);
    }

    public function create() {
        return Inertia::render('administrator/facility-purpose/create', [
            'facilities' => Facility::all(),
            'purposes' => Purpose::all(),
        ]);
    }

    public function show($id) {
        $facilityPurpose = FacilityPurpose::with(['facility', 'purpose'])->findOrFail($id);
        return Inertia::render('administrator/facility-purpose/show', [
            'item' => $facilityPurpose
        ]);
    }

    public function edit($id) {
        $facilityPurpose = FacilityPurpose::findOrFail($id);
        return Inertia::render('administrator/facility-purpose/edit', [
            'item' => $facilityPurpose,
            'facilities' => Facility::all(),
            'purposes' => Purpose::all(),
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'facility_id' => 'required|exists:facilities,facility_id',
            'purpose_id' => 'required|exists:purposes,purpose_id',
        ]);
        FacilityPurpose::create($validated);
        return redirect()->back();
    }

    public function update(Request $request, $id) {
        $validated = $request->validate([
            'facility_id' => 'required|exists:facilities,facility_id',
            'purpose_id' => 'required|exists:purposes,purpose_id',
        ]);
        FacilityPurpose::where('id', $id)->update($validated);
        return redirect()->back();
    }

    public function destroy($id) {
        FacilityPurpose::where('id', $id)->delete();
        return redirect()->back();
    }
}
