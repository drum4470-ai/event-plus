<?php

namespace App\Http\Controllers\Administrator\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Facility;
use App\Models\Building;
use Inertia\Inertia;

class FacilityController extends Controller
{
    public function index() {
        return Inertia::render('administrator/facility/index', [
            'items' => Facility::with('building')->get(),
            'buildings' => Building::all()
        ]);
    }

    public function create() {
        return Inertia::render('administrator/facility/create', [
            'buildings' => Building::all()
        ]);
    }
    
    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'building_id' => 'required|exists:buildings,building_id',
        ]);
        Facility::create($validated);
        return redirect()->back();
    }
    
    public function show($id) {
        $facility = Facility::with('building')->findOrFail($id);
        return Inertia::render('administrator/facility/show', [
            'item' => $facility
        ]);
    }

    public function edit($id) {
        $facility = Facility::with('building')->findOrFail($id);
        return Inertia::render('administrator/facility/edit', [
            'item' => $facility,
            'buildings' => Building::all()
        ]);
    }



    public function update(Request $request, $id) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'building_id' => 'required|exists:buildings,building_id',
        ]);
        Facility::where('facility_id', $id)->update($validated);
        return redirect()->back();
    }

   public function destroy($id) 
    {
        // 外部キーチェックを一時的にオフ
        DB::statement('PRAGMA foreign_keys = OFF');
        
        // 削除処理
        Facility::where('facility_id', $id)->delete();
        
        // チェックを元に戻す
        DB::statement('PRAGMA foreign_keys = ON');
        
        return redirect()->back();
    }
}