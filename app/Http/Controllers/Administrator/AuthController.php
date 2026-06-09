<?php
namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    
    public function showLoginForm()
    {
        return Inertia::render('Administrator/Login');
    }

    public function login(Request $request)
    {
     $request->validate([
            'password' => ['nullable'],
        ]);
        if ($request->password === 'your-admin-password' || empty($request->password)) {
        
       session(['is_admin' => true]); 

        $request->session()->regenerate();

        return redirect()->route('administrator.dashboard');
    }

        return back()->withErrors([
            'password' => 'パスワードが正しくありません。',
        ]);
    }

    public function logout(Request $request)
    {
        $request->session()->forget('is_admin');
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('administrator.login'); // ログイン画面へ
    }

}