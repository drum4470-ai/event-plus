<?php

namespace App\Http\Controllers\Administrator\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Purpose;
use App\Http\Resources\PurposeResource; // 追加

class PurposeController extends Controller
{
    // 一覧取得
     public function index()
    {
        return PurposeResource::collection(Purpose::all())->response()->setStatusCode(200);
    }

    // 新規作成
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $item = Purpose::create($validated);
        return (new PurposeResource($item))->response()->setStatusCode(201);
    }

    public function update(Request $request, $purpose_id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $item = Purpose::findOrFail($purpose_id);
        $item->update($validated);

        return (new PurposeResource($item))->response()->setStatusCode(202);
    }
    // 削除処理
    public function destroy($purpose_id)
    {
        $item = Purpose::findOrFail($purpose_id);
        $item->delete();
        return response()->json(null, 204);
    }
}