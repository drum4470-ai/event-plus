<?php

namespace App\Http\Controllers\Administrator\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Slot;
use App\Http\Resources\SlotResource;

class SlotController extends Controller
{
     public function index()
    {
        return response()->json(Slot::all(), 200);
    }

    // 新規作成
    public function store(Request $request)
    {
        $validated = $request->validate([...]);
        $item = Slot::create($validated);
        return response()->json($item, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $item = Slot::findOrFail($id);
        $item->update($validated);

        return new SlotResource($item);
            ->response()
            ->setStatusCode(202);
    }
    // 削除処理
    public function destroy($id)
    {
        $item = Slot::findOrFail($id);
        $item->delete();
        return response()->json(['message' => '削除しました'], 200);
    }
}