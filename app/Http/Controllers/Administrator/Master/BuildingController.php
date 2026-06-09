<?php

namespace App\Http\Controllers\Administrator\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BuildingController extends Controller
{
    public function index() {
        return Inertia::render('administrator/building/index', [
            'items' => Building::all()
        ]);
    }
    
    public function create() {
        return Inertia::render('administrator/building/create');
    }

    public function show($id) {
        $building = Building::findOrFail($id);
        return Inertia::render('administrator/building/show', [
            'item' => $building
        ]);
    }
    public function edit($id) {
        $building = Building::findOrFail($id);
        return Inertia::render('administrator/building/edit', [
            'item' => $building
        ]);
    }



    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
        ]);
        Building::create($validated);
        return redirect()->back();
    }

    public function update(Request $request, $id) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
        ]);
        Building::where('building_id', $id)->update($validated);
        return redirect()->back();
    }

    public function destroy($id) {
        Building::where('building_id', $id)->delete();
        return redirect()->back();
    }
}
