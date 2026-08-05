<?php

namespace App\Http\Controllers\Administrator\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Building;
use App\Http\Resources\BuildingResource;

class BuildingController extends Controller
{
    // 一覧取得: Resourceを返すとAPIとしての品質が上がります
public function index()
    {
try {
        $buildings = \App\Models\Building::all();
        // ここで確認
        return BuildingResource::collection($buildings);
    } catch (\Exception $e) {
        // エラー詳細をログに吐き出す
        \Log::error('APIエラー:' . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }    }

    // 新規作成
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
        ]);
        $item = Building::create($validated);
        return (new BuildingResource($item))->response()->setStatusCode(201);
    }

    public function update(Request $request, $building_id)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:4|max:255',
            'address' => 'required|string',
        ]);

        $item = Building::findOrFail($building_id);
        $item->update($validated);

        return (new BuildingResource($item))->response()->setStatusCode(202);
    }
    // 削除処理
    public function destroy($building_id)
    {
        $item = Building::findOrFail($building_id);
        $item->delete();
        return response()->json(null, 204);
    }
}