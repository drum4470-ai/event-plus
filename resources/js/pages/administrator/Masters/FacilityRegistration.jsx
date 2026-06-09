import React, { useState, useMemo } from 'react';
import { useForm } from '@inertiajs/react';

export default function FacilityRegistration({ existingNames = [], buildings = [] }) {
    const [selectedBuildingId, setSelectedBuildingId] = useState('');
    
    const { data, setData, post, reset } = useForm({
        name: '',
        building_id: '',
    });

    // フィルタリング計算
  const filteredFacilities = useMemo(() => {
    if (!selectedBuildingId) return existingNames;
    
    // ここで比較の直前にログを出す
    const filtered = existingNames.filter(f => {
        const match = String(f.building_id) === String(selectedBuildingId);
        if (!match) {
            console.log(`判定結果: 不一致 (施設側のID: ${f.building_id}, 選択中のID: ${selectedBuildingId})`);
        }
        return match;
    });
    
    console.log("フィルタリング後の件数:", filtered.length);
    return filtered;
}, [existingNames, selectedBuildingId]);

    const handleRegister = () => {
        post(route('administrator.facilities.store'), {
            onSuccess: () => {
                reset();
                setData('building_id', selectedBuildingId); // 登録後も選択状態を維持
            },
        });
    };

// 登録されているデータ全体を確認
console.table(existingNames);

// 現在のフィルタ条件と、実際のデータの中身を比較表示
console.log("選択中のBuildingID:", selectedBuildingId);
existingNames.forEach(f => {
    console.log(`施設名: ${f.name} | 施設側のbuilding_id: ${f.building_id} (${typeof f.building_id})`);
});


    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4">施設マスタ</h2>
            
            {/* 他のタブと同じスタイルの入力フォーム */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                
                {/* 1. 建物絞り込み・選択 */}
                <select 
                    className="w-full p-3 rounded-lg border border-gray-200"
                    value={selectedBuildingId}
                    onChange={(e) => {
                        const id = e.target.value;
                        setSelectedBuildingId(id);
                        setData('building_id', id);
                    }}
                >
                    <option value="">すべての建物を表示</option>
                    {buildings.map(b => (
                        <option key={b.building_id} value={b.building_id}>{b.name}</option>
                    ))}
                </select>

                {/* 2. 施設名入力 */}
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="施設名を入力"
                    className="w-full p-3 rounded-lg border border-gray-200"
                />

                <button 
                    onClick={handleRegister}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                >
                    登録する
                </button>
            </div>
            
            {/* 3. 一覧表示 */}
            <div className="mt-6">
                <h3 className="font-bold text-gray-700 mb-2">登録済み一覧</h3>
                {/* リスト表示部分の修正案 */}
                <ul className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y">
                    {filteredFacilities.map((item) => {
                        // 施設IDから建物名を探す（buildings配列を利用）
                        const buildingName = buildings.find(b => 
                            String(b.building_id || b.id) === String(item.building_id)
                        )?.name || '建物不明';

                        return (
                            <li key={item.facility_id} className="p-3 flex justify-between items-center">
                                <span>{item.name}</span>
                                {/* 建物名を横に表示する */}
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {buildingName}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}