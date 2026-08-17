<?php

namespace App\Http\Controllers\Administrator\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Equipment; // 仮のモデル名
use App\Http\Resources\EquipmentResource;

class EquipmentController extends Controller
{
    public function index()
    {
        return EquipmentResource::collection(Equipment::all())->response()->setStatusCode(200);
    }

    // 新規作成
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $item = Equipment::create($validated);
        return (new EquipmentResource($item))->response()->setStatusCode(201);
    }

    public function update(Request $request, $equipment_id)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:4|max:255',
        ]);

        $item = Equipment::findOrFail($equipment_id);
        $item->update($validated);

        return (new EquipmentResource($item))->response()->setStatusCode(202);
    }
    // 削除処理
    public function destroy($equipment_id)
    {
        $item = Equipment::findOrFail($equipment_id);
        $item->delete();
        return response()->json(null, 204);
    }   
}