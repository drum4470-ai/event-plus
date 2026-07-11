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
        // return SlotResource::collection(Slot::all())->response()->setStatusCode(200);
        return response()->json(['status' => 'debug', 'message' => 'Controller is working']);
    }

    // 新規作成
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $item = Slot::create($validated);
        return (new SlotResource($item))->response()->setStatusCode(201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $item = Slot::findOrFail($id);
        $item->update($validated);

        return (new SlotResource($item))->response()->setStatusCode(202);
    }
    // 削除処理
    public function destroy($id)
    {
        $item = Slot::findOrFail($id);
        $item->delete();
        return response()->json(null, 204);
    }
}