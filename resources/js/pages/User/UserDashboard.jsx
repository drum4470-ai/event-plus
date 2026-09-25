import { useState, useEffect } from 'react';
import UserDrawer from '@/Components/UserDrawer';
import api, { csrfApi } from '@/api';

export default function UserDashboard() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [applications, setApplications] = useState([]); // 初期値を空配列に
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                await csrfApi.get('/sanctum/csrf-cookie');
                
                const [dashboardRes, appsRes] = await Promise.all([
                    api.get('/user/dashboard'),
                    api.get('/user/applications')
                ]);

                setSummary(dashboardRes.data.summary || {});
                
                // Laravel Resourceの返却構造（dataプロパティ）を考慮
                const fetchedApps = appsRes.data.data ?? appsRes.data;
                setApplications(Array.isArray(fetchedApps) ? fetchedApps : []);

            } catch (err) {
                console.error('ダッシュボードデータの取得エラー:', err);
                setError('データの取得に失敗しました。');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
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
                
                {error && <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>}

                {/* ★ 進行状況のサマリーカード */}
                <div className="mb-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-800">申請の進行状況</h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">新規</p>
                            <p className="text-2xl font-bold text-blue-600">{summary.new} <span className="text-sm font-normal text-gray-500">件</span></p>
                        </div>
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">担当確認</p>
                            <p className="text-2xl font-bold text-yellow-600">{summary.tanto_check} <span className="text-sm font-normal text-gray-500">件</span></p>
                        </div>
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">社内確認</p>
                            <p className="text-2xl font-bold text-purple-600">{summary.shana_check} <span className="text-sm font-normal text-gray-500">件</span></p>
                        </div>
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">申請許可</p>
                            <p className="text-2xl font-bold text-green-600">{summary.approved} <span className="text-sm font-normal text-gray-500">件</span></p>
                        </div>
                    </div>
                </div>

                {/* マイ申請一覧 */}
                <h2 className="mb-4 text-xl font-bold text-gray-800">マイ申請一覧</h2>
                {applications.length === 0 ? (
                    <p className="text-gray-500">まだ申請履歴はありません。</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {applications.map((data) => (
                            <div 
                                key={data.application_id} 
                                className="rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-blue-600">
                                        {data.event_name || 'イベント名未設定'}
                                    </span>
                                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                        {data.status ?? '新規'}
                                    </span>
                                </div>

                                <div className="space-y-1 text-sm text-gray-600">
                                    <p><strong className="text-gray-700">建物:</strong> {data.facilities?.buildings?.name ?? '未指定'}</p>
                                    <p><strong className="text-gray-700">施設:</strong> {data.facilities?.name ?? '未指定'}</p>
                                    <p><strong className="text-gray-700">利用目的:</strong> {data.purposes?.name ?? '未指定'}</p>
                                    <p><strong className="text-gray-700">利用日:</strong> {data.usage_date}</p>
                                    <p><strong className="text-gray-700">時間枠:</strong> {data.facility_slots?.slots?.name ?? '未指定'}</p>
                                    {/* <p><strong className="text-gray-700">連絡先:</strong> {data.telephone}</p> */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <UserDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
            />
        </div>
    );
}