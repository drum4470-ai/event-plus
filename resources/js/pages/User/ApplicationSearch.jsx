import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { csrfApi } from '@/api';

export default function ApplicationSearch() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        buildings: [],
        facilities: [],
        purposes: [],
        equipments: [],
        slots: []
    });

    const [formData, setFormData] = useState({

        facility_id: '',
        facility_slot_id: '',
        purpose_id: '',
        equipment_id: [],
        event_name: '',
        usage_date: '',
        address: '',
        telephone: '',
    });

    const [confirmModal, setConfirmModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await csrfApi.get('/sanctum/csrf-cookie');
                const response = await api.get('/user/applications/relations');

                setData({
                    buildings: response.data.buildings ?? [],
                    facilities: response.data.facilities ?? [],
                    purposes: response.data.purposes ?? [],
                    equipments: response.data.equipments ?? [],
                    slots: response.data.slots ?? [],
                });
                const loginUser = response.data.user; 
                if (loginUser) {
                    setFormData(prev => ({
                        ...prev,
                        address: loginUser.address ?? '',
                        telephone: loginUser.telephone ?? '',
                    }));
                }
                console.log('APIから取得したデータ:', response.data);
            } catch (error) {
                console.error('データ取得失敗:', error);
            }
        };

        fetchData();
    }, []);

    // 登録処理の実行
    const handleSubmit = async () => {
        setProcessing(true);
        try {
            await csrfApi.get('/sanctum/csrf-cookie');
            await api.post('/user/applications', formData);
            
            setConfirmModal(false);
            setSuccessModal(true);
           
        } catch (error) {
            console.error('登録失敗:', error);
            alert('登録に失敗しました。入力内容を確認してください。');
        } finally {
            setProcessing(false);
        }
    };
const selectedFacility = Array.isArray(data.facilities)
    ? data.facilities.find(f => Number(f.facility_id) === Number(formData.facility_id))
    : (data.facilities?.facility_id == formData.facility_id ? data.facilities : null);

const selectedBuildingName = selectedFacility?.buildings?.name 
    || data.buildings.find(b => Number(b.building_id) === Number(formData.building_id))?.name;
    const selectedFacilityName = data.facilities.find(f => String(f.facility_id) === String(formData.facility_id))?.name;
    const selectedPurposeName = data.purposes.find(p => String(p.purpose_id) === String(formData.purpose_id))?.name;
    const selectedSlot = data.slots.find(s => String(s.facility_slot_id ?? s.slot_id) === String(formData.facility_slot_id));
    const selectedSlotName = selectedSlot ? (selectedSlot.name ?? `${selectedSlot.start_time} 〜 ${selectedSlot.end_time}`) : null;
    const selectedEquipmentNames = data.equipments
        .filter(eq => formData.equipment_id.includes(eq.equipment_id))
        .map(eq => eq.name);
