<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Facility;
use App\Models\Purpose;
use App\Models\Equipment;
use App\Models\FacilityPurpose;
use App\Models\FacilityPurposeEquipment;

class RelationManagementController extends Controller
{
    public function index()
    {
        // 紐付け画面に必要なマスターデータと、既存の紐付け設定を取得
        return Inertia::render('Administrator/RelationManagement', [
            'facilities' => Facility::all(),
            'purposes'   => Purpose::all(),
            'equipments' => Equipment::all(),
            
            // 現在の設定状況（React側での初期表示用）
            'facilityPurposes' => FacilityPurpose::with(['equipments'])->get(),
        ]);
    }

    /**
     * 施設と目的の紐付けを更新（または作成）
     */
    public function updateFacilityPurpose(Request $request)
    {
        $validated = $request->validate([
            'facility_id' => 'required|exists:facilities,facility_id',
            'purpose_id'  => 'required|exists:purposes,purpose_id',
            'enabled'     => 'required|boolean',
        ]);

        if ($validated['enabled']) {
            // 紐付け作成（重複しないようにfirstOrCreate）
            FacilityPurpose::firstOrCreate([
                'facility_id' => $validated['facility_id'],
                'purpose_id'  => $validated['purpose_id'],
            ]);
        } else {
            // 紐付け解除
            FacilityPurpose::where('facility_id', $validated['facility_id'])
                ->where('purpose_id', $validated['purpose_id'])
                ->delete();
        }

        return redirect()->back()->with('message', '設定を更新しました');
    }

    /**
     * 施設×目的のペアに対して、使用可能な設備を更新
     */
    public function updateEquipment(Request $request)
    {
        $validated = $request->validate([
            'facility_purpose_id' => 'required|exists:facility_purposes,id',
            'equipment_ids'       => 'array',
            'equipment_ids.*'     => 'exists:equipments,equipment_id',
        ]);

        // 一旦そのペアの設備設定を全削除して、送られてきたIDで再登録する（同期処理）
        FacilityPurposeEquipment::where('facility_purpose_id', $validated['facility_purpose_id'])->delete();

        foreach ($validated['equipment_ids'] as $eqId) {
            FacilityPurposeEquipment::create([
                'facility_purpose_id' => $validated['facility_purpose_id'],
                'equipment_id'        => $eqId,
            ]);
        }

        return redirect()->back();
    }
}