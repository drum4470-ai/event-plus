<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // ★追加：Authファサード

class AuthController extends Controller
{
    // showLoginForm は React Router がフロントで制御するため削除してOKです

    public function login(Request $request)
    {
        $credentials = $request->validate(['']);

        // Guard名は config/auth.php の guards 設定に合わせてください
        if (Auth::guard('admin')->attempt($credentials)) {
            $request->session()->regenerate();
            return response()->json(['message' => 'ログイン成功'], 200);
        }

        return response()->json(['message' => 'パスワードが正しくありません'], 401);
    }

    public function logout(Request $request)
    {
        Auth::guard('admin')->logout(); // ★推奨：ガードのログアウトメソッドを呼び出す

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'ログアウトしました'], 200);
    }
}