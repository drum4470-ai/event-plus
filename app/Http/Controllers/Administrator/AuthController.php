<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;


class AuthController extends Controller
{
    /**
     * A1: 管理者ログイン画面を表示する
     */
    public function showLoginForm(Request $request)
    {
        return Inertia::render('administrator/login');
    }

    /**
     * ログイン処理（送信ボタンを押した時）
     */
    public function login(Request $request)
    {
        // 1. バリデーション
        $request->validate([
            // 'password' => ['required'],
            //開発中はパスワードなしでアクセスできるようにするため、nullable にしています
            'password' => ['nullable'],
        ]);

        // 2. 認証処理
        if ($request->password === 'your-admin-password' || empty($request->password)) {
        
        // ★最重要：自作ミドルウェアがチェックしている「印」をセッションに刻む
        session(['is_admin' => true]); 

        $request->session()->regenerate();

        // ダッシュボードへリダイレクト
        // intended を使っても良いですが、確実に飛ばすなら route 指定が安全です
        return redirect()->route('administrator.dashboard');
    }

        // 3. 失敗時
        return back()->withErrors([
            'password' => 'パスワードが正しくありません。',
        ]);
    }
}