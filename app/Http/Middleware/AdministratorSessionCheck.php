<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdministratorSessionCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    // app/Http/Middleware/AdminSessionCheck.php

 public function handle(Request $request, Closure $next): Response
    {
        // 1. デバッグ用：このミドルウェアが呼ばれているか確認したい場合は以下のコメントを外す
        // dd('Middleware triggered for: ' . $request->path());

        // 2. 現在のパスを確認し、ログイン画面自身へのアクセスの場合はチェックをスキップ（無限ループ防止）
        // routeIs() が不安定な場合に備え、パスの直接比較も追加
        if ($request->routeIs('administrator.login') || $request->is('administrator/login')) {
            return $next($request);
        }

        // 3. セッションチェック
        if (!session('is_admin')) {
            // route() 関数で確実にフルURLを生成してリダイレクト
            return redirect()->route('administrator.login');
        }

        return $next($request);
    }
}
