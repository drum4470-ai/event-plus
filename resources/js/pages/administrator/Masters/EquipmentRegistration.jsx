import React from 'react';
import { useForm } from '@inertiajs/react';

export default function EquipmentRegistration({ existingNames = [] }) {
    // 1. 設備登録に必要なデータだけを管理
    const { data, setData, post, reset } = useForm({
        name: '',
    });

    // 2. 登録処理
    const handleRegister = () => {
        post(route('administrator.equipments.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4">付帯設備マスタ</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="設備名を入力"
                    className="w-full p-3 rounded-lg border border-gray-200"
                />
                
                <button 
                    onClick={handleRegister}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                >
                    登録する
                </button>
            </div>
            
            <div className="mt-6">
                <h3 className="font-bold text-gray-700 mb-2">登録済み設備一覧</h3>
                <ul className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y">
                    {existingNames.length > 0 ? (
                        existingNames.map((item) => (
                            <li key={item.id} className="p-3">
                                {item.name}
                            </li>
                        ))
                    ) : (
                        <li className="p-3 text-gray-400">登録データがありません</li>
                    )}
                </ul>
            </div>
        </div>
    );
}