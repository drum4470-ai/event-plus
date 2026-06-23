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
        return response()->json(Building::all(), 200);
    }

    // 新規作成
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
        ]);
        $item = Building::create($validated);
        return response()->json($item, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:4|max:255',
            'address' => 'required|string',
        ]);

        $item = Building::findOrFail($id);
        $item->update($validated);

        return (new BuildingResource($item))->response()->setStatusCode(202);
    }
    // 削除処理
    public function destroy($id)
    {
        $item = Building::findOrFail($id);
        $item->delete();
        return response()->json(['message' => '削除しました'], 200);
    }

    // 更新: 変更後の最新データを返す

   
}