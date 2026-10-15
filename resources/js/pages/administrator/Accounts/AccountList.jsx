import React, { useState } from "react";
import PaginationWrapper from "@/Layouts/PaginationWrapper";

export default function AccountList({ accounts = [], onEdit }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 1ページあたりのアイテム数

    // accounts の総数が変わったときなどに、currentPageが総ページ数を超えないようにする安全策
    const totalPages = Math.ceil(accounts.length / itemsPerPage);

    // 万が一、データ件数が減ったのに currentPage が大きいままなら1ページ目に戻す
    const safeCurrentPage =
        currentPage > totalPages && totalPages > 0 ? 1 : currentPage;

    // 現在のページに表示するアカウントを取得
    const currentAccounts = accounts.slice(
        (safeCurrentPage - 1) * itemsPerPage,
        safeCurrentPage * itemsPerPage,
    );

    return (
        <div className="mt-8 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">アカウント一覧</h2>

            {/* データが0件の場合の表示 */}
            {accounts.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                    登録されているアカウントはありません。
                </div>
            ) : (
                /* PaginationWrapper でグリッドとページネーションをまとめてラップする */
                <PaginationWrapper
                    currentPage={safeCurrentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {currentAccounts.map((account) => (
                            <div
                                key={account.user_id}
                                onClick={() => onEdit(account)}
                                className="bg-white rounded-lg shadow-md p-5 border border-gray-100 cursor-pointer hover:shadow-lg hover:border-blue-300 transition"
                            >
                                {/* カードの上部：IDと名前、権限 */}
                                <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                                    <div>
                                        <span className="text-xs text-gray-400 block">
                                            ID: {account.user_id}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {account.name}
                                        </h3>
                                    </div>
                                    <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
                                        {account.role}
                                    </span>
                                </div>

                                {/* カードの中央：詳細情報 */}
                                <div className="space-y-1.5 text-sm text-gray-600">
                                    <p>
                                        <strong className="text-gray-700">
                                            メールアドレス:
                                        </strong>{" "}
                                        <span className="break-all">
                                            {account.email}
                                        </span>
                                    </p>
                                    <p>
                                        <strong className="text-gray-700">
                                            電話番号:
                                        </strong>{" "}
                                        {account.telephone || "未指定"}
                                    </p>
                                    <p>
                                        <strong className="text-gray-700">
                                            団体名:
                                        </strong>{" "}
                                        {account.company || "未指定"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </PaginationWrapper>
            )}
        </div>
    );
}
