<?php

namespace App\Http\Controllers\Administrator;

use App\Http\Controllers\Controller;
use App\Http\Resources\AccountResource;
use App\Models\User;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    /**
     * ユーザー一覧
     */
    public function index()
    {
        $accounts = User::orderBy('user_id', 'desc')->get();

        return AccountResource::collection($accounts);
    }


    /**
     * ユーザー登録
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:320', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8','max:4096'],
            'telephone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:13'],
        ]);

        $account = User::create($validated);

        return new AccountResource($account);
    }



    /**
     * ユーザー更新
     */
    public function update(Request $request, User $account)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:320',
                'unique:users,email,' . $account->user_id . ',user_id',
            ],
            // 'password' => ['nullable', 'string', 'min:8', 'max:4096'],
            'telephone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:13'],
        ]);

        $account->update($validated);

        return new AccountResource($account->fresh());
    }


    /**
     * パスワード変更
     */
    public function updatePassword(Request $request, User $account)
    {
        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8', 'max:4096'],
        ]);

        $account->update([
            'password' => $validated['password'],
        ]);

        return response()->json([
            'message' => 'パスワードを変更しました。',
        ]);
    }


    /**
     * ユーザー削除
     */
    public function destroy(User $account)
    {
        $account->delete();

        return response()->json([
            'message' => 'ユーザーを削除しました。',
        ]);
    }
}