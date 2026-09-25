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
            'new' => $statusCounts->get('新規', 0),
            'tanto_check' => $statusCounts->get('担当確認', 0),
            'shana_check' => $statusCounts->get('社内確認', 0),
            'approved' => $statusCounts->get('申請許可', 0),
            'total' => $user->applications()->count(), // 総申請数
        ];

        $data = [
            'title' => 'ダッシュボード',
            'status' => 'success',
            'summary' => $summary,
        ];

        return response()->json($data, 200);
    }
}