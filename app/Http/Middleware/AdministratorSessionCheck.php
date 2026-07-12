<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdministratorSessionCheck
{
    public function handle(Request $request, Closure $next)
    {
        // 1. ログインルートは通す
        if ($request->is(['api/administrator/login*', 'administrator/login*'])) {
            return $next($request);
        }

        // 2. 指定したガード（admin）でログインチェックを行う
        // ※ 'admin' というガード名は config/auth.php の設定と一致させる必要があります
        if (!Auth::guard('admin')->check()) {
            return response()->json([
                'message' => '認証されていません'
            ], 401);
        }

        return $next($request);
    }
}