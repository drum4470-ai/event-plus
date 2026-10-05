import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { csrfApi } from "@/api";
import BasicLayout from "@/Layouts/BasicLayout";

export default function AdministratorLogin() {
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

            await api.post("/administrator/login", {
                email,
                password,
            });

            navigate("/administrator/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "ログインに失敗しました");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <BasicLayout>
            <div className="max-w-md mx-auto px-4 py-8">
                <div className="p-6 bg-white shadow-sm rounded-xl border border-gray-200">
                    <h1 className="text-xl font-bold mb-6 text-center text-gray-800">
                        管理者ログイン
                    </h1>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="メールアドレスを入力"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                パスワード
                            </label>
                            <input
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="パスワードを入力"
                                required
                            />
                        </div>
                        {error && (
                            <p className="text-red-600 text-xs bg-red-50 p-2 rounded">
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition disabled:opacity-50"
                        >
                            {processing ? "ログイン中..." : "ログイン"}
                        </button>
                    </form>
                </div>
            </div>
        </BasicLayout>
    );
}
