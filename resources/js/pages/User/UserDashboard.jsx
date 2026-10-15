import { useState, useEffect } from "react";
import UserDrawer from "@/Components/UserDrawer";
import ApplicationDetailModal from "@/Components/ApplicationDetailModal";
import api, { csrfApi } from "@/api";
import BasicLayout from "@/Layouts/BasicLayout";
import PaginationWrapper from "@/Layouts/PaginationWrapper";

export default function UserDashboard() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [summary, setSummary] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({ status: "", keyword: "" });
    const [debouncedFilters, setDebouncedFilters] = useState(filters);

    const [applications, setApplications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(applications.length / itemsPerPage);

    // 安全策：データ件数が減ってcurrentPageが総ページ数を超えたら1ページ目に戻す
    const safeCurrentPage =
        currentPage > totalPages && totalPages > 0 ? 1 : currentPage;

    const currentApplications = applications.slice(
        (safeCurrentPage - 1) * itemsPerPage,
        safeCurrentPage * itemsPerPage,
    );
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);

    const fetchDashboardData = async () => {
        try {
            await csrfApi.get("/sanctum/csrf-cookie");

            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(
                    ([_, value]) => value !== "" && value != null,
                ),
            );
            const params = new URLSearchParams(cleanFilters);

            const [dashboardRes, profileRes] = await Promise.all([
                api.get(`/user/dashboard?${params.toString()}`),
                api.get("/user/profile"),
            ]);

            setSummary(dashboardRes.data.summary || {});
            setCurrentUser(profileRes.data.data ?? profileRes.data);

            const fetchedApps = dashboardRes.data.data;
            setApplications(Array.isArray(fetchedApps) ? fetchedApps : []);
            setError("");
        } catch (err) {
            console.error("ダッシュボードデータの取得エラー:", err);
            setError("データの取得に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
        }, 700);
        return () => clearTimeout(timer);
    }, [filters]);

    useEffect(() => {
        setCurrentPage(1); // フィルター変更時に1ページ目に戻す
        fetchDashboardData();
    }, [debouncedFilters]);

    const handleCardClick = (statusKey) => {
        setFilters((prev) => ({
            ...prev,
            status: prev.status === statusKey ? "" : statusKey,
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}年${month}月${day}日`;
    };

    // ★ 画面全体を止めるのは loading のときだけにする
    if (loading) return <div className="p-6 text-center">読み込み中...</div>;

    return (
        <BasicLayout>
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
                            <div
                                onClick={() => handleCardClick("新規申請")}
                                className={`rounded-lg border bg-white p-4 shadow-sm cursor-pointer transition ${
                                    filters.status === "新規申請"
                                        ? "ring-2 ring-blue-500 border-blue-500"
                                        : "hover:border-blue-300"
                                }`}
                            >
                                <p className="text-sm font-medium text-gray-500">
                                    新規申請
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {summary.new ?? 0}
                                    <span className="text-sm font-normal text-gray-500">
                                        件
                                    </span>
                                </p>
                            </div>
                            <div
                                onClick={() => handleCardClick("要修正")}
                                className={`rounded-lg border bg-white p-4 shadow-sm cursor-pointer transition ${
                                    filters.status === "要修正"
                                        ? "ring-2 ring-blue-500 border-blue-500"
                                        : "hover:border-blue-300"
                                }`}
                            >
                                <p className="text-sm font-medium text-gray-500">
                                    要修正
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {summary.revision ?? 0}
                                    <span className="text-sm font-normal text-gray-500">
                                        件
                                    </span>
                                </p>
                            </div>
                            <div
                                onClick={() => handleCardClick("担当確認")}
                                className={`rounded-lg border bg-white p-4 shadow-sm cursor-pointer transition ${
                                    filters.status === "担当確認"
                                        ? "ring-2 ring-blue-500 border-blue-500"
                                        : "hover:border-blue-300"
                                }`}
                            >
                                <p className="text-sm font-medium text-gray-500">
                                    担当確認中
                                </p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {summary.staff_check ?? 0}
                                    <span className="text-sm font-normal text-gray-500">
                                        件
                                    </span>
                                </p>
                            </div>
                            <div
                                onClick={() => handleCardClick("社内確認")}
                                className={`rounded-lg border bg-white p-4 shadow-sm cursor-pointer transition ${
                                    filters.status === "社内確認"
                                        ? "ring-2 ring-blue-500 border-blue-500"
                                        : "hover:border-blue-300"
                                }`}
                            >
                                <p className="text-sm font-medium text-gray-500">
                                    社内確認中
                                </p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {summary.internal_check ?? 0}
                                    <span className="text-sm font-normal text-gray-500">
                                        件
                                    </span>
                                </p>
                            </div>
                            <div
                                onClick={() => handleCardClick("申請手続き")}
                                className={`rounded-lg border bg-white p-4 shadow-sm cursor-pointer transition ${
                                    filters.status === "申請手続き"
                                        ? "ring-2 ring-blue-500 border-blue-500"
                                        : "hover:border-blue-300"
                                }`}
                            >
                                <p className="text-sm font-medium text-gray-500">
                                    申請手続き中
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {summary.processing ?? 0}
                                    <span className="text-sm font-normal text-gray-500">
                                        件
                                    </span>
                                </p>
                            </div>
                            <div
                                onClick={() => handleCardClick("申請済み")}
                                className={`rounded-lg border bg-white p-4 shadow-sm cursor-pointer transition ${
                                    filters.status === "申請済み"
                                        ? "ring-2 ring-blue-500 border-blue-500"
                                        : "hover:border-blue-300"
                                }`}
                            >
                                <p className="text-sm font-medium text-gray-500">
                                    申請済み
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {summary.submitted ?? 0}
                                    <span className="text-sm font-normal text-gray-500">
                                        件
                                    </span>
                                </p>
                            </div>
                            <div
                                onClick={() => handleCardClick("過去の申請")}
                                className={`rounded-lg border bg-white p-4 shadow-sm cursor-pointer transition ${
                                    filters.status === "過去の申請"
                                        ? "ring-2 ring-blue-500 border-blue-500"
                                        : "hover:border-blue-300"
                                }`}
                            >
                                <p className="text-sm font-medium text-gray-500">
                                    過去の申請
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {summary.history ?? 0}
                                    <span className="text-sm font-normal text-gray-500">
                                        件
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 検索バー */}
                    <div className="mb-6 flex gap-2 items-center">
                        <input
                            type="text"
                            placeholder="キーワードで検索..."
                            value={filters.keyword}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    keyword: e.target.value,
                                })
                            }
                            className="rounded border p-2 flex-1 shadow-sm bg-white"
                        />
                        {(filters.status || filters.keyword) && (
                            <button
                                type="button"
                                onClick={() =>
                                    setFilters({ status: "", keyword: "" })
                                }
                                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm text-gray-700"
                            >
                                条件クリア
                            </button>
                        )}
                    </div>

                    {/* マイ申請一覧 */}
                    <h2 className="mb-4 text-xl font-bold text-gray-800">
                        マイ申請一覧
                        {filters.status && (
                            <span className="text-blue-600 text-sm">
                                （{filters.status}で絞り込み中）
                            </span>
                        )}
                    </h2>

                    {applications.length === 0 ? (
                        <p className="text-gray-500">
                            該当する申請はありません。
                        </p>
                    ) : (
                        /* PaginationWrapper でグリッドカード群をラップする */
                        <PaginationWrapper
                            currentPage={safeCurrentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {currentApplications.map((data) => (
                                    <div
                                        key={data.application_id ?? data.id}
                                        onClick={() => {
                                            setSelectedApplicationId(
                                                data.application_id ?? data.id,
                                            );
                                        }}
                                        className="rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md cursor-pointer hover:border-blue-300"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-blue-600">
                                                {data.event_name ||
                                                    "イベント名未設定"}
                                            </span>
                                            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                {data.status ||
                                                    "ステータス未設定"}
                                            </span>
                                        </div>

                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>
                                                <strong className="text-gray-700">
                                                    建物:
                                                </strong>
                                                {data.facilities?.buildings
                                                    ?.name ?? "未指定"}
                                            </p>
                                            <p>
                                                <strong className="text-gray-700">
                                                    施設:
                                                </strong>
                                                {data.facilities?.name ??
                                                    "未指定"}
                                            </p>
                                            <p>
                                                <strong className="text-gray-700">
                                                    利用目的:
                                                </strong>
                                                {data.purposes?.name ??
                                                    "未指定"}
                                            </p>
                                            <p>
                                                <strong className="text-gray-700">
                                                    利用日:
                                                </strong>
                                                {formatDate(data.usage_date)}
                                            </p>
                                            <p>
                                                <strong className="text-gray-700">
                                                    時間枠:
                                                </strong>
                                                {data.facility_slots?.slots
                                                    ?.name ?? "未指定"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PaginationWrapper>
                    )}
                </main>

                <UserDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                />

                <ApplicationDetailModal
                    isOpen={!!selectedApplicationId}
                    applicationId={selectedApplicationId}
                    onClose={() => setSelectedApplicationId(null)}
                    onUpdate={fetchDashboardData}
                    currentUser={currentUser}
                />
            </div>
        </BasicLayout>
    );
}
