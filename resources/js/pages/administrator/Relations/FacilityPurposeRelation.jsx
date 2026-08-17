import React, { useState } from 'react';
import api from '@/api';

export default function FacilityPurposeRelation({
    facilities = [],
    purposes = [], // 親から渡されなくても動くようにする
    onUpdate = () => {}
}) {
    const [selectedPurposesMap, setSelectedPurposesMap] = useState({});

   
    const allPurposes = purposes.length > 0 ? purposes : (() => {
        const purposeMap = new Map();
        
        facilities.forEach(facility => {
            facility.facility_purposes?.forEach(fp => {
                if (fp.purposes) {                   
                    purposeMap.set(fp.purpose_id, fp.purposes);
                }
            });
        });
        return Array.from(purposeMap.values());
    })();

    const handleCheckboxChange = (facilityId, purposeId) => {
        const currentSelected = selectedPurposesMap[facilityId] || [];
        let updated;
        if (currentSelected.includes(purposeId)) {
            updated = currentSelected.filter(id => id !== purposeId);
        } else {
            updated = [...currentSelected, purposeId];
        }
        setSelectedPurposesMap({
            ...selectedPurposesMap,
            [facilityId]: updated
        });
    };

const handleRegister = async (facilityId) => {
        // 選択された目的IDの配列
        const purposeIds = selectedPurposesMap[facilityId] || [];
        if (purposeIds.length === 0) return;

        try {
            await Promise.all(
                purposeIds.map(async (purposeId) => {
                    // 送信データを明示的にオブジェクトとして構築
                    const payload = {
                        facility_id: Number(facilityId),
                        purpose_id: Number(purposeId),
                    };

                    console.log('送信データ確認:', payload);

                    return api.post('/administrator/facility-purpose', payload);
                })
            );

            onUpdate();
            setSelectedPurposesMap({
                ...selectedPurposesMap,
                [facilityId]: []
            });
        } catch (error) {
            console.error('一括紐付け登録失敗の詳細:', error.response?.data?.errors ?? error.response?.data ?? error);
        }
    };

    const handleDelete = async (fp) => {
        try {
            await api.delete(`/administrator/facility-purpose/${fp.facility_purpose_id}`);
            onUpdate();
        } catch (error) {
            console.error('削除失敗', error.response ?? error);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">施設 × 利用目的</h3>
            
            <div className="space-y-4">
                {facilities.length === 0 ? (
                    <p className="text-gray-500">施設データがありません。</p>
                ) : (
                    facilities.map(facility => {
                        const facilitySelected = selectedPurposesMap[facility.facility_id] || [];
                        const facilityPurposes = facility.facility_purposes || [];
                        const registeredPurposeIds = facility.facility_purposes?.map(fp => fp.purpose_id) ?? [];

                        return (
                            <div key={facility.facility_id} className="border rounded-lg p-4 bg-white shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <div>
                                        <span className="font-bold text-lg">{facility.name}</span>
                                        <span className="ml-2 text-gray-500 text-sm">
                                            {facility.buildings?.name}
                                        </span>
                                    </div>
                                </div>

                                {/* 登録済みの利用目的一覧 */}
                                <div className="mb-3">
                                    <div className="text-xs text-gray-500 mb-1">登録済みの利用目的:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {facilityPurposes.length > 0 ? (
                                            facilityPurposes.map(fp => (
                                                <span
                                                    key={fp.facility_purpose_id}
                                                    className="inline-flex items-center bg-gray-100 border border-gray-300 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {fp.purposes?.name || '目的'}
                                                    <button
                                                        onClick={() => handleDelete(fp)}
                                                        className="ml-2 text-red-500 hover:text-red-700 font-bold"
                                                        title="紐付けを解除"
                                                    >
                                                        &times;
                                                    </button>
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-gray-400">利用目的が登録されていません</span>
                                        )}
                                    </div>
                                </div>

                                {/* 追加用のチェックボックスエリア */}
                                <div className="mt-3 pt-3 border-t border-gray-100 bg-gray-50 p-3 rounded">
                                    <div className="text-xs font-semibold text-gray-600 mb-2">追加する利用目的を選択:</div>
                                    
                                    <div className="flex flex-wrap gap-4 mb-3">
                                        {allPurposes.length === 0 ? (
                                            <span className="text-sm text-gray-400">選択可能な利用目的がありません</span>
                                        ) : (
                                            allPurposes.map(p => {
                                                const pId = p.purpose_id; // ここもデータ構造のキー名に合わせてください
                                                const isAlreadyRegistered = registeredPurposeIds.includes(pId);

                                                return (
                                                    <label 
                                                        key={pId} 
                                                        className={`flex items-center space-x-2 ${
                                                            isAlreadyRegistered ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            disabled={isAlreadyRegistered}
                                                            checked={isAlreadyRegistered || facilitySelected.includes(pId)}
                                                            onChange={() => !isAlreadyRegistered && handleCheckboxChange(facility.facility_id, pId)}
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm text-gray-700">
                                                            {p.name} {isAlreadyRegistered && '(登録済)'}
                                                        </span>
                                                    </label>
                                                );
                                            })
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleRegister(facility.facility_id)}
                                        disabled={facilitySelected.length === 0}
                                        className={`px-3 py-1.5 text-sm rounded text-white ${
                                            facilitySelected.length === 0 
                                                ? 'bg-gray-300 cursor-not-allowed' 
                                                : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                    >
                                        選択した目的を追加 ({facilitySelected.length}件)
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}