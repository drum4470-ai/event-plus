<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserSessionCheck
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->is(['api/user/login*', 'user/login*'])) {
            return $next($request);
        }

        // 2. 指定したガード（user）でログインチェックを行う
        // ※ 'user' というガード名は config/auth.php の設定と一致させる必要があります
        if (!Auth::guard('user')->check()) {
            return response()->json([
                'message' => '認証されていません'
            ], 401);
        }

        return $next($request);
    }
}