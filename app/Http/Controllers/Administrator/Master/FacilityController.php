<?php

namespace App\Http\Controllers\Administrator\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Facility;
use App\Models\Building;

class FacilityController extends Controller
{
    
    public function index()
    {
        return response()->json(Facility::all(), 200);
    }

    // 新規作成
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',

        ]);
        $item = Facility::create($validated);
        return response()->json($item, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'building_id' => 'required|exists:buildings,building_id',
        ]);

        $item = Facility::findOrFail($id);
        $item->update($validated);

        return (new FacilityResource($item))->response()->setStatusCode(202);
    }
    // 削除処理
    public function destroy($id)
    {
        $item = Facility::findOrFail($id);
        $item->delete();
        return response()->json(['message' => '削除しました'], 200);
    }
}