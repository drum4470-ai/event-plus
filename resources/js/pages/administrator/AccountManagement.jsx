import React, { useEffect, useState } from 'react';
import api from '@/api';
import AccountForm from './Accounts/AccountForm';
import AccountList from './Accounts/AccountList';

export default function AccountManagement() {

    // アカウント一覧
    const [accounts, setAccounts] = useState([]);

    // 現在編集しているアカウント
    // nullなら新規登録
    const [editingAccount, setEditingAccount] = useState(null);

    // 読み込み状態
    const [loading, setLoading] = useState(false);

    // エラー
    const [error, setError] = useState('');


    // アカウント一覧取得
    const fetchAccounts = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await api.get('/administrator/accounts');

            setAccounts(response.data.data);

        } catch (error) {
            console.error('アカウント取得エラー:', error);

            setError(
                error.response?.data?.message ||
                'アカウントの取得に失敗しました。'
            );

        } finally {
            setLoading(false);
        }
    };


    // 初回読み込み
    useEffect(() => {
        fetchAccounts();
    }, []);


    // 登録・編集完了
    const handleComplete = () => {
        setEditingAccount(null);

        // 一覧を再取得
        fetchAccounts();
    };


    return (
        <div className="p-6">

            <h1 className="mb-6 text-2xl font-bold">
                アカウント管理
            </h1>


            {/* 登録・編集フォーム */}
            <AccountForm
                editingAccount={editingAccount}
                onComplete={handleComplete}
            />


            {/* エラー */}
            {error && (
                <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
                    {error}
                </div>
            )}


            {/* 読み込み中 */}
            {loading && (
                <p className="mb-4">
                    読み込み中...
                </p>
            )}


            {/* 一覧 */}
            {!loading && (
                <AccountList
                    accounts={accounts}
                    onEdit={(account) => {
                        setEditingAccount(account);
                    }}
                />
            )}

        </div>
    );
}