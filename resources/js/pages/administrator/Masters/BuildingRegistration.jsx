import React from 'react';
import { useForm } from '@inertiajs/react';

export default function BuildingRegistration({ existingNames = [] }) {
    // 1. 建物専用のフォーム設定（住所を追加）
    const { data, setData, post, reset } = useForm({
        name: '',
        address: '',
    });

    // 2. 登録処理
    const handleRegister = () => {
        post(route('administrator.buildings.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4">建物マスタ</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                {/* 建物名入力 */}
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="建物名を入力"
                    className="w-full p-3 rounded-lg border border-gray-200"
                />

                {/* 住所入力 */}
                <input
                    type="text"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="住所を入力"
                    className="w-full p-3 rounded-lg border border-gray-200"
                />

                <button 
                    onClick={handleRegister}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                >
                    登録する
                </button>
            </div>
            
            {/* 登録済み一覧（絞り込み不要なので直接 map するだけ） */}
            <div className="mt-6">
                <h3 className="font-bold text-gray-700 mb-2">登録済み建物一覧</h3>
                <ul className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y">
                    {existingNames.length > 0 ? (
                        existingNames.map((item) => (
                            <li key={item.id} className="p-3">
                                <div className="font-bold">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.address}</div>
                            </li>
                        ))
                    ) : (
                        <li className="p-3 text-gray-400">データがありません</li>
                    )}
                </ul>
            </div>
            
        </div>
    );
}