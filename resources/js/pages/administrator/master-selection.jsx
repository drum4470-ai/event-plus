import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function MasterSelection({ auth, mode = 'create' }) {
    const masterTypes = [
        { key: 'building', category: '建物', description: '貸出施設の入る建物・総合施設の管理' },
        { key: 'facility', category: '施設', description: '体育館や会議室など、具体的な部屋の管理' },
        { key: 'slot', category: '時間枠', description: 'コマ枠（午前・午後・夜間など）の時間設定' },
        { key: 'equipment', category: '付帯設備', description: 'マイクやプロジェクター、ボールなどの備品' },
        { key: 'purpose', category: '利用目的', description: '大会、会議、練習など利用用途のカテゴリ' },
    ];

    const isEditMode = mode === 'edit';
    const pageTitle = isEditMode ? 'マスタ編集・一覧' : 'マスタ新規登録';
    const pageDescription = isEditMode ? '編集するマスタを選択してください' : '登録するマスタを選択してください';

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Head title={pageTitle} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{pageTitle}</h1>
                    <p className="mt-3 text-lg text-gray-600">{pageDescription}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {masterTypes.map((item) => {
                        // 💡 Laravelのルート定義: /administrator/master-registration/{type}/create に合わせる
                        const destinationUrl = isEditMode
                            ? `/administrator/master-edit?type=${item.key}`
                            : `/administrator/master-registration/${item.key}/create`;

                        return (
                            <Link
                                key={item.key}
                                href={destinationUrl}
                                className="group relative flex flex-col bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {item.category}マスタ ➔
                                </h3>
                                <p className="mt-2 text-sm text-gray-400 group-hover:text-gray-500 transition-colors line-clamp-2">
                                    {item.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}