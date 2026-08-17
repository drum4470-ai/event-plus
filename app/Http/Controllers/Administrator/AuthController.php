<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // showLoginForm は React Router がフロントで制御するため削除してOKです

    public function login(Request $request)
    {
        $request->validate([
        'password' => ['required'],
    ]);

    // 認証を試みる前に、ユーザーが存在するかすら確認する
    $user = User::first();

    if (!$user) {
        return response()->json([
            'message' => '管理者が存在しません'
        ], 404);
    }

    // 認証失敗
    if (!Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'パスワードが違います'
        ], 401);
    }

    Auth::guard('web')->login($user);
    $request->session()->regenerate();
    return response()->json([
        'message' => 'ログイン成功'
    ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'ログアウトしました'], 200);
    }
}