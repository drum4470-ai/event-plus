<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\ApplicationResource;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Application::with([
            'facilities.buildings', 
            'purposes', 
            'facilitySlots.slots', 
            'users', 
        ]);

        $isAdminOrStaff = in_array($user->role, ['administrator', 'manager', 'staff']);

        if (!$isAdminOrStaff) {
            $query->where('user_id', $user->user_id);
        }

        $applications = $query->latest()->get();

        return ApplicationResource::collection($applications);
    }

    public function show(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        
        $query = Application::with([
            'facilities.buildings', 
            'purposes', 
            'facilitySlots.slots', 
            'equipments', 
            'applicationComments.users',
            'users',
        ]);

        $isAdminOrStaff = in_array($user->role, ['administrator', 'manager', 'staff']);

        if (!$isAdminOrStaff) {
            $query->where('user_id', $user->user_id);
        }

        $application = $query->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => new ApplicationResource($application),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'facility_id' => 'required',
            'purpose_id' => 'required',
            'usage_date' => 'required|date',
        ]);

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
                'status' => '新規申請',
            ]);

            $equipmentIds = $request->equipment_id ?? $request->equipment_ids;
            if (!empty($equipmentIds)) {
                $app->equipments()->attach($equipmentIds);
            }

            if ($request->filled('body')) {
                $app->applicationComments()->create([
                    'user_id' => $request->user()->user_id,
                    'body' => $request->body,
                ]);
            }

            return $app;
        });

        return new ApplicationResource($application);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $query = Application::query();

        $isAdminOrStaff = in_array($user->role, ['administrator', 'manager', 'staff']);

        if (!$isAdminOrStaff) {
            $query->where('user_id', $user->user_id);
        }

        $application = $query->findOrFail($id);

        $request->validate([
            'facility_id' => 'required',
            'purpose_id' => 'required',
            'usage_date' => 'required|date',
            'status' => 'sometimes|string',
        ]);

        // ステータス変更がある場合のバリデーション（ワークフロー制限）
        if ($request->has('status')) {
            $currentStatus = $application->status;
            $newStatus = $request->status;

            if ($newStatus && $newStatus !== $currentStatus) {
                $allowedTransitions = [];

                // ロール別の許可ルール
                if ($user->role === 'user') {
                    $allowedTransitions = [
                        // '新規申請' => ['新規申請'],
                        '要修正' => ['担当確認'],
                        '担当確認' => ['要修正'],
                    ];
                } elseif ($user->role === 'staff') {
                    $allowedTransitions = [
                        '新規申請' => ['担当確認'],
                        '要修正' => ['担当確認'],
                        '担当確認' => ['要修正', '社内確認'],
                        '社内確認' => ['担当確認'],
                        '申請手続き' => ['申請済み'],
                        '申請済み' => ['申請手続き'],

                    ];
                } elseif ($user->role === 'manager') {
                    $allowedTransitions = [

                        '担当確認' => ['社内確認'],
                        '社内確認' => ['担当確認', '申請手続き'],
                    ];
                } elseif ($user->role === 'administrator') {
                    $allowedTransitions = [
                        '新規申請' => ['担当確認'],
                        '要修正' => ['担当確認'],
                        '担当確認' => ['要修正', '社内確認'],
                        '社内確認' => ['要修正', '担当確認', '申請手続き'],
                        '申請手続き' => ['要修正', '担当確認', '社内確認', '申請手続き', '申請済み'],
                        '申請済み' => ['申請手続き'],
                    ];
                } else {
                    return response()->json([
                        'message' => '不正なユーザーロールです。'
                    ], 403);
                }

                // 現在のステータスから変更先への遷移が許可されているかチェック
                if (!isset($allowedTransitions[$currentStatus]) || !in_array($newStatus, $allowedTransitions[$currentStatus])) {
                    return response()->json([
                        'message' => "ステータスを「{$currentStatus}」から「{$newStatus}」に変更する権限がないか、許可されていない遷移です。"
                    ], 422);
                }
            }
        }


        

        $updatedApplication = DB::transaction(function () use ($request, $application) {
            $updateData = [
                'facility_id' => $request->facility_id,
                'facility_slot_id' => $request->facility_slot_id,
                'purpose_id' => $request->purpose_id,
                'event_name' => $request->event_name,
                'usage_date' => $request->usage_date,
                'address' => $request->address,
                'telephone' => $request->telephone,
            ];

            if ($request->has('status')) {
                $updateData['status'] = $request->status;
            }

            $application->update($updateData);

            $equipmentIds = $request->equipment_id ?? $request->equipment_ids;
            $application->equipments()->sync($equipmentIds);

            if ($request->filled('body')) {
                $application->applicationComments()->create([
                    'user_id' => $request->user()->user_id,
                    'body' => $request->body,
                ]);
            }

            return $application;
        });

        return new ApplicationResource($updatedApplication);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $query = Application::query();

        $isAdminOrStaff = in_array($user->role, ['administrator', 'manager', 'staff']);

        if (!$isAdminOrStaff) {
            $query->where('user_id', $user->user_id);
        }

        $application = $query->findOrFail($id);

        $application->delete();

        return new ApplicationResource($application);
    }
}