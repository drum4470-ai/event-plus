import { useState, useEffect, useCallback } from "react";
import BuildingRegistration from "./Masters/BuildingRegistration";
import FacilityRegistration from "./Masters/FacilityRegistration";
import PurposeRegistration from "./Masters/PurposeRegistration";
import EquipmentRegistration from "./Masters/EquipmentRegistration";
import SlotRegistration from "./Masters/SlotRegistration";
import api, { csrfApi } from "@/api";
import BasicLayout from "@/Layouts/BasicLayout";

export default function MasterManagement() {
    const [data, setData] = useState({
        buildings: [],
        facilities: [],
        purposes: [],
        equipments: [],
        slots: [],
    });
    const [activeTab, setActiveTab] = useState("facility");
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        try {
            const response = await api.get("/administrator/master");

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
            await csrfApi.get("/sanctum/csrf-cookie");
            await refreshData();
            setLoading(false);
        };
        init();
    }, [refreshData]);

    const tabs = [
        { id: "facility", label: "施設マスタ" },
        { id: "building", label: "建物マスタ" },
        { id: "purpose", label: "利用目的マスタ" },
        { id: "equipment", label: "付帯設備マスタ" },
        { id: "slot", label: "時間帯マスタ" },
    ];

    // 各コンポーネントに refreshData を onUpdate として渡す
    const ComponentMap = {
        facility: () => (
            <FacilityRegistration
                onUpdate={refreshData}
                existingNames={data.facilities}
                buildings={data.buildings}
            />
        ),
        building: () => (
            <BuildingRegistration
                onUpdate={refreshData}
                existingNames={data.buildings}
            />
        ),
        purpose: () => (
            <PurposeRegistration
                onUpdate={refreshData}
                existingNames={data.purposes}
            />
        ),
        equipment: () => (
            <EquipmentRegistration
                onUpdate={refreshData}
                existingNames={data.equipments}
            />
        ),
        slot: () => (
            <SlotRegistration
                onUpdate={refreshData}
                existingNames={data.slots}
            />
        ),
    };

    if (loading) return <div className="p-8">読み込み中...</div>;

    return (
        <BasicLayout>
            <div className="p-8">
                <div className="flex grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 px-3 text-sm font-medium rounded-lg transition-all text-center ${
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

                <div className="mt-4">
                    {ComponentMap[activeTab] ? (
                        ComponentMap[activeTab]()
                    ) : (
                        <div>選択してください</div>
                    )}
                </div>
            </div>
        </BasicLayout>
    );
}
