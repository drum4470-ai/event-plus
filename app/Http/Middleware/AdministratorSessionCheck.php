<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdministratorSessionCheck
{
    public function handle(Request $request, Closure $next)
    {
        // ログインルートは通す
        if ($request->is('administrator/login*')) {
            return $next($request);
        }

        // API通信の場合：JSONで401エラーを返す
        if (!Auth::guard('admin')->check()) {
            return response()->json([
                'message' => 'ログインセッションが切れています。再度ログインしてください。'
            ], 401);
        }

        return $next($request);
    }
}