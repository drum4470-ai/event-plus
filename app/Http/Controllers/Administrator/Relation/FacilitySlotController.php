<?php

namespace App\Http\Controllers\Administrator\Relation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\FacilitySlot;

class FacilitySlotController extends Controller
{
    public function index() {
        return Inertia::render('administrator/facility-slot/index', [
            'items' => FacilitySlot::with(['facility', 'slot'])->get()
        ]);
    }

    public function create() {
        return Inertia::render('administrator/facility-slot/create', [
            'facilities' => Facility::all(),
            'slots' => Slot::all(),
        ]);
    }

    public function show($id) {
        $facilitySlot = FacilitySlot::with(['facility', 'slot'])->findOrFail($id);
        return Inertia::render('administrator/facility-slot/show', [
            'item' => $facilitySlot
        ]);
    }

    public function edit($id) {
        $facilitySlot = FacilitySlot::findOrFail($id);
        return Inertia::render('administrator/facility-slot/edit', [
            'item' => $facilitySlot,
            'facilities' => Facility::all(),
            'slots' => Slot::all(),
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'facility_id' => 'required|exists:facilities,facility_id',
            'slot_id' => 'required|exists:slots,slot_id',
        ]);
        FacilitySlot::create($validated);
        return redirect()->back();
    }

    public function update(Request $request, $id) {
        $validated = $request->validate([
            'facility_id' => 'required|exists:facilities,facility_id',
            'slot_id' => 'required|exists:slots,slot_id',
        ]);
        FacilitySlot::where('id', $id)->update($validated);
        return redirect()->back();
    }

    public function destroy($id) {
        DB::statement('PRAGMA foreign_keys = OFF');
        FacilitySlot::where('id', $id)->delete();
        DB::statement('PRAGMA foreign_keys = ON');
        return redirect()->back();
    }

    
}
