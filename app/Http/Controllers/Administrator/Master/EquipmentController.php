<?php

namespace App\Http\Controllers\Administrator\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Equipment;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    public function index() {
        return Inertia::render('administrator/equipment/index', [
            'items' => Equipment::all()
        ]);
    }

    public function create() {
        return Inertia::render('administrator/equipment/create');
    }

    public function show($id) {
        $equipment = Equipment::findOrFail($id);
        return Inertia::render('administrator/equipment/show', [
            'item' => $equipment
        ]);
    }

    public function edit($id) {
        $equipment = Equipment::findOrFail($id);
        return Inertia::render('administrator/equipment/edit', [
            'item' => $equipment
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        Equipment::create($validated);
        return redirect()->back();
    }

    public function update(Request $request, $id) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        Equipment::where('equipment_id', $id)->update($validated);
        return redirect()->back();
    }

    public function destroy($id) {
        DB::statement('PRAGMA foreign_keys = OFF');
        Equipment::where('equipment_id', $id)->delete();
        DB::statement('PRAGMA foreign_keys = ON');
        return redirect()->back();
    }


}
