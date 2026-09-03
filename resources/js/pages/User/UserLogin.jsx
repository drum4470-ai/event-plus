import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { csrfApi } from '@/api';

export default function UserLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();

        setProcessing(true);
        setError('');

        try {
            await csrfApi.get('/sanctum/csrf-cookie');

            await api.post('/user/login', {
                email,
                password,
            });

            navigate('/dashboard');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'ログインに失敗しました'
            );
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
                    <Link to="/user-registration" className="text-sm text-blue-600 hover:underline">
                        新規登録はこちら
                    </Link>

                <div className="mb-4">
                </div>
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    ログイン
                </h1>

                <form onSubmit={submit} className="space-y-6">

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="メールアドレスを入力"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="パスワードを入力"
                    />

                    {error && (
                        <p className="text-red-600 text-sm">
                            {error}
                        </p>
                    )}

                    <div className="text-right mt-2">
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                            パスワードを忘れてしまった場合
                        </Link>
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2 bg-indigo-600 text-white rounded"
                    >
                        {processing ? 'ログイン中...' : 'ログイン'}
                    </button>

                </form>
            </div>
        </div>
    );
}