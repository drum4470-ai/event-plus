import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { csrfApi } from "@/api";
import BasicLayout from "@/Layouts/BasicLayout";

export default function UserLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);

    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();

        setProcessing(true);
        setError("");

        try {
            await csrfApi.get("/sanctum/csrf-cookie");

            await api.post("/user/login", {
                email,
                password,
            });

            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "ログインに失敗しました");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <BasicLayout>
            {/* レイアウトに枠組みを任せるため、不要な min-h-screen や余白を取り除く */}
            <div className="w-full max-w-md mx-auto p-6 bg-white shadow-md rounded-lg my-8">
                <div className="mb-4 text-right">
                    <Link
                        to="/user-registration"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        新規登録はこちら
                    </Link>
                </div>

                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    ログイン
                </h1>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="メールアドレスを入力"
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="パスワードを入力"
                            required
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <div className="text-right">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            パスワードを忘れてしまった場合
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                        {processing ? "ログイン中..." : "ログイン"}
                    </button>
                </form>
            </div>
        </BasicLayout>
    );
}
