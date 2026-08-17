<?php

namespace App\Http\Controllers\Administrator\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Facility;
use App\Models\FacilityPurpose;
use App\Models\FacilityPurposeEquipment;
use App\Models\FacilitySlot;
use App\Http\Resources\FacilityResource;
use Illuminate\Validation\Rule;

class FacilityController extends Controller
{
    public function index()
    {
        return FacilityResource::collection(Facility::with('building')->get())->response()->setStatusCode(200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'string',
            // 💡 同じ building_id の中だけで name が重複していないかチェック
                Rule::unique('facilities')->where(function ($query) use ($request) {
                return $query->where('building_id', $request->building_id);
                }),
            ],
            'building_id' => 'required|exists:buildings,building_id', 
        ]);

        $item = Facility::create($validated);
        
        // リソースを通した201レスポンス
        return (new FacilityResource($item))->response()->setStatusCode(201);
    }

    public function update(Request $request, $facility_id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'building_id' => 'required|exists:buildings,building_id',
        ]);

        $item = Facility::findOrFail($facility_id);
        $item->update($validated);

        return (new FacilityResource($item))->response()->setStatusCode(202);
    }

    public function destroy($facility_id)
    {
        $item = Facility::findOrFail($facility_id);
        $item->delete();

        // 削除時はデータがないので、JSONメッセージを返します
        return response()->json(null, 204);
    }
}