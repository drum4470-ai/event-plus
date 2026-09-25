<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ApplicationResource;

class ApplicationController extends Controller
{
    public function index(Request $request)
{
    $user = $request->user();

    // with() を使って関連するデータを一緒に取得する
    $application = $user->applications()
        ->with(['facilities.buildings', 
                'purposes', 
                'facilitySlots.slots', 
                // 'equipments', indexの軽量化
                // 'applicationComments'
                ])
        ->get();

    return ApplicationResource::collection($application);
}

    public function show($id): JsonResponse
    {
        // N+1問題を防ぐために with() で関連モデルを一括取得
        $application = Application::with([
            'building',            // 建物
            'facility',          // 施設
            'purpose',           // 目的
            'slot',              // スロット
            'user',              // 申請者
            'staff',             // 担当者
            'manager',           // 管理者
            'equipments',        // 紐づく備品
            'applicationComments' // コメント一覧
        ])->findOrFail($id);

    public function store(Request $request)
    {
        $request->validate([
            'facility_id' => 'required',
            'purpose_id' => 'required',
            'usage_date' => 'required|date',
        ]);

        // トランザクションの戻り値を変数に代入する
        $application = DB::transaction(function () use ($request) {

            $app = Application::create([
                'user_id' => $request->user()->user_id,
                'facility_id' => $request->facility_id,
                'facility_slot_id' => $request->facility_slot_id,
                'purpose_id' => $request->purpose_id,
                'event_name' => $request->event_name,
                'usage_date' => $request->usage_date,
                'address' => $request->address,
                'telephone' => $request->telephone,
                'status' => '新規',
            ]);

            if (!empty($request->equipment_ids)) {
                $app->equipments()->attach($request->equipment_ids);
            }

            if ($request->comment) {
                $app->applicationComments()->create([
                    'comment' => $request->comment,
                ]);
            }

            return $app; // 作成したインスタンスを返す
        });

        return new ApplicationResource($application);
    }

    public function update(Request $request, $id)
    {
        $application = $request->user()
            ->applications()
            ->findOrFail($id);

        $request->validate([
            'facility_id' => 'required',
            'purpose_id' => 'required',
            'usage_date' => 'required|date',
        ]);

        $updatedApplication = DB::transaction(function () use ($request, $application) {

            $application->update([
                'facility_id' => $request->facility_id,
                'facility_slot_id' => $request->facility_slot_id,
                'purpose_id' => $request->purpose_id,
                'event_name' => $request->event_name,
                'usage_date' => $request->usage_date,
                'address' => $request->address,
                'telephone' => $request->telephone,
            ]);

            // equipment_ids が空や未定義の場合に備えて空配列をフォールバックする
            $application->equipments()->sync($request->equipment_ids ?? []);

            if ($request->comment) {
                $application->applicationComments()->create([
                    'comment' => $request->comment,
                ]);
            }

            return $application;
        });

        return new ApplicationResource($updatedApplication);
    }

    public function destroy(Request $request, $id)
    {
        $application = $request->user()
            ->applications()
            ->findOrFail($id);

        $application->delete();

        return new ApplicationResource($application);
    }
}