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
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

    // 認証を試みる前に、ユーザーが存在するかすら確認する
    $user = User::where('email', $request->email)
    ->where('role', 'administrator')
    ->first();

    if (!$user) {
        return response()->json([
            'message' => '管理者アカウントと一致しませんでした'
        ], 404);
    }

    // 認証失敗
    if (!Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'パスワードが一致しません'
        ], 401);
    }

    Auth::guard('admin')->login($user);

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