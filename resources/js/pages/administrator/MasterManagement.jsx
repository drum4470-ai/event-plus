import { useState, useEffect, useCallback } from "react";
import FacilityPurposeRelation from "./Relations/FacilityPurposeRelation";
import FacilityPurposeEquipmentRelation from "./Relations/FacilityPurposeEquipmentRelation";
import FacilitySlotRelation from "./Relations/FacilitySlotRelation";
import BasicLayout from "@/Layouts/BasicLayout";

import api from "@/api";

export default function RelationManagement() {
    const [data, setData] = useState({
        facilities: [],
        purposes: [],
        equipments: [],
        slots: [],
    });

    const [activeTab, setActiveTab] = useState("facility_purpose");
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        try {
            const response = await api.get("/administrator/relation");
            setData({
                facilities: response.data.facilities ?? [],
                purposes: response.data.purposes ?? [],
                equipments: response.data.equipments ?? [],
                slots: response.data.slots ?? [],
            });
        } catch (error) {
            console.error("Relation取得失敗:", error.response ?? error);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            await refreshData();
            setLoading(false);
        };
        init();
    }, [refreshData]);

    const tabs = [
        {
            id: "facility_purpose",
            label: "施設 × 利用目的",
        },
        {
            id: "facilityPurpose_equipment",
            label: "施設目的 × 備品",
        },
        {
            id: "facility_slot",
            label: "施設 × 時間枠",
        },
    ];

    const ComponentMap = {
        facility_purpose: () => (
            <FacilityPurposeRelation
                facilities={data.facilities}
                purposes={data.purposes}
                onUpdate={refreshData}
            />
        ),
        facilityPurpose_equipment: () => (
            <FacilityPurposeEquipmentRelation
                facilities={data.facilities}
                equipments={data.equipments}
                purposes={data.purposes}
                onUpdate={refreshData}
            />
        ),
        facility_slot: () => (
            <FacilitySlotRelation
                facilities={data.facilities}
                slots={data.slots}
                onUpdate={refreshData}
            />
        ),
    };

    if (loading) {
        return (
            <div className="p-4 text-center text-gray-500 text-sm">
                読み込み中...
            </div>
        );
    }

    return (
        <BasicLayout>
            <div className="max-w-4xl mx-auto px-4 py-4">
                <h1 className="text-lg font-bold text-gray-800 mb-4">
                    リレーション（紐付け）管理
                </h1>

                {/* タブ切り替え：パディングとマージンを小さく */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 mb-4 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-3 text-xs sm:text-sm font-medium rounded-md transition-all text-center ${
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* コンテンツエリア：内側の余白をコンパクトに */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
                    {ComponentMap[activeTab] ? (
                        ComponentMap[activeTab]()
                    ) : (
                        <div className="text-gray-500 text-center py-2 text-sm">
                            選択してください
                        </div>
                    )}
                </div>
            </div>
        </BasicLayout>
    );
}
