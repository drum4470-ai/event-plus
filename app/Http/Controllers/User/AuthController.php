<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * ログイン画面を表示
     */
    public function create()
    {
        return Inertia::render('administrator/login'); 
        // resources/js/Pages/administrator/login.jsx を呼び出す
    }
}