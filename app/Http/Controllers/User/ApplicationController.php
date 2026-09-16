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

        $application = $user->applications()
            ->with(['buildings', 'facilities', 'purposes', 'equipments', 'slots', 'applicationComments'])
            ->get();

        return ApplicationResource::collection($application);
    }

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