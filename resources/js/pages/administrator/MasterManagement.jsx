import React, { useState, useEffect, useCallback } from 'react';
import BuildingRegistration from './Masters/BuildingRegistration';
import FacilityRegistration from './Masters/FacilityRegistration';
import PurposeRegistration from './Masters/PurposeRegistration';
import EquipmentRegistration from './Masters/EquipmentRegistration';
import SlotRegistration from './Masters/SlotRegistration';
import api, { csrfApi } from '@/api';

export default function MasterManagement() {
    const [data, setData] = useState({
        buildings: [],
        facilities: [],
        purposes: [],
        equipments: [],
        slots: []
    });
    const [activeTab, setActiveTab] = useState('facility');
    const [loading, setLoading] = useState(true);

    // データの再取得関数を定義
    // useCallbackで囲むことで、子コンポーネントに渡しても無駄な再レンダリングを防ぐ
    const refreshData = useCallback(async () => {
        try {
            const response = await api.get('/administrator/master');

            setData({
                buildings: response.data.buildings ?? [],
                facilities: response.data.facilities ?? [],
                purposes: response.data.purposes ?? [],
                equipments: response.data.equipments ?? [],
                slots: response.data.slots ?? [],
            });

        } catch (error) {
            console.error("データ取得失敗:", error);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            await csrfApi.get('/sanctum/csrf-cookie');
            await refreshData();
            setLoading(false);
        };
        init();
    }, [refreshData]);

    const tabs = [
        { id: 'facility', label: '施設マスタ' },
        { id: 'building', label: '建物マスタ' },
        { id: 'purpose', label: '利用目的マスタ' },
        { id: 'equipment', label: '付帯設備マスタ' },
        { id: 'slot', label: '時間帯マスタ' },
    ];

    // 各コンポーネントに refreshData を onUpdate として渡す
    const ComponentMap = {
        facility: () => <FacilityRegistration onUpdate={refreshData} existingNames={data.facilities} buildings={data.buildings} />,
        building: () => <BuildingRegistration onUpdate={refreshData} existingNames={data.buildings} />,
        purpose: () => <PurposeRegistration onUpdate={refreshData} existingNames={data.purposes} />,
        equipment: () => <EquipmentRegistration onUpdate={refreshData} existingNames={data.equipments} />,
        slot: () => <SlotRegistration onUpdate={refreshData} existingNames={data.slots} />
    };

    if (loading) return <div className="p-8">読み込み中...</div>;

    return (
        <div className="p-8">
            <div className="flex space-x-4 border-b mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-2 px-4 font-bold transition-colors ${
                            activeTab === tab.id 
                            ? 'border-b-2 border-indigo-600 text-indigo-600' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="mt-4">
                {ComponentMap[activeTab] ? ComponentMap[activeTab]() : <div>選択してください</div>}
            </div>
        </div>
    );
}