import React, { useState } from 'react';
import FacilityPurposeRelation from './Relations/FacilityPurposeRelation';
import FacilityPurposeEquipmentRelation from './Relations/FacilityPurposeEquipmentRelation';
import FacilitySlotRelation from './Relations/FacilitySlotRelation';

export default function RelationManagement({ buildings, facilities, equipments, purposes, slots, submitUrls = {} }) {
    const [activeTab, setActiveTab] = useState('facility_purpose');

    const tabs = [
        { id: 'facilityPurpose_equipment', label: '施設目的 × 備品' },
        { id: 'facility_purpose', label: '施設 × 目的' },
        { id: 'facility_slot', label: '施設 × スロット' },
    ];

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">リレーション（紐付け）管理</h2>
            
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

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                {activeTab === 'facility_purpose' && (
                    <FacilityPurposeRelation facilities={facilities} purposes={purposes} />
                )}
                {activeTab === 'facilityPurpose_equipment' && (
                    <FacilityPurposeEquipmentRelation facilityPurposes={facilityPurposes} equipments={equipments} />
                )}
                {activeTab === 'facility_slot' && (
                    <FacilitySlotRelation facilities={facilities} slots={slots} />
                )}
            </div>
        </div>
    );
}