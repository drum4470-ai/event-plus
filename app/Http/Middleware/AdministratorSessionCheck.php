<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdministratorSessionCheck
{

    public function handle(Request $request, Closure $next)
    {
        // ログインページへのアクセスなら、チェックせずに通す（これでループしない）
        if ($request->is('administrator/login*')) {
            return $next($request);
        }

        // セッションがあるかチェック
        if (!session()->has('is_admin')) {
            return redirect()->route('administrator.login');
        }

        return $next($request);
    }
}