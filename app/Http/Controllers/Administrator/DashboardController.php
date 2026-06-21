<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * ダッシュボードに必要なデータを JSON で返却する
     */
    public function index(Request $request)
    {
        // 必要な統計データや情報を配列で取得
        $data = [
            'title' => 'ダッシュボード',
            'status' => 'success',
            'message' => '管理者向け情報を取得しました',
            // 実際にはここに統計データなどを入れる
            // 'stats' => Building::count(), 
        ];

        return response()->json($data, 200);
    }
}