<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * ダッシュボードに必要なデータを JSON で返却する
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // ログインユーザーの申請ステータスごとの件数を集計
        $statusCounts = $user->applications()
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        // 各ステータスの件数を取り出す（存在しない場合は0件）
        $summary = [
            'new'         => $statusCounts->get('新規申請', 0),
            'revision'    => $statusCounts->get('要修正', 0),
            'staff_check' => $statusCounts->get('担当確認', 0),
            'internal_check' => $statusCounts->get('社内確認', 0),
            'processing'  => $statusCounts->get('申請手続き', 0),
            'submitted'   => $statusCounts->get('申請済み', 0),
            'history'     => $statusCounts->get('過去の申請', 0),
            'total'       => $user->applications()->count(),
        ];

        $data = [
            'title' => 'ダッシュボード',
            'status' => 'success',
            'summary' => $summary,
        ];

        return response()->json($data, 200);
    }
}