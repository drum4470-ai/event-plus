import { Link, useNavigate } from "react-router-dom";
import BasicLayout from "@/Layouts/BasicLayout";
import api, { csrfApi } from "@/api";

export default function AdministratorDashboard() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await csrfApi.get("/sanctum/csrf-cookie");
            await api.post("/administrator/logout");
            navigate("/administrator/login");
        } catch (error) {
            console.error("ログアウト失敗:", error);
        }
    };

    return (
        <BasicLayout>
            <div className="max-w-md mx-auto px-4 py-4 space-y-4">
                <section className="space-y-2">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">
                        管理者メニュー
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 divide-y divide-gray-100">
                        <Link
                            to="/administrator/account"
                            className="flex items-center p-3.5 hover:bg-gray-50 transition"
                        >
                            <span className="flex-1 font-medium text-gray-700">
                                アカウント管理
                            </span>
                            <span className="text-gray-400">＞</span>
                        </Link>
                        <Link
                            to="/administrator/relation"
                            className="flex items-center p-3.5 hover:bg-gray-50 transition"
                        >
                            <span className="flex-1 font-medium text-gray-700">
                                リレーション管理
                            </span>
                            <span className="text-gray-400">＞</span>
                        </Link>
                        <Link
                            to="/administrator/master"
                            className="flex items-center p-3.5 hover:bg-gray-50 transition"
                        >
                            <span className="flex-1 font-medium text-gray-700">
                                マスタ管理
                            </span>
                            <span className="text-gray-400">＞</span>
                        </Link>
                    </div>
                </section>

                {/* ログアウトセクション */}
                <section className="pt-2">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center p-3.5 text-red-600 font-medium hover:bg-red-50 transition"
                        >
                            ログアウト
                        </button>
                    </div>
                </section>
            </div>
        </BasicLayout>
    );
}
