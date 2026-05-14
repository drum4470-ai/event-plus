import React from 'react';
import { Head, Link } from '@inertiajs/react';


export default function MasterSelection({ auth }) {
    // 表示するカードの設定
    const masterTypes = [
        { label: 'building', category: '建物' },
        { label: 'facility', category: '施設' },
        { label: 'slot', category: '時間枠' },
        { label: 'equipment', category: '付帯設備' },
        { label: 'purpose', category: '利用目的' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Head title="マスタ選択" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">マスタ管理</h1>
                    <p className="mt-3 text-lg text-gray-600">登録を行うカテゴリを選択してください</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {masterTypes.map((item) => (
                        <Link
                            key={item.label}
                            /* route() を使わず、直接パスを指定 */
                            href={`/administrator/master-registration/create?type=${item.label}`}
                            className="group relative flex flex-col bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1"
                        >                            
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {item.category}マスタ
                            </h3>
                        </Link>
                    ))}
                </div>
                
                <div className="mt-12 text-center">
                    <Link 
                        href="/administrator/dashboard" 
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                    >
                        ← ダッシュボードへ戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}