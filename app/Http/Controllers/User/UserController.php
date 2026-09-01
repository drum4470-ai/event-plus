<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\AccountResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * 1. 自分の情報取得（マイページ用）
     */
    public function show(Request $request)
    {
        // ログイン中のユーザー情報を返す
        return new AccountResource($request->user());
    }

    /**
     * 2. ユーザー登録（新規サインアップ ※誰でもアクセス可能）
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:320', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:4096'],
            'telephone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],

        ]);
        $validated['role'] = 'user';

        // 必要に応じてデフォルトの権限を付与
        // $validated['role'] = 'user';

        $user = User::create($validated);

        return new AccountResource($user);
    }

    /**
     * 3. 自分の情報更新
     */
    public function update(Request $request)
    {
        /** @var User $user */
        $user = $request->user(); // ログイン中のユーザーを取得

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:320',
                // 自分自身のメールアドレス重複エラーを防ぐため、主キー（user_id等）を除外
                'unique:users,email,' . $user->user_id . ',user_id',
            ],
            'telephone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
        ]);

        $user->update($validated);

        return new AccountResource($user->fresh());
    }

    /**
     * 4. 自分のパスワード変更
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            // 必要であれば現在のパスワード確認（current_password）を入れるとより安全です
            'password' => ['required', 'string', 'min:8', 'max:4096'],
        ]);

        /** @var User $user */
        $user = $request->user();

        $user->update([
            'password' => $validated['password'], // モデル側でハッシュ化ミドルウェア等がある前提
        ]);

        return response()->json([
            'message' => 'パスワードを変更しました。',
        ]);
    }
}