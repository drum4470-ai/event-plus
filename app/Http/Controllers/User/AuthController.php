<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;


class AuthController extends Controller
{

    public function showLoginForm(Request $request)
    {
        return Inertia::render('administrator/login');
    }


    public function login(Request $request)
    {
        $request->validate([
            'password' => ['nullable'],
        ]);

  
       if ($request->password === 'password') { // 実際は env('ADMIN_PASSWORD') などで管理してください
        // セッションに保存
        $request->session()->put('is_admin', true);
        $request->session()->regenerate();

        // ログイン成功時はダッシュボードへ
        return redirect()->intended(route('administrator.dashboard'));
        }

        return back()->withErrors([
            'password' => 'パスワードが正しくありません。',
        ]);
    }
}