<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia; 

class AccountController extends Controller
{
    // 一覧表示
    public function index()
    {
        return Inertia::render('administrator/account-registration', [
            'users' => User::all(), // ユーザー一覧を渡す
            'roles' => [
                ['id' => 1, 'name' => '利用者'], 
                ['id' => 2, 'name' => '担当者'],
                ['id' => 3, 'name' => '承認者'],
                ['id' => 4, 'name' => '管理者'],

                ]
        ]);
    }

    // 登録画面
    public function create()
    {
        return Inertia::render('administrator/account-registration/create', [
            'roles' => [
                ['id' => 1, 'name' => '利用者'], 
                ['id' => 2, 'name' => '担当者'],
                ['id' => 3, 'name' => '承認者'],
                ['id' => 4, 'name' => '管理者'],
            ]
        ]);
    }

    // 登録処理
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role_id' => 'required|integer', // role_id を必須に
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role_id' => $validated['role_id'],
        ]);

        return redirect()->route('administrator.account-registration.index')
                         ->with('message', 'アカウントを登録しました');
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        return Inertia::render('administrator/account-edit', [
            'user' => $user,
            'roles' => [
                ['id' => 1, 'name' => '利用者'], 
                ['id' => 2, 'name' => '担当者'],
                ['id' => 3, 'name' => '承認者'],
                ['id' => 4, 'name' => '管理者'],
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->user_id . ',user_id',
            'password' => 'nullable|string|min:8|confirmed',
            'role_id' => 'required|integer', // role_id を必須に
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
        }
        $user->role_id = $validated['role_id'];
        $user->save();

        return redirect()->route('administrator.account-registration.index')
                         ->with('message', 'アカウントを更新しました');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route('administrator.account-registration.index')
                         ->with('message', 'アカウントを削除しました');
    }
}