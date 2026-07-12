import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axiosをインポート
import api from '@/api';

export default function Login() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError('');

        try {
            // 1. CSRFトークンの取得 (axiosを直接使うのが確実)
            // baseURLが設定されていないaxiosを使うことで、正しいURLへリクエストします
            await api.get('http://event-plus.test/sanctum/csrf-cookie', {
                withCredentials: true,
            });

            // 2. ログインAPIの実行 (ここでは api インスタンスを使う)
            await api.post('/administrator/login');

            // 3. 成功したら遷移
            navigate('/administrator/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'ログインに失敗しました');
        } finally {
            setProcessing(false);
        }
    };

    // ...以下レンダリング部分は変更なし


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">管理者ログイン</h1>
                <form onSubmit={submit} className="space-y-6">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="パスワードを入力"
                    />
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    <button type="submit" disabled={processing} className="w-full py-2 bg-indigo-600 text-white rounded">
                        {processing ? 'ログイン中...' : 'ログイン'}
                    </button>
                </form>
            </div>
        </div>
    );
}