// 選択された施設・目的に紐づく設備IDのリストを抽出
    const selectedFacilityObj = (data.facilities ?? []).find(f => String(f.facility_id) === String(formData.facility_id));
    const matchedPurpose = selectedFacilityObj?.facility_purposes?.find(fp => String(fp.purpose_id) === String(formData.purpose_id));
    const availableEquipmentIds = matchedPurpose?.facility_purpose_equipments?.map(fpe => fpe.equipment_id) ?? [];
    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4">
                利用申請
            </h2>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">

            {/* 1. 建物 */}
            <div className="mb-4">
                <label className="block font-bold mb-2">建物</label>
                <select
                    value={formData.building_id}
                    onChange={(e) => {
                        const buildingId = e.target.value;
                        setFormData(prev => ({
                            ...prev,
                            building_id: buildingId,
                            facility_id: '',
                            purpose_id: '',
                            facility_slot_id: '',
                            equipment_id: [],
                        }));
                    }}
                    className="w-full p-3 border rounded-lg"
                >
                    <option value="">建物を選択してください</option>
                    {(data.buildings ?? []).map((building) => (
                        <option key={building.building_id} value={building.building_id}>
                            {building.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* 2. 施設 (建物で絞り込み) */}
            <div className="mb-4">
                <label className="block font-bold mb-2">施設</label>
                <select
                    value={formData.facility_id}
                    onChange={(e) => {
                        const facilityId = e.target.value;
                        setFormData(prev => ({
                            ...prev,
                            facility_id: facilityId,
                            purpose_id: '',
                            facility_slot_id: '',
                            equipment_id: [],
                        }));
                    }}
                    disabled={!formData.building_id}
                    className="w-full p-3 border rounded-lg disabled:bg-gray-100"
                >
                    <option value="">施設を選択してください</option>
                    {(data.facilities ?? [])
                        .filter(f => String(f.building_id) === String(formData.building_id))
                        .map((facility) => (
                            <option key={facility.facility_id} value={facility.facility_id}>
                                {facility.name}
                            </option>
                        ))}
                </select>
            </div>

           {/* 3. 利用目的 */}
            <div className="mb-4">
                <label className="block font-bold mb-2">利用目的</label>
                <select
                    value={formData.purpose_id}
                    onChange={(e) => {
                        setFormData(prev => ({
                            ...prev,
                            purpose_id: e.target.value,
                            equipment_id: [],
                        }));
                    }}
                    disabled={!formData.facility_id}
                    className="w-full p-3 border rounded-lg disabled:bg-gray-100"
                >
                    <option value="">目的を選択してください</option>
                    {(() => {
                        // 選択中の施設を取得
                        const currentFacility = (data.facilities ?? []).find(f => String(f.facility_id) === String(formData.facility_id));
                        if (!currentFacility || !currentFacility.facility_purposes) return null;

                        // facility_purposes に紐づく目的マスタ（purposes）を展開してオプションを生成
                        return currentFacility.facility_purposes.map((fp) => {
                            const purpose = fp.purposes;
                            if (!purpose) return null;
                            return (
                                <option key={purpose.purpose_id} value={purpose.purpose_id}>
                                    {purpose.name}
                                </option>
                            );
                        });
                    })()}
                </select>
            </div>

            

            {/* 5. 設備 */}
            <div className="mb-4">
                <label className="block font-bold mb-2">設備（複数選択可）</label>
                <div className="space-y-2 border p-3 rounded-lg bg-gray-50">
                    {(!formData.facility_id || !formData.purpose_id) ? (
                        <p className="text-sm text-gray-500">施設と利用目的を選択すると設備が表示されます。</p>
                    ) : (
                        (data.equipments ?? [])
                            .filter(eq => availableEquipmentIds.includes(eq.equipment_id))
                            .map((equipment) => (
                                <label key={equipment.equipment_id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        value={equipment.equipment_id}
                                        checked={formData.equipment_id.includes(equipment.equipment_id)}
                                        onChange={(e) => {
                                            const id = Number(e.target.value);
                                            setFormData(prev => ({
                                                ...prev,
                                                equipment_id: e.target.checked
                                                    ? [...prev.equipment_id, id]
                                                    : prev.equipment_id.filter(item => item !== id)
                                            }));
                                        }}
                                    />
                                    <span>{equipment.name}</span>
                                </label>
                            ))
                    )}
                    {formData.facility_id && formData.purpose_id && availableEquipmentIds.length === 0 && (
                        <p className="text-sm text-gray-500">この目的に利用可能な設備はありません。</p>
                    )}
                </div>
            </div>


            {/* 4. 時間枠 */}
            <div className="mb-4">
                <label className="block font-bold mb-2">時間枠</label>
                <select
                    value={formData.facility_slot_id}
                    onChange={(e) => {
                        setFormData(prev => ({
                            ...prev,
                            facility_slot_id: e.target.value,
                        }));
                    }}
                    disabled={!formData.facility_id}
                    className="w-full p-3 border rounded-lg disabled:bg-gray-100"
                >
                    <option value="">時間枠を選択してください</option>
                    {(() => {
                        // 選択中の施設を取得
                        const currentFacility = (data.facilities ?? []).find(f => String(f.facility_id) === String(formData.facility_id));
                        if (!currentFacility || !currentFacility.facility_slots) return null;

                        // facility_slots に紐づくスロットマスタ（slots）を展開してオプションを生成
                        return currentFacility.facility_slots.map((fs) => {
                            const slot = fs.slots;
                            if (!slot) return null;
                            const slotName = slot.name ?? `${slot.start_time} 〜 ${slot.end_time}`;
                            return (
                                <option key={fs.facility_slot_id} value={fs.facility_slot_id}>
                                    {slotName}
                                </option>
                            );
                        });
                    })()}
                </select>
            </div>

                {/* 利用日 */}
                <div>
                    <label className="block font-bold mb-2">利用日</label>
                    <input
                        type="date"
                        value={formData.usage_date}
                        onChange={(e) =>
                            setFormData(prev => ({ ...prev, usage_date: e.target.value }))
                        }
                        className="w-full p-3 border rounded-lg"
                    />
                </div>

                {/* イベント名 */}
                <div>
                    <label className="block font-bold mb-2">イベント名</label>
                    <input
                        type="text"
                        value={formData.event_name}
                        onChange={(e) =>
                            setFormData(prev => ({ ...prev, event_name: e.target.value }))
                        }
                        className="w-full p-3 border rounded-lg"
                        placeholder="イベント名を入力してください"
                    />
                </div>

                {/* 住所 */}
                <div>
                    <label className="block font-bold mb-2">住所</label>
                    <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                            setFormData(prev => ({ ...prev, address: e.target.value }))
                        }
                        className="w-full p-3 border rounded-lg"
                        placeholder="住所を入力してください"
                    />
                </div>

                {/* 電話番号 */}
                <div>
                    <label className="block font-bold mb-2">電話番号</label>
                    <input
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) =>
                            setFormData(prev => ({ ...prev, telephone: e.target.value }))
                        }
                        className="w-full p-3 border rounded-lg"
                        placeholder="電話番号を入力してください"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="button"
                        onClick={() => setConfirmModal(true)}
                        disabled={processing}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        確認する
                    </button>
                </div>
            </div>

            {/* 確認モーダル */}
            {confirmModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl max-w-lg w-full space-y-4">
                        <h3 className="text-lg font-bold">申請内容の確認</h3>
                        <p className="text-sm text-gray-600">以下の内容で登録します。よろしいですか？</p>
                        
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                            <p><strong>建物:</strong> {selectedBuildingName || '未選択'}</p>
                            <p><strong>施設:</strong> {selectedFacilityName || '未選択'}</p>
                            <p><strong>利用目的:</strong> {selectedPurposeName || '未選択'}</p>
                            <p><strong>時間枠:</strong> {selectedSlotName || '未選択'}</p>
                            <p><strong>設備:</strong> {selectedEquipmentNames.length > 0 ? selectedEquipmentNames.join(', ') : 'なし'}</p>
                            <p><strong>イベント名:</strong> {formData.event_name || '未入力'}</p>
                            <p><strong>利用日:</strong> {formData.usage_date || '未入力'}</p>
                            <p><strong>住所:</strong> {formData.address || '未入力'}</p>
                            <p><strong>電話番号:</strong> {formData.telephone || '未入力'}</p>
                        </div>

                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setConfirmModal(false)}
                                disabled={processing}
                                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                            >
                                キャンセル
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                {processing ? '処理中...' : '登録する'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 成功モーダル */}
            {successModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl max-w-sm w-full space-y-4 text-center">
                        <h3 className="text-lg font-bold text-green-600">登録完了</h3>
                        <p className="text-sm text-gray-600">利用申請の登録が正常に完了しました。</p>
                        <button
                            type="button"
                            onClick={() => {
                                setSuccessModal(false);
                                 setTimeout(() => {
                                    navigate('/dashboard'); // リダイレクト先はここで指定
                                }, 1000);
                            }}
                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}