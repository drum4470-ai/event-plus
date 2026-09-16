import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { csrfApi } from '@/api';

export default function ResetPassword() {

    // URLからトークン取得
    // /reset-password/test-token
    const { token } = useParams();

    // URLからメールアドレス取得
    // /reset-password/test-token?email=test@example.com
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || '';

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [processing, setProcessing] = useState(false);

    const navigate = useNavigate();
    console.log('token:', token);

    console.log('email:', email);

    const submit = async (e) => {
        e.preventDefault();

        setProcessing(true);
        setError('');
        setMessage('');

        try {
            await csrfApi.get('/sanctum/csrf-cookie');

            await csrfApi.post('/api/reset-password', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            setMessage('パスワードを変更しました。10秒後にログイン画面に戻ります。');

            setTimeout(() => {
                navigate('/login');
            }, 10000);
            // 設定時間は5000でも大丈夫です。10秒にしているのは、ユーザーがメッセージを読めるようにするためです。ギミックとしてポップアップメッセージを表示するのも良いかもしれません。

        } catch (err) {
            console.log('status:', err.response?.status);
            console.log('data:', err.response?.data);

            setError(
                err.response?.data?.message ||
                'パスワード再設定に失敗しました'
            );

        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    パスワード再設定
                </h1>
                {message && <div className="mb-4 rounded bg-green-100 p-3 text-green-700">{message}</div>}

                <form onSubmit={submit} className="space-y-6">

                    <input
                        type="email"
                        value={email}
                        readOnly
                        autoComplete="username"
                        placeholder="メールアドレス"
                        className="w-full px-3 py-2 border rounded-md bg-gray-100"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="新しいパスワード"
                        autoComplete="new-password"
                        className="w-full px-3 py-2 border rounded-md"
                    />

                    <input
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) =>
                            setPasswordConfirmation(e.target.value)
                        }
                        placeholder="新しいパスワード（確認）"
                        autoComplete="new-password"
                        className="w-full px-3 py-2 border rounded-md"
                    />

                    {error && (
                        <p className="text-red-600 text-sm">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="text-green-600 text-sm">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2 bg-indigo-600 text-white rounded"
                    >
                        {processing
                            ? '変更中...'
                            : 'パスワードを変更する'}
                    </button>

                </form>
            </div>
        </div>
    );
}

