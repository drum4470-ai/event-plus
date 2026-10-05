<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Application;

class DashboardController extends Controller
{
    /**
     * ダッシュボードに必要なデータを JSON で返却する
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // A. 権限によるベースの絞り込み（一般ユーザーは自分の申請のみ、スタッフ等は全体）
        $baseQuery = Application::query();
        if (!in_array($user->role, ['staff', 'manager', 'administrator'])) {
            $baseQuery->where('user_id', $user->id ?? $user->user_id);
        }


        $query = (clone $baseQuery)->with([
            'facilities.buildings', // 施設と建物
            'purposes',             // 利用目的
            'facilitySlots.slots',  // 時間枠
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {

       
            $columns = ['event_name', 'application_id', 'user_id', 'building_id', 'facility_id', 'facility_slot_id', 'purpose_id', 'address', 'telephone', 'usage_date'];
            foreach ($columns as $index => $column) {
                if ($index === 0) {
                    $q->where($column, 'like', "%{$keyword}%");
                } else {
                    $q->orWhere($column, 'like', "%{$keyword}%");
                }
        }

        // 2. リレーション先（施設名）も「または（OR）」で検索対象に追加
        $q->orWhereHas('facilities.buildings', function ($subQuery) use ($keyword) {
            $subQuery->where('name', 'like', "%{$keyword}%"); 
        });
        $q->orWhereHas('facilities', function ($subQuery) use ($keyword) {
            $subQuery->where('name', 'like', "%{$keyword}%"); 
        });
        $q->orWhereHas('purposes', function ($subQuery) use ($keyword) {
            $subQuery->where('name', 'like', "%{$keyword}%"); 
        });
        $q->orWhereHas('equipments', function ($subQuery) use ($keyword) {
            $subQuery->where('name', 'like', "%{$keyword}%"); 
        });
        $q->orWhereHas('users', function ($subQuery) use ($keyword) {
            $subQuery->where('name', 'like', "%{$keyword}%"); 
        });
     
    });
}

        // 絞り込み後の申請一覧
        $applications = $query->latest()->get();

        // C. サマリー（カード用件数）の集計：検索条件に関わらず常に全体の件数を出す
        $statusCounts = $baseQuery
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $summary = [
            'new'            => $statusCounts->get('新規申請', 0),
            'revision'       => $statusCounts->get('要修正', 0),
            'staff_check'    => $statusCounts->get('担当確認', 0),
            'internal_check' => $statusCounts->get('社内確認', 0),
            'processing'     => $statusCounts->get('申請手続き', 0),
            'submitted'      => $statusCounts->get('申請済み', 0),
            'history'        => $statusCounts->get('過去の申請', 0),
            'total'          => $baseQuery->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $applications,
            'summary' => $summary,
        ]);
    }
}