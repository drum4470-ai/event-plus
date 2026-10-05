import { Link, useNavigate } from "react-router-dom";
import api from "@/api"; // axiosを使う場合

export default function UserDrawer({ isOpen, onClose }) {
    const navigate = useNavigate();

    // ログアウト処理
    const handleLogout = async () => {
        try {
            // LaravelのログアウトAPIを叩く（プレフィックスが /user なら /user/logout）
            await api.post("/user/logout");

            // ドロワーを閉じる
            onClose();

            // ログアウト成功後、ログイン画面へ強制移動
            navigate("/login");
        } catch (error) {
            console.error("ログアウトに失敗しました", error);
            // エラー時の処理（必要であればアラートなど）
            navigate("/login");
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${
                isOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
            }`}
        >
            {/* 背景の黒いオーバーレイ */}
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />

            {/* ドロワー本体 */}
            <div
                className={`relative w-72 bg-white h-full shadow-2xl p-6 z-10 transform transition-transform duration-300 ease-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="h-full flex flex-col justify-between">
                    {/* 上部エリア（メニュー） */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b">
                            <h3 className="font-bold text-lg">メニュー</h3>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 text-xl font-bold px-2"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3 flex flex-col items-stretch">
                            <Link
                                to="/applications"
                                onClick={onClose}
                                className="block px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition font-medium"
                            >
                                新規申請を行う
                            </Link>
                            <Link
                                to="/edit"
                                onClick={onClose}
                                className="block px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition font-medium"
                            >
                                プロフィールを編集する
                            </Link>
                        </div>
                    </div>

                    {/* 下部エリア（ログアウトボタン） */}
                    <div>
                        <button
                            onClick={handleLogout} // ★ ここにログアウト用の関数を割り当てる
                            className="block w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-medium text-center"
                        >
                            ログアウト
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
