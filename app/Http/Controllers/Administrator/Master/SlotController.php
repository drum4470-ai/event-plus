<?php

namespace App\Http\Controllers\Administrator\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Slot;
use App\Http\Resources\SlotResource;

class SlotController extends Controller
{
    public function index(){
    try {
            $slots = \App\Models\Slot::all();
            // ここで確認
            return SlotResource::collection($slots);
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
        ]);
        $item = Slot::create($validated);
        return (new SlotResource($item))->response()->setStatusCode(201);
    }

    public function update(Request $request, $slot_id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $item = Slot::findOrFail($slot_id);
        $item->update($validated);

        return (new SlotResource($item))->response()->setStatusCode(202);
    }
    // 削除処理
    public function destroy($slot_id)
    {
        $item = Slot::findOrFail($slot_id);
        $item->delete();
        return response()->json(null, 204);
    }
}