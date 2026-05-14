import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100 p-4 pb-12">
            <Head title="ダッシュボード" />

            <header className="py-6 mb-4">
                <h1 className="text-xl font-bold text-center text-gray-800">A2 ダッシュボード</h1>
            </header>

            <div className="max-w-md mx-auto space-y-6">
                
                {/* 1. アカウント管理 */}
                <section className="space-y-3">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">アカウント管理</h2>
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                        <Link href="/administrator/accounts-registration" className="flex items-center p-4 hover:bg-gray-50 border-b border-gray-100">
                            <span className="flex-1 font-medium">アカウント登録</span>
                            <span className="text-gray-400">＞</span>
                        </Link>
                        <Link href="/administrator/accounts-editing" className="flex items-center p-4 hover:bg-gray-50">
                            <span className="flex-1 font-medium text-gray-700">アカウント編集 (検索条件)</span>
                            <span className="text-gray-400">＞</span>
                        </Link>
                    </div>
                </section>

                {/* 2. 施設紐付け管理 */}
                <section className="space-y-3">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">施設紐付け管理</h2>
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                        <Link href="/administrator/relations-registration" className="flex items-center p-4 hover:bg-gray-50 border-b border-gray-100">
                            <span className="flex-1 font-medium">施設紐付け登録</span>
                            <span className="text-gray-400">＞</span>
                        </Link>
                        <Link href="/administrator/relations-editing" className="flex items-center p-4 hover:bg-gray-50">
                            <span className="flex-1 font-medium text-gray-700">施設紐付け編集 (検索条件)</span>
                            <span className="text-gray-400">＞</span>
                        </Link>
                    </div>
                </section>

                {/* 3. 施設マスタ管理 */}
                <section className="space-y-3">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">施設マスタ管理</h2>
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                        <Link href="/administrator/master-registration" className="flex items-center p-4 hover:bg-gray-50 border-b border-gray-100">
                            <span className="flex-1 font-medium">施設マスタ登録</span>
                            <span className="text-gray-400">＞</span>
                        </Link>
                        <Link href="/administrator/master/editing" className="flex items-center p-4 hover:bg-gray-50">
                            <span className="flex-1 font-medium text-gray-700">施設マスタ編集 (検索条件)</span>
                            <span className="text-gray-400">＞</span>
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
}