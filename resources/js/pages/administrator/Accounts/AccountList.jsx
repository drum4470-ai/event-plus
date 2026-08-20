import React from 'react';

export default function AccountList({ accounts = [], onEdit }) {
    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">
                アカウント一覧
            </h2>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-3 text-left">
                                ID
                            </th>
                            <th className="p-3 text-left">
                                名前
                            </th>
                            <th className="p-3 text-left">
                                メールアドレス
                            </th>
                            <th className="p-3 text-left">
                                電話番号
                            </th>
                            <th className="p-3 text-left">
                                団体名
                            </th>
                            <th className="p-3 text-left">
                                権限
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {accounts.map((account) => (
                            <tr
                                key={account.user_id}
                                onClick={() => onEdit(account)}
                                className="border-b cursor-pointer hover:bg-blue-50 transition"
                            >
                                <td className="p-3">
                                    {account.user_id}
                                </td>

                                <td className="p-3 font-medium">
                                    {account.name}
                                </td>

                                <td className="p-3">
                                    {account.email}
                                </td>

                                <td className="p-3">
                                    {account.telephone}
                                </td>

                                <td className="p-3">
                                    {account.company || '-'}
                                </td>

                                <td className="p-3">
                                    {account.role}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {accounts.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        登録されているアカウントはありません。
                    </div>
                )}
            </div>
        </div>
    );
}