<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class ForgotPasswordController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'name' => ['required', 'string'], // 必要であれば名前もバリデーション
        ]);

        // 名前とメールアドレスが一致するユーザーが存在するか確認
        $user = User::where('email', $request->email)
                    ->where('name', $request->name)
                    ->first();

        if (!$user) {
            // セキュリティ上、存在しない場合も「送信しました」と返すのが一般的ですが、
            // 要件に合わせてエラーを返してもOKです
            return response()->json([
                'message' => '一致するユーザーが見つかりませんでした。',
            ], 422);
        }

        // Laravel標準のパスワードリセットトークン生成＆メール送信
        // （標準の Password::broker()->sendResetLink(...) を利用）
        $status = Password::broker()->sendResetLink(
            $request->only('email')
        );
        if ($status !==Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => __($status),
            ], 422);
        }

        return response()->json([
            'message' => 'パスワード再設定用のメールを送信しました。',
        ]);
    }
    
    
}