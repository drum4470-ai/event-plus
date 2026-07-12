import React, { useState, useEffect } from 'react';
import BuildingRegistration from './Masters/BuildingRegistration';
import FacilityRegistration from './Masters/FacilityRegistration';
import PurposeRegistration from './Masters/PurposeRegistration';
import EquipmentRegistration from './Masters/EquipmentRegistration';
import SlotRegistration from './Masters/SlotRegistration';
import api from '@/api';

export default function MasterManagement() {
    
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [buildings, slots, facilities, purposes, equipments] = await Promise.all([
                    api.get('/administrator/buildings'),
                    api.get('/administrator/slots'),
                    api.get('/administrator/facilities'),
                    api.get('/administrator/purposes'),
                    api.get('/administrator/equipment')
                ]);

                setData({
                    buildings: buildings.data.data || [],
                    slots: slots.data.data || [],
                    facilities: facilities.data.data || [],
                    purposes: purposes.data.data || [],
                    equipments: equipments.data.data || []
                });
            } catch (error) {
                console.error("データ取得失敗:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const [activeTab, setActiveTab] = useState('facility');
    const [data, setData] = useState({
        buildings: [],
        facilities: [],
        purposes: [],
        equipments: [],
        slots: []
    });
    const [loading, setLoading] = useState(true);
    const tabs = [
        { id: 'facility', label: '施設マスタ' },
        { id: 'building', label: '建物マスタ' },
        { id: 'purpose', label: '利用目的マスタ' },
        { id: 'equipment', label: '付帯設備マスタ' },
        { id: 'slot', label: '時間帯マスタ' },
    ];

    // コンポーネントを辞書として定義（拡張性を確保）
    const ComponentMap = {
        facility: <FacilityRegistration existingNames={data.facilities} buildings={data.buildings} />,
        building: <BuildingRegistration existingNames={data.buildings} />,
        purpose: <PurposeRegistration existingNames={data.purposes} />,
        equipment: <EquipmentRegistration existingNames={data.equipments} />,
        slot: <SlotRegistration existingNames={data.slots} />
    };

    if (loading) return <div className="p-8">読み込み中...</div>;

    return (
        <div className="p-8">
            {/* タブボタン部分 */}
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

            {/* アクティブなコンポーネントを表示 */}
            <div className="mt-4">
                {ComponentMap[activeTab] || <div>選択してください</div>}
            </div>
        </div>
    );
}