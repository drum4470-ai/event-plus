<?php

namespace App\Http\Controllers\Administrator;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Building;
use App\Models\Facility;
use App\Models\FacilitySlot;
use App\Models\Equipment;
use App\Models\Purpose;
use Inertia\Inertia;

class MasterRegistrationController extends Controller
{
    public function index()
    {
        return Inertia::render('administrator/master-selection');
    }
    
    public function create(Request $request)
    {
        $type = $request->query('type'); 

        $existingNames = match($type) {
            // マイグレーションがないと現状エラーになる
            'building'  => \App\Models\Building::pluck('name'),
            'facility'  => \App\Models\Facility::pluck('name'),
            'slot'      => \App\Models\FacilitySlot::pluck('name'),
            'equipment' => \App\Models\Equipment::pluck('name'),
            'purpose'   => \App\Models\Purpose::pluck('name'),
            default     => [],
        };

        return Inertia::render('administrator/master-registration', [
            'type' => $type,
            'existingNames' => $existingNames, // これをReactで受け取ります
        ]);
    }
    public function store(Request $request)
    {
        $type = $request->input('type');
        $name = $request->input('name');

        // バリデーション
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
        ]);

        // 保存処理
       switch ($type) {
            case 'building':
                Building::create([
                    'name' => $name
                    ]);
                break;
            case 'facility':
                // 施設の場合は建物IDが必要になるため、本来は別途選択が必要
                // 暫定的に保存、または建物選択を促す処理が必要
                Facility::create([
                    'name' => $name,
                    'building_id' => $request->building_id ?? 1
                    ]);
                break;
            case 'slot':
                FacilitySlot::create([
                    'name' => $name,
                    'facility_id' => $request->facility_id ?? 1
                ]);
                break;
            case 'equipment':
                Equipment::create([
                    'name' => $name,
                    'facility_id' => $request->facility_id ?? 1 ,
                    'purpose_id' => $request->purpose_id ?? 1 ,
                ]);
                break;
            case 'purpose':
                Purpose::create([
                    'name' => $name
                ]);
                break;
        }

        // ここでメソッドを閉じる前にリターンする
        return redirect('/administrator/master-registration/create?type=' . $type)->with('message', '登録が完了しました');
    }
    // 編集画面の表示
    public function edit(Request $request, $id)
    {
        $type = $request->query('type'); // building, facility など

        // 対象のモデルを特定してデータ取得
        $model = match($type) {
            'building'  => Building::findOrFail($id),
            'facility'  => Facility::findOrFail($id),
            'slot'      => FacilitySlot::findOrFail($id),
            'equipment' => Equipment::findOrFail($id),
            'purpose'   => Purpose::findOrFail($id),
            default     => abort(404),
        };

        return Inertia::render('administrator/master-edit', [
            'type' => $type,
            'item' => $model, // 編集対象のデータ
        ]);
    }

    // 更新処理
    public function update(Request $request, $id)
    {
        $type = $request->input('type');
        
        // バリデーション（共通部分）
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // 更新対象のモデルを取得して保存
        switch ($type) {
            case 'building':
                Building::findOrFail($id)->update(['name' => $request->name]);
                break;
            case 'facility':
                Facility::findOrFail($id)->update([
                    'name' => $request->name,
                    'building_id' => $request->building_id
                ]);
                break;
            case 'slot':
                FacilitySlot::findOrFail($id)->update([
                    'name' => $request->name,
                    'facility_id' => $request->facility_id
                ]);
                break;
            case 'equipment':
                Equipment::findOrFail($id)->update([
                    'name' => $request->name,
                    'facility_id' => $request->facility_id,
                    'purpose_id' => $request->purpose_id,
                ]);
                break;
            case 'purpose':
                Purpose::findOrFail($id)->update(['name' => $request->name]);
                break;
        }

        return redirect()->route('administrator.master.index') // または一覧へ
            ->with('message', '更新が完了しました');
    }
}