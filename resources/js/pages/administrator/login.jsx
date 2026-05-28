import React from 'react';
import { useForm, Head } from '@inertiajs/react';

export default function Login() {
    // フォームの状態管理
    const { data, setData, post, processing, errors } = useForm({
        password: '',
    });

    // 送信処理
    const submit = (e) => {
        e.preventDefault();
        post('/administrator/login'); // AuthControllerのloginメソッドへ
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Head title="管理者ログイン" />

            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">管理者ログイン</h1>
                
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            パスワード
                        </label>
                        <input
                            type="password"
                            value={data.password} // setDataで更新された値を反映させる
                            onChange={(e) => setData('password', e.target.value)}
                            // 💡 スタイルのドット部分を補完し、エラーがある時は枠線を赤くする工夫を追加しました
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            autoComplete="current-password"
                            placeholder="管理者パスワードを入力"
                        />
                        
                        {/* 💡 ここを追加！Laravelから「パスワードが違います」などが返ってきたら赤文字で表示します */}
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition duration-150 ease-in-out"
                    >
                        {processing ? 'ログイン中...' : 'ログイン'}
                    </button>
                </form>
            </div>
        </div>
    );
}