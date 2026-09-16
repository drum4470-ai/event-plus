import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api'; // パスはプロジェクトに合わせて調整

export default function ForgotPassword() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            // 先ほど設定したAPIエンドポイントへPOST
            await api.post('/forgot-password', { name, email });
            setMessage('パスワード再設定用のメールを送信しました。10秒後にログイン画面に戻ります。');

            setTimeout(() => {
                navigate('/login');
            }, 10000);
        } catch (err) {
            setError(err.response?.data?.message || '送信に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md rounded-lg border bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold text-center">パスワード再設定</h2>

            {message && <div className="mb-4 rounded bg-green-100 p-3 text-green-700">{message}</div>}
            {error && <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="mb-1 block font-medium">お名前</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded border p-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="mb-1 block font-medium">メールアドレス</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded border p-2"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? '送信中...' : '再設定メールを送信'}
                </button>
            </form>
        </div>
    );
}