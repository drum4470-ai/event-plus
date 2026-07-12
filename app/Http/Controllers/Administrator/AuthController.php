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
        $user = \App\Models\User::first() ?? new \App\Models\User([
            'email' => 'admin@event-plus.test',
        ]);

        Auth::guard('admin')->login($user);
        $request->session()->regenerate();

        return response()->json(['message' => 'ログインしました'], 200);
    }

    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'ログアウトしました'], 200);
    }
}