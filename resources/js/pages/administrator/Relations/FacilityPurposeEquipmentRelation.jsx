import React, { useState } from 'react';
import api from '@/api';

export default function FacilityPurposeEquipmentRelation({
    facilities = [],
    equipments = [],
    onUpdate = () => {}
}) {
    // 利用目的ごとに選択中の設備を管理
    // {
    //     3: [1, 2],
    //     5: [2]
    // }
    const [selectedEquipmentMap, setSelectedEquipmentMap] = useState({});

    // 設備選択
    const handleCheckboxChange = (facilityPurposeId, equipmentId) => {
        const currentSelected =
            selectedEquipmentMap[facilityPurposeId] || [];

        let updated;

        if (currentSelected.includes(equipmentId)) {
            updated = currentSelected.filter(
                id => id !== equipmentId
            );
        } else {
            updated = [
                ...currentSelected,
                equipmentId
            ];
        }

        setSelectedEquipmentMap(prev => ({
            ...prev,
            [facilityPurposeId]: updated
        }));
    };

    // 設備の登録
    const handleRegister = async (facilityPurposeId) => {
        const selectedEquipmentIds =
            selectedEquipmentMap[facilityPurposeId] || [];

        if (selectedEquipmentIds.length === 0) {
            return;
        }

        try {
            await Promise.all(
                selectedEquipmentIds.map(equipmentId => {
                    const payload = {
                        facility_purpose_id: Number(facilityPurposeId),
                        equipment_id: Number(equipmentId),
                    };

                    console.log('送信データ確認:', payload);

                    return api.post(
                        '/administrator/facility-purpose-equipment',
                        payload
                    );
                })
            );

            onUpdate();

            // 登録後、その利用目的の選択状態を解除
            setSelectedEquipmentMap(prev => ({
                ...prev,
                [facilityPurposeId]: []
            }));

        } catch (error) {
            console.error(
                '設備紐付け登録失敗:',
                error.response?.data ?? error
            );
        }
    };

    // 設備の紐付け解除
    const handleDelete = async (fpe) => {
        const id =
            fpe.facility_purpose_equipment_id;

        if (!id) {
            console.error(
                'facility_purpose_equipment_id がありません',
                facilityPurposeEquipment
            );
            return;
        }

        try {
            await api.delete(
                `/administrator/facility-purpose-equipment/${fpe.facility_purpose_equipment_id}`
            );

            onUpdate();

        } catch (error) {
            console.error(
                '設備紐付け解除失敗:',
                error.response?.data ?? error
            );
        }
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">
                施設 × 利用目的 × 設備
            </h3>

            <div className="space-y-6">

                {facilities.length === 0 ? (
                    <p className="text-gray-500">
                        施設データがありません。
                    </p>
                ) : (

                    facilities.map(facility => (

                        <div
                            key={facility.facility_id}
                            className="border rounded-lg p-5 bg-white shadow-sm"
                        >

                            {/* =========================
                                施設
                            ========================= */}
                            <div className="mb-4">

                                <div className="text-lg font-bold">
                                    {facility.name}

                                    {facility.buildings?.name && (
                                        <span className="ml-2 text-sm font-normal text-gray-500">
                                            （{facility.buildings.name}）
                                        </span>
                                    )}
                                </div>

                            </div>


                            {/* =========================
                                利用目的
                            ========================= */}

                            {facility.facility_purposes?.length === 0 ? (

                                <p className="text-sm text-gray-400">
                                    利用目的が登録されていません。
                                </p>

                            ) : (

                                <div className="space-y-4">

                                    {facility.facility_purposes.map(
                                        facilityPurpose => {

                                            const facilityPurposeId =
                                                facilityPurpose.facility_purpose_id;

                                            const registeredEquipments =
                                                facilityPurpose
                                                    .facility_purpose_equipments
                                                || [];

                                            const registeredEquipmentIds =
                                                registeredEquipments.map(
                                                    item =>
                                                        item.equipment_id
                                                );

                                            const selectedEquipmentIds =
                                                selectedEquipmentMap[
                                                    facilityPurposeId
                                                ] || [];

                                            return (

                                                <div
                                                    key={facilityPurposeId}
                                                    className="border rounded-lg p-4 bg-gray-50"
                                                >

                                                    {/* =========================
                                                        利用目的名
                                                    ========================= */}

                                                    <div className="font-bold mb-3">

                                                        利用目的：

                                                        <span className="ml-1 text-indigo-600">
                                                            {
                                                                facilityPurpose
                                                                    .purposes
                                                                    ?.name
                                                            }
                                                        </span>

                                                    </div>


                                                    {/* =========================
                                                        登録済み設備
                                                    ========================= */}

                                                    <div className="mb-4">

                                                        <div className="text-xs text-gray-500 mb-2">
                                                            登録済み設備
                                                        </div>

                                                        {registeredEquipments.length === 0 ? (

                                                            <span className="text-sm text-gray-400">
                                                                設備が登録されていません
                                                            </span>

                                                        ) : (

                                                            <div className="flex flex-wrap gap-2">

                                                                {registeredEquipments.map(
                                                                    item => (

                                                                        <span
                                                                            key={
                                                                                item.facility_purpose_equipment_id
                                                                            }
                                                                            className="inline-flex items-center bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-full text-sm"
                                                                        >

                                                                            {
                                                                                item
                                                                                    .equipments
                                                                                    ?.name
                                                                            }

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleDelete(
                                                                                        item
                                                                                    )
                                                                                }
                                                                                className="ml-2 text-red-500 hover:text-red-700 font-bold"
                                                                                title="紐付けを解除"
                                                                            >
                                                                                ×
                                                                            </button>

                                                                        </span>

                                                                    )
                                                                )}

                                                            </div>

                                                        )}

                                                    </div>


                                                    {/* =========================
                                                        設備追加
                                                    ========================= */}

                                                    <div className="border-t pt-3">

                                                        <div className="text-xs font-semibold text-gray-600 mb-2">
                                                            追加する設備を選択
                                                        </div>

                                                        {equipments.length === 0 ? (

                                                            <p className="text-sm text-gray-400">
                                                                設備マスタに登録されている設備がありません。
                                                            </p>

                                                        ) : (

                                                            <div className="flex flex-wrap gap-4">

                                                                {equipments.map(
                                                                    equipment => {

                                                                        const equipmentId =
                                                                            equipment.equipment_id;

                                                                        const isAlreadyRegistered =
                                                                            registeredEquipmentIds.includes(
                                                                                equipmentId
                                                                            );

                                                                        const isSelected =
                                                                            selectedEquipmentIds.includes(
                                                                                equipmentId
                                                                            );

                                                                        return (

                                                                            <label
                                                                                key={
                                                                                    equipmentId
                                                                                }
                                                                                className={`flex items-center gap-2 ${
                                                                                    isAlreadyRegistered
                                                                                        ? 'opacity-50 cursor-not-allowed'
                                                                                        : 'cursor-pointer'
                                                                                }`}
                                                                            >

                                                                                <input
                                                                                    type="checkbox"
                                                                                    disabled={
                                                                                        isAlreadyRegistered
                                                                                    }
                                                                                    checked={
                                                                                        isAlreadyRegistered ||
                                                                                        isSelected
                                                                                    }
                                                                                    onChange={() =>
                                                                                        !isAlreadyRegistered &&
                                                                                        handleCheckboxChange(
                                                                                            facilityPurposeId,
                                                                                            equipmentId
                                                                                        )
                                                                                    }
                                                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                                />

                                                                                <span className="text-sm text-gray-700">

                                                                                    {
                                                                                        equipment.name
                                                                                    }

                                                                                    {isAlreadyRegistered && (
                                                                                        <span className="ml-1 text-xs text-gray-400">
                                                                                            （登録済）
                                                                                        </span>
                                                                                    )}

                                                                                </span>

                                                                            </label>

                                                                        );
                                                                    }
                                                                )}

                                                            </div>

                                                        )}


                                                        {/* =========================
                                                            登録ボタン
                                                        ========================= */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRegister(
                                                                    facilityPurposeId
                                                                )
                                                            }
                                                            disabled={
                                                                selectedEquipmentIds.length === 0
                                                            }
                                                            className={`mt-4 px-4 py-2 text-sm text-white rounded ${
                                                                selectedEquipmentIds.length === 0
                                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                                    : 'bg-green-600 hover:bg-green-700'
                                                            }`}
                                                        >

                                                            選択した設備を追加
                                                            {selectedEquipmentIds.length > 0 &&
                                                                `（${selectedEquipmentIds.length}件）`
                                                            }

                                                        </button>

                                                    </div>

                                                </div>

                                            );
                                        }
                                    )}

                                </div>

                            )}

                        </div>

                    ))
                )}

            </div>
        </div>
    );
}