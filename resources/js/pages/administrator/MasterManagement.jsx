import React, { useState } from 'react';
import BuildingRegistration from './Masters/BuildingRegistration';
import FacilityRegistration from './Masters/FacilityRegistration';
import PurposeRegistration from './Masters/PurposeRegistration';
import EquipmentRegistration from './Masters/EquipmentRegistration';
import SlotRegistration from './Masters/SlotRegistration';

export default function MasterManagement({ type, ...props }) {
    const [activeTab, setActiveTab] = useState('facility'); // 'facility' か 'building'

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
            {activeTab === 'building' && <BuildingRegistration {...props} existingNames={props.buildings} />}
            {activeTab === 'facility' && <FacilityRegistration {...props} existingNames={props.facilities} buildings={props.buildings} />}
            {activeTab === 'purpose' && <PurposeRegistration {...props} existingNames={props.purposes} />}
            {activeTab === 'equipment' && <EquipmentRegistration {...props} existingNames={props.equipments} />}
            {activeTab === 'slot' && <SlotRegistration {...props} existingNames={props.slots} />}
        </div>
    );
}