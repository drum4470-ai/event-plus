import React, { useState } from 'react';
import api from '@/api';

export default function FacilitySlotRelation({
    facilities = [],
    slots = [],
    onUpdate = () => {}
}) {
    const [selectedSlotMap, setSelectedSlotMap] = useState({});

    // =========================
    // チェックボックス変更
    // =========================
    const handleCheckboxChange = (facilityId, slotId) => {
        const currentSelected =
            selectedSlotMap[facilityId] || [];

        let updated;

        if (currentSelected.includes(slotId)) {
            updated = currentSelected.filter(
                id => id !== slotId
            );
        } else {
            updated = [
                ...currentSelected,
                slotId
            ];
        }

        setSelectedSlotMap({
            ...selectedSlotMap,
            [facilityId]: updated
        });
    };

    // =========================
    // 時間枠の紐付け解除
    // =========================
    const handleDelete = async (facilitySlotId) => {
        try {
            await api.delete(
                `/administrator/facility-slots/${facilitySlotId}`
            );

            onUpdate();

        } catch (error) {
            console.error(
                '時間枠の紐付け解除失敗',
                error.response ?? error
            );
        }
    };

    // =========================
    // 時間枠の登録
    // =========================
    const handleRegister = async (facilityId) => {

        const selectedSlots =
            selectedSlotMap[facilityId] || [];

        if (selectedSlots.length === 0) {
            return;
        }

        try {

            await Promise.all(
                selectedSlots.map(slotId =>
                    api.post(
                        '/administrator/facility-slots',
                        {
                            facility_id: facilityId,
                            slot_id: slotId
                        }
                    )
                )
            );

            onUpdate();

            setSelectedSlotMap({
                ...selectedSlotMap,
                [facilityId]: []
            });

        } catch (error) {

            console.error(
                '時間枠の紐付け登録失敗',
                error.response?.data ?? error
            );
        }
    };

    return (
        <div>

            <h3 className="text-xl font-bold mb-4">
                施設 × 時間枠
            </h3>

            <div className="space-y-4">

                {facilities.length === 0 ? (

                    <p className="text-gray-500">
                        施設データがありません。
                    </p>

                ) : (

                    facilities.map(facility => {

                        const facilitySelected =
                            selectedSlotMap[
                                facility.facility_id
                            ] || [];

                        const facilitySlots =
                            facility.facility_slots || [];

                        // 登録済み時間枠のID
                        const registeredSlotIds =
                            facilitySlots.map(
                                fs => fs.slot_id
                            );

                        return (

                            <div
                                key={facility.facility_id}
                                className="border rounded-lg p-4 bg-white shadow-sm"
                            >

                                {/* =========================
                                    施設名・建物名
                                ========================= */}
                                <div className="flex justify-between items-center mb-3">

                                    <div>

                                        <span className="font-bold text-lg">
                                            {facility.name}
                                        </span>

                                        <span className="ml-2 text-gray-500 text-sm">
                                            {facility.buildings?.name}
                                        </span>

                                    </div>

                                </div>


                                {/* =========================
                                    登録済み時間枠
                                ========================= */}
                                <div className="mb-3">

                                    <div className="text-xs text-gray-500 mb-1">
                                        登録済みの時間枠:
                                    </div>

                                    <div className="flex flex-wrap gap-2">

                                        {facilitySlots.length > 0 ? (

                                            facilitySlots.map(fs => (

                                                <span
                                                    key={
                                                        fs.facility_slot_id
                                                    }
                                                    className="inline-flex items-center bg-gray-100 border border-gray-300 px-3 py-1 rounded-full text-sm"
                                                >

                                                    {fs.slots?.name || '時間枠'}

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                fs.facility_slot_id
                                                            )
                                                        }
                                                        className="ml-2 text-red-500 hover:text-red-700 font-bold"
                                                        title="紐付けを解除"
                                                    >
                                                        &times;
                                                    </button>

                                                </span>

                                            ))

                                        ) : (

                                            <span className="text-sm text-gray-400">
                                                時間枠が登録されていません
                                            </span>

                                        )}

                                    </div>

                                </div>


                                {/* =========================
                                    追加用チェックボックス
                                ========================= */}
                                <div className="mt-3 pt-3 border-t border-gray-100 bg-gray-50 p-3 rounded">

                                    <div className="text-xs font-semibold text-gray-600 mb-2">
                                        追加する時間枠を選択:
                                    </div>


                                    <div className="flex flex-wrap gap-4 mb-3">

                                        {slots.length === 0 ? (

                                            <span className="text-sm text-gray-400">
                                                選択可能な時間枠がありません
                                            </span>

                                        ) : (

                                            slots.map(slot => {

                                                const slotId =
                                                    slot.slot_id;

                                                const isAlreadyRegistered =
                                                    registeredSlotIds.includes(
                                                        slotId
                                                    );

                                                return (

                                                    <label
                                                        key={slotId}
                                                        className={`flex items-center space-x-2 ${
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
                                                                facilitySelected.includes(
                                                                    slotId
                                                                )
                                                            }
                                                            onChange={() =>
                                                                !isAlreadyRegistered &&
                                                                handleCheckboxChange(
                                                                    facility.facility_id,
                                                                    slotId
                                                                )
                                                            }
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />

                                                        <span className="text-sm text-gray-700">

                                                            {slot.name}

                                                            {isAlreadyRegistered &&
                                                                ' (登録済)'}

                                                        </span>

                                                    </label>

                                                );

                                            })

                                        )}

                                    </div>


                                    {/* =========================
                                        登録ボタン
                                    ========================= */}
                                    <button
                                        onClick={() =>
                                            handleRegister(
                                                facility.facility_id
                                            )
                                        }
                                        disabled={
                                            facilitySelected.length === 0
                                        }
                                        className={`px-3 py-1.5 text-sm rounded text-white ${
                                            facilitySelected.length === 0
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                    >
                                        選択した時間枠を追加
                                        {' '}
                                        ({facilitySelected.length}件)
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