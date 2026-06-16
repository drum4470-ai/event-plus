<?php

namespace App\Http\Controllers\Administrator\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Building;
use App\Http\Resources\BuildingResource;

class BuildingController extends Controller
{
    // 一覧取得
    public function index() {
        return BuildingResource::collection(Building::all());
    }

    // 特定データの取得（詳細・編集の初期値用）
    public function show($id) {
        $building = Building::findOrFail($id);
        return new BuildingResource($building);
    }

    // 新規登録
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:4|max:255',
            'address' => 'required|string',
        ]);

        $building = Building::create($validated);
        return new BuildingResource($building);
    }

    // 更新
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:4|max:255',
            'address' => 'required|string',
        ]);

        $building = Building::findOrFail($id);
        $building->update($validated);

        return new BuildingResource($building);
    }

    // 削除
    public function destroy($id)
    {
        $building = Building::findOrFail($id);
        $building->delete();

        return response()->json(['message' => '削除しました'], 200);
    }
}