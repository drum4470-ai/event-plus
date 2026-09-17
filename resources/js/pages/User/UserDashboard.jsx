import { useState, useEffect } from 'react';
import UserDrawer from '@/Components/UserDrawer';
import api, { csrfApi } from '@/api'; // ★ api と csrfApi のインポートを追加

export default function UserDashboard() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                await csrfApi.get('/sanctum/csrf-cookie');
                const response = await api.get('/user/applications');
                setApplications(response.data.data);
            } catch (err) {
                console.error('申請一覧の取得エラー:', err);
                setError('申請情報の取得に失敗しました。');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) return <div className="p-6 text-center">読み込み中...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー */}
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="font-bold text-xl">ダッシュボード</h1>
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                    メニューを開く
                </button>
            </header>

            {/* メインコンテンツ */}
            <main className="p-6 max-w-5xl mx-auto">
                <h2 className="mb-6 text-2xl font-bold">マイ申請一覧</h2>

                {error && <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>}

                {applications.length === 0 ? (
                    <p className="text-gray-500">まだ申請履歴はありません。</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {applications.map((app) => (
                            <div 
                                key={app.application_id} 
                                className="rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-blue-600">
                                        {app.event_name || 'イベント名未設定'}
                                    </span>
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {app.status ?? '審査中'}
                                    </span>
                                </div>

                                <div className="space-y-1 text-sm text-gray-600">
                                    <p><strong className="text-gray-700">施設:</strong> {app.facilities?.facility_name ?? '未指定'}</p>
                                    <p><strong className="text-gray-700">利用目的:</strong> {app.purposes?.purpose_name ?? '未指定'}</p>
                                    <p><strong className="text-gray-700">利用日:</strong> {app.usage_date}</p>
                                    <p><strong className="text-gray-700">連絡先:</strong> {app.telephone}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* ドロワーメニュー */}
            <UserDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
            />
        </div>
    );
}