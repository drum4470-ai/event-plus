import { useState, useEffect } from "react";
import UserDrawer from "@/Components/UserDrawer";
import ApplicationDetailModal from "@/Components/ApplicationDetailModal";
import api, { csrfApi } from "@/api";

export default function UserDashboard() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [applications, setApplications] = useState([]);
    const [summary, setSummary] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedApplicationId, setSelectedApplicationId] = useState(null);

    // ★ 1. ダッシュボード全体（サマリーと申請一覧）を再取得する関数を外側に切り出す
    const fetchDashboardData = async () => {
        try {
            await csrfApi.get("/sanctum/csrf-cookie");

            const [dashboardRes, appsRes, profileRes] = await Promise.all([
                api.get("/user/dashboard"),
                api.get("/user/applications"),
                api.get("/user/profile"), // currentUserを取得するAPI呼び出しを追加
            ]);

            setSummary(dashboardRes.data.summary || {});
            setCurrentUser(profileRes.data.data ?? profileRes.data);

            const fetchedApps = appsRes.data.data ?? appsRes.data;
            setApplications(Array.isArray(fetchedApps) ? fetchedApps : []);
            setError(""); // エラーがあればクリア
        } catch (err) {
            console.error("ダッシュボードデータの取得エラー:", err);
            setError("データの取得に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    // ★ 2. 初回マウント時にデータを取得
    useEffect(() => {
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
                {error && (
                    <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
                        {error}
                    </div>
                )}

                {/* 進行状況のサマリーカード */}
                <div className="mb-8">
                    <h2 className="mb-4 text-xl font-bold text-gray-800">
                        申請の進行状況
                    </h2>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                新規申請
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                                {summary.new}{" "}
                                <span className="text-sm font-normal text-gray-500">
                                    件
                                </span>
                            </p>
                        </div>
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                要修正
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                                {summary.revision}{" "}
                                <span className="text-sm font-normal text-gray-500">
                                    件
                                </span>
                            </p>
                        </div>
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                担当確認中
                            </p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {summary.staff_check}{" "}
                                <span className="text-sm font-normal text-gray-500">
                                    件
                                </span>
                            </p>
                        </div>
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                社内確認中
                            </p>
                            <p className="text-2xl font-bold text-purple-600">
                                {summary.internal_check}{" "}
                                <span className="text-sm font-normal text-gray-500">
                                    件
                                </span>
                            </p>
                        </div>
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                申請手続き中
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                                {summary.processing}{" "}
                                <span className="text-sm font-normal text-gray-500">
                                    件
                                </span>
                            </p>
                        </div>
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                申請済み
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                                {summary.submitted}{" "}
                                <span className="text-sm font-normal text-gray-500">
                                    件
                                </span>
                            </p>
                        </div>
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">
                                過去の申請
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                                {summary.history}{" "}
                                <span className="text-sm font-normal text-gray-500">
                                    件
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* マイ申請一覧 */}
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                    マイ申請一覧
                </h2>
                {applications.length === 0 ? (
                    <p className="text-gray-500">まだ申請履歴はありません。</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {applications.map((data) => (
                            <div
                                key={data.application_id}
                                onClick={() => {
                                    console.log(
                                        "クリックしたapplication_id:",
                                        data.application_id,
                                    );
                                    console.log(
                                        "型:",
                                        typeof data.application_id,
                                    );

                                    setSelectedApplicationId(
                                        data.application_id,
                                    );
                                }}
                                className="rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md cursor-pointer hover:border-blue-300"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-blue-600">
                                        {data.event_name || "イベント名未設定"}
                                    </span>
                                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                        {data.status ?? "新規"}
                                    </span>
                                </div>

                                <div className="space-y-1 text-sm text-gray-600">
                                    <p>
                                        <strong className="text-gray-700">
                                            建物:
                                        </strong>{" "}
                                        {data.facilities?.buildings?.name ??
                                            "未指定"}
                                    </p>
                                    <p>
                                        <strong className="text-gray-700">
                                            施設:
                                        </strong>{" "}
                                        {data.facilities?.name ?? "未指定"}
                                    </p>
                                    <p>
                                        <strong className="text-gray-700">
                                            利用目的:
                                        </strong>{" "}
                                        {data.purposes?.name ?? "未指定"}
                                    </p>
                                    <p>
                                        <strong className="text-gray-700">
                                            利用日:
                                        </strong>{" "}
                                        {data.usage_date}
                                    </p>
                                    <p>
                                        <strong className="text-gray-700">
                                            時間枠:
                                        </strong>{" "}
                                        {data.facility_slots?.slots?.name ??
                                            "未指定"}
                                    </p>
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

            {/* 親側の記述をシンプルにしつつ、オブジェクトを渡す */}
            <ApplicationDetailModal
                isOpen={!!selectedApplicationId}
                applicationId={
                    applications.find(
                        (data) =>
                            (data?.application_id || data?.id) ===
                            selectedApplicationId,
                    )?.application_id
                }
                onClose={() => setSelectedApplicationId(null)}
                onUpdate={fetchDashboardData}
                currentUser={currentUser} // currentUserを渡す
            />
        </div>
    );
}
