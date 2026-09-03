import React, { useEffect, useState } from 'react';
import api from '@/api';

export default function AccountForm({ editingAccount, onComplete }) {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        telephone: '',
        address: '',
        company: '',
        role: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const errorMessages = {
    name: {
        required: '名前を入力してください。',
        max: '名前は255文字以内で入力してください。',
    },

    email: {
        required: 'メールアドレスを入力してください。',
        email: '正しいメールアドレスを入力してください。',
        unique: 'このメールアドレスはすでに登録されています。',
        max: 'メールアドレスは320文字以内で入力してください。',
    },

    password: {
        required: 'パスワードを入力してください。',
        min: 'パスワードは8文字以上で入力してください。',
        max: 'パスワードは4096文字以内で入力してください。',
    },

    telephone: {
        required: '電話番号を入力してください。',
        max: '電話番号は20文字以内で入力してください。',
    },

    address: {
        required: '住所を入力してください。',
        max: '住所は255文字以内で入力してください。',
    },

    company: {
        max: '会社名は255文字以内で入力してください。',
    },

    role: {
        required: '権限を選択してください。',
        max: '権限は13文字以内で入力してください。',
    },
};
    

    // 編集対象が変わったらフォームに反映
    useEffect(() => {
        if (editingAccount) {
            setFormData({
                name: editingAccount.name ?? '',
                email: editingAccount.email ?? '',
                password: '',
                telephone: editingAccount.telephone ?? '',
                address: editingAccount.address ?? '',
                company: editingAccount.company ?? '',
                role: editingAccount.role ?? '',
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                telephone: '',
                address: '',
                company: '',
                role: '',
            });
        }

        setError('');
    }, [editingAccount]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleDelete = async () => {
        const confirmed = window.confirm(
            'このアカウントを削除しますか？'
        );

        if (!confirmed) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.delete(
                `/administrator/accounts/${editingAccount.user_id}`
            );

            onComplete();

        } catch (error) {
            console.error('アカウント削除エラー:', error);

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;

                setError(
                    Object.values(errors)
                        .flat()
                        .join('\n')
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    'アカウントの削除に失敗しました。'
                );
            }

        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError('');
        

        try {
            if (editingAccount) {
                // 編集
                await api.put(
                    `/administrator/accounts/${editingAccount.user_id}`,
                    formData
                );
            } else {
                // 新規登録
                await api.post(
                    '/administrator/accounts',
                    formData
                );
            }

            onComplete();

        } catch (error) {
            console.error('アカウント保存エラー:', error);

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;

                const messages = [];

                Object.entries(errors).forEach(([field, fieldErrors]) => {
                    fieldErrors.forEach((message) => {
                        const rule = message.split('.').pop();

                        const convertedMessage =
                            errorMessages[field]?.[rule] ||
                            '入力内容を確認してください。';

                        messages.push(convertedMessage);
                    });
                });

                setError(messages.join('\n'));
            } else {
                setError(
                    'アカウントの保存に失敗しました。'
                );
            }
        } finally {
        console.log('finally');
        setLoading(false);
    }
    };


    return (
        <div className="mb-8 rounded-lg border bg-white p-6 shadow">

            <h2 className="mb-6 text-xl font-bold">
                {editingAccount
                    ? 'アカウント編集'
                    : 'アカウント登録'}
            </h2>

            {error && (
                <div className="mb-4 whitespace-pre-line rounded bg-red-100 p-3 text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* 名前 */}
                <div className="mb-4">
                    <label className="mb-1 block font-medium">
                        名前
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        required
                    />
                </div>


                {/* メール */}
                <div className="mb-4">
                    <label className="mb-1 block font-medium">
                        メールアドレス
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        required
                    />
                </div>


                {/* パスワード */}
                <div className="mb-4">
                    <label className="mb-1 block font-medium">
                        {editingAccount
                            ? 'パスワード（変更する場合のみ）'
                            : 'パスワード'}
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        required={!editingAccount}
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
                        value={formData.telephone}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        required
                    />
                </div>


                {/* 住所 */}
                <div className="mb-4">
                    <label className="mb-1 block font-medium">
                        住所
                    </label>

                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        required
                    />
                </div>


                {/* 会社 */}
                <div className="mb-4">
                    <label className="mb-1 block font-medium">
                        団体名
                    </label>

                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                    />
                </div>


                {/* 権限 */}
                <div className="mb-6">
                    <label className="mb-1 block font-medium">
                        権限
                    </label>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full rounded border p-2"
                        required
                    >
                        <option value="">
                            選択してください
                        </option>

                        <option value="user">
                            一般ユーザー
                        </option>

                        <option value="staff">
                            担当者
                        </option>

                        <option value="manager">
                            承認者
                        </option>

                        <option value="administrator">
                            管理者
                        </option>
                    </select>
                </div>


                {/* ボタン */}
                <div className="flex gap-3">

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading
                            ? '保存中...'
                            : editingAccount
                                ? '更新する'
                                : '登録する'}
                    </button>


                    {editingAccount && (
                        <>
                            <button
                                type="button"
                                onClick={() => onComplete()}
                                className="rounded bg-gray-400 px-5 py-2 text-white hover:bg-gray-500"
                            >
                                キャンセル
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={loading}
                                className="rounded bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50 ml-auto"
                            >
                                削除
                            </button>
                        </>
                    )}

                </div>

            </form>
        </div>
    );
}