<?php

namespace App\Http\Controllers\User;

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

        $user = User::where('email', $request->email)
            ->whereIn('role', ['user', 'staff', 'manager', 'administrator']) // 管理者も含める場合は 'administrator' を追加
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'ユーザーが存在しません'
            ], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'メールアドレスまたはパスワードが違います'
            ], 401);
        }

        Auth::guard('user')->login($user);

        $request->session()->regenerate();

        return response()->json([
            'message' => 'ログイン成功'
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('user')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'ログアウトしました'
        ], 200);
    }
}