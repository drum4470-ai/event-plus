import React, { useState, useEffect } from 'react';
import BuildingRegistration from './Masters/BuildingRegistration';
import FacilityRegistration from './Masters/FacilityRegistration';
import PurposeRegistration from './Masters/PurposeRegistration';
import EquipmentRegistration from './Masters/EquipmentRegistration';
import SlotRegistration from './Masters/SlotRegistration';

export default function MasterManagement({ type, submitUrls = {}, ...props }) {
    const [activeTab, setActiveTab] = useState('facility'); // 'facility' か 'building'
    const [data, setData] = useState({
        buildings: [],
        facilities: [],
        purposes: [],
        equipment: [],
        slots: []
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Scribeで確認したAPIを叩く
                const res = await api.get('/administrator/master'); // 全マスタを返すAPIを作るか、個別に叩く
                setData(res.data);
            } catch (error) {
                console.error("データ取得失敗:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (loading) return <div>読み込み中...</div>;

    const tabs = [
        { id: 'facility', label: '施設マスタ' },
        { id: 'building', label: '建物マスタ' },
        { id: 'purpose', label: '利用目的マスタ' },
        { id: 'equipment', label: '付帯設備マスタ' },
        { id: 'slot', label: '時間帯マスタ' },
    ];

    // 戻り値の return の中身をこのように修正してください
return (
        <div className="p-8">
            {/* タブボタン部分はそのまま */}
            <div className="flex space-x-4 border-b mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-2 px-4 font-bold ${activeTab === tab.id ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-400'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ここでアクティブなものだけを表示 */}
            {activeTab === 'building' && <BuildingRegistration existingNames={data.buildings} />}
            {activeTab === 'facility' && <FacilityRegistration existingNames={data.facilities} buildings={data.buildings}/>}
            {activeTab === 'purpose' && <PurposeRegistration existingNames={data.purposes} />}
            {activeTab === 'equipment' && <EquipmentRegistration existingNames={data.equipment} />}
            {activeTab === 'slot' && <SlotRegistration existingNames={data.slots} />}
        </div>
    );
}