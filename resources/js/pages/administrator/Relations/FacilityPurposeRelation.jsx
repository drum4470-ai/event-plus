import React from 'react';
import { useForm } from '@inertiajs/react';

export default function FacilityPurposeRelation({ existingNames = [] }) {
    // 1. 開始時間と終了時間を管理
    const { data, setData, post, reset } = useForm({

    });

    // 2. 登録処理
    const handleRegister = () => {
        post(route('administrator.facilitypurposes.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4">時間帯マスタ</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="時間帯の名称（例：午前）"
                    className="w-full p-3 rounded-lg border border-gray-200"
                />
                
                <div className="flex gap-4">
                    <input
                        type="time"
                        value={data.start_time}
                        onChange={(e) => setData('start_time', e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200"
                    />
                    <span className="self-center">〜</span>
                    <input
                        type="time"
                        value={data.end_time}
                        onChange={(e) => setData('end_time', e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200"
                    />
                </div>

                <button 
                    onClick={handleRegister}
                    className="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg"
                >
                    登録する
                </button>
            </div>
            
            <div className="mt-6">
                <h3 className="font-bold text-gray-700 mb-2">登録済み時間帯一覧</h3>
                <ul className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y">
                    {existingNames.length > 0 ? (
                        existingNames.map((item) => (
                            <li key={item.id} className="p-3 flex justify-between">
                                <span>{item.name}</span>
                                <span className="text-gray-500">
                                    {item.start_time} 〜 {item.end_time}
                                </span>
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