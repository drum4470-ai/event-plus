<?php

namespace App\Http\Controllers\Administrator\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Facility;
use App\Http\Resources\FacilityResource;

class FacilityController extends Controller
{
    public function index()
    {
        return FacilityResource::collection(Facility::with('building')->get())->response()->setStatusCode(200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'building_id' => 'required|exists:buildings,building_id', 
        ]);

        $item = Facility::create($validated);
        
        // リソースを通した201レスポンス
        return (new FacilityResource($item))->response()->setStatusCode(201);
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

    public function destroy($id)
    {
        $item = Facility::findOrFail($id);
        $item->delete();

        // 削除時はデータがないので、JSONメッセージを返します
        return response()->json(['message' => '削除しました'], 203);
    }
}