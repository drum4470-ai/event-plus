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

  
        if ($request->password === 'your-admin-password' || empty($request->password)) {
        
       session(['is_admin' => true]); 

        $request->session()->regenerate();

        return redirect()->route('administrator.dashboard');
    }

        return back()->withErrors([
            'password' => 'パスワードが正しくありません。',
        ]);
    }
}