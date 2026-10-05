import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { csrfApi } from "@/api";
import BasicLayout from "@/Layouts/BasicLayout";

export default function UserEdit() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [currentUser, setCurrentUser] = useState({
        name: "{[currentUser.name]}", // 初期値を設定
        email: "{[currentUser.email]}", // 初期値を設定
        password: "", // 変更時のみ入力（空なら変更しない）
        telephone: "{[currentUser.telephone]}",
        address: "{[currentUser.address]}",
        company: "{[currentUser.company]}",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const errorMessages = {
        name: {
            required: "名前を入力してください。",
            max: "名前は255文字以内で入力してください。",
        },
        email: {
            required: "メールアドレスを入力してください。",
            email: "正しいメールアドレスを入力してください。",
            unique: "このメールアドレスはすでに登録されています。",
            max: "メールアドレスは320文字以内で入力してください。",
        },
        password: {
            min: "パスワードは8文字以上で入力してください。",
            max: "パスワードは4096文字以内で入力してください。",
        },
        telephone: {
            required: "電話番号を入力してください。",
            max: "電話番号は20文字以内で入力してください。",
        },
        address: {
            required: "住所を入力してください。",
            max: "住所は255文字以内で入力してください。",
        },
        company: {
            max: "会社名は255文字以内で入力してください。",
        },
    };

    const fetchProfileData = async () => {
        try {
            await csrfApi.get("/sanctum/csrf-cookie");

            const profileRes = await api.get("/user/profile");
            setCurrentUser(profileRes.data.data ?? profileRes.data);

            setError("");
        } catch (err) {
            setError("データの取得に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    // ★ 2. 初回マウント時にデータを取得
    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        // パスワードが空の場合、バックエンドに送らない（またはそのまま送るか）の処理
        // バックエンドが「空ならパスワードを変更しない」設計になっている前提です
        const submitData = { ...currentUser };
        if (!submitData.password) {
            delete submitData.password;
        }

        try {
            await csrfApi.get("/sanctum/csrf-cookie");

            // ★ 2. 更新用のエンドポイントにPUTまたはPOST（バックエンドのルート設計に合わせる）
            // PUT /user/profile や PUT /user など
            await csrfApi.put("/user/registration", submitData);

            setMessage("プロフィールを更新しました。");

            // 必要に応じて数秒後にダッシュボードへ戻すなど
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (error) {
            console.error("プロフィール更新エラー:", error);

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const messages = [];

                Object.entries(errors).forEach(([field, fieldErrors]) => {
                    fieldErrors.forEach((message) => {
                        const rule = message.split(".").pop();
                        const convertedMessage =
                            errorMessages[field]?.[rule] ||
                            "入力内容を確認してください。";
                        messages.push(convertedMessage);
                    });
                });

                setError(messages.join("\n"));
            } else {
                setError(
                    error.response?.data?.message ||
                        "プロフィールの更新に失敗しました。",
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <BasicLayout>
            <div className="mx-auto max-w-md rounded-lg border bg-white p-6 shadow">
                <h2 className="mb-6 text-xl font-bold text-center">
                    プロフィール編集
                </h2>
                {message && (
                    <div className="mb-4 rounded bg-green-100 p-3 text-green-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 whitespace-pre-line rounded bg-red-100 p-3 text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* 名前 */}
                    <div className="mb-4">
                        <label className="mb-1 block font-medium">名前</label>
                        <input
                            type="text"
                            name="name"
                            value={currentUser.name}
                            onChange={handleChange}
                            className="w-full rounded border p-2"
                            required
                        />
                    </div>

                    {/* メールアドレス */}
                    <div className="mb-4">
                        <label className="mb-1 block font-medium">
                            メールアドレス
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={currentUser.email}
                            autoComplete="username"
                            onChange={handleChange}
                            className="w-full rounded border p-2"
                            required
                        />
                    </div>

                    {/* パスワード */}
                    <div className="mb-4">
                        <label className="mb-1 block font-medium">
                            パスワード（変更する場合のみ入力）
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={currentUser.password}
                            autoComplete="new-password"
                            onChange={handleChange}
                            className="w-full rounded border p-2"
                            placeholder="変更しない場合は空欄"
                        />
                    </div>

                    {/* 電話番号 */}
                    <div className="mb-4">
                        <label className="mb-1 block font-medium">
                            電話番号
                        </label>
                        <input
                            type="text"
                            name="telephone"
                            value={currentUser.telephone}
                            onChange={handleChange}
                            className="w-full rounded border p-2"
                            required
                        />
                    </div>

                    {/* 住所 */}
                    <div className="mb-4">
                        <label className="mb-1 block font-medium">住所</label>
                        <input
                            type="text"
                            name="address"
                            value={currentUser.address}
                            onChange={handleChange}
                            className="w-full rounded border p-2"
                            required
                        />
                    </div>

                    {/* 団体名・会社名 */}
                    <div className="mb-6">
                        <label className="mb-1 block font-medium">
                            団体名（任意）
                        </label>
                        <input
                            type="text"
                            name="company"
                            value={currentUser.company}
                            onChange={handleChange}
                            className="w-full rounded border p-2"
                        />
                    </div>

                    {/* 更新ボタン */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "更新中..." : "更新する"}
                    </button>
                </form>
            </div>
        </BasicLayout>
    );
}
