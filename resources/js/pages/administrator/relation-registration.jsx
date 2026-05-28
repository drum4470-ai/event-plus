import React, { useMemo, useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function RelationRegistration({ 
    buildings = [], 
    facilities = [], 
    purposes = [], 
    equipments = [], 
    slots = [],
    relatedPurposes = [], 
    relatedEquipments = [],
    relatedSlots = []
}) {
    const { data, setData, post, reset } = useForm({
        building_id: '',
        facility_id: '',
        facility_purpose_id: '',
        slot_id: '',
        purpose_ids: [],
        equipment_ids: [],
        slot_ids: [],
    });

    const [activeTab, setActiveTab] = useState('facility-purpose');
    const [showModal, setShowModal] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    
    const labels = {
        'facility-purpose': '目的',
        'equipment': '設備',
        'slot': '時間枠'
    };

    const handleResetForm = () => {
        setIsCompleted(false);
        setShowModal(false);
        reset();
    };

    const handleSubmit = () => {
        // ここで実際の登録処理（postなど）を行います
        setIsCompleted(true);
    };

    // useEffectはhandleSubmitの外に配置する必要があります
    useEffect(() => {
        if (data.facility_purpose_id) {
            const initialIds = relatedEquipments
                .filter(re => String(re.facility_purpose_id) === String(data.facility_purpose_id))
                .map(re => re.equipment_id);
            setData('equipment_ids', initialIds);
        } else {
            setData('equipment_ids', []);
        }
    }, [data.facility_purpose_id]);

    const filteredFacilities = useMemo(() => 
        facilities.filter(f => String(f.building_id) === String(data.building_id))
    , [data.building_id, facilities]);

    const canOpenModal = useMemo(() => {
        if (!data.building_id || !data.facility_id) return false;
        if (activeTab === 'facility-purpose') return data.purpose_ids.length > 0;
        if (activeTab === 'equipment') return data.facility_purpose_id !== '' && data.equipment_ids.length > 0;
        if (activeTab === 'slot') return data.slot_ids.length > 0;
        return false;
    }, [activeTab, data]);

    const handleCheckboxChange = (key, id, isChecked) => {
        const currentIds = data[key];
        const newIds = isChecked ? [...currentIds, id] : currentIds.filter(i => String(i) !== String(id));
        setData(key, newIds);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center">
            <main className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-sm border space-y-6">
                {/* タブ */}
                <div className="flex border-b">
                    {['facility-purpose', 'equipment', 'slot'].map((tab) => (
                        <button key={tab} type="button" onClick={() => { setActiveTab(tab); reset(); }} className={`flex-1 pb-3 text-xs font-bold border-b-2 ${activeTab === tab ? 'text-indigo-600 border-indigo-600' : 'text-gray-400'}`}>
                            {tab === 'facility-purpose' ? '目的登録' : tab === 'equipment' ? '設備登録' : '時間枠登録'}
                        </button>
                    ))}
                </div>

                {/* 建物・施設選択 */}
                <select value={data.building_id} onChange={(e) => setData({...data, building_id: e.target.value, facility_id: ''})} className="w-full p-3 border rounded-xl">
                    <option value="">-- 建物選択 --</option>
                    {buildings.map(b => <option key={b.building_id} value={b.building_id}>{b.name}</option>)}
                </select>

                {data.building_id && (
                    <select value={data.facility_id} onChange={(e) => setData('facility_id', e.target.value)} className="w-full p-3 border rounded-xl">
                        <option value="">-- 施設選択 --</option>
                        {filteredFacilities.map(f => <option key={f.facility_id} value={f.facility_id}>{f.name}</option>)}
                    </select>
                )}

                {/* 選択項目エリア */}
                {data.facility_id && (
                    <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                        {activeTab === 'facility-purpose' && purposes.map(p => (
                            <label key={p.purpose_id} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.purpose_ids.includes(p.purpose_id)} onChange={(e) => handleCheckboxChange('purpose_ids', p.purpose_id, e.target.checked)} />
                                {p.name}
                            </label>
                        ))}

                        {activeTab === 'equipment' && (
                            <>
                                <select value={data.facility_purpose_id} onChange={(e) => setData('facility_purpose_id', e.target.value)} className="w-full p-2 border rounded-lg">
                                    <option value="">-- 目的を選択 --</option>
                                    {relatedPurposes.filter(rp => String(rp.facility_id) === String(data.facility_id)).map(rp => (
                                        <option key={rp.id} value={rp.id}>{rp.purpose.name}</option>
                                    ))}
                                </select>

                                {data.facility_purpose_id && (
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        {equipments.map(eq => (
                                            <label key={eq.equipment_id} className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" checked={data.equipment_ids.includes(eq.equipment_id)} onChange={(e) => handleCheckboxChange('equipment_ids', eq.equipment_id, e.target.checked)} />
                                                {eq.name}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'slot' && slots.map(s => (
                            <label key={s.slot_id} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={data.slot_ids.includes(s.slot_id)} onChange={(e) => handleCheckboxChange('slot_ids', s.slot_id, e.target.checked)} />
                                {s.name}
                            </label>
                        ))}
                        <button 
                            type="button"
                            onClick={() => setShowModal(true)} 
                            disabled={!canOpenModal}
                            className={`w-full py-4 rounded-xl font-bold transition ${canOpenModal ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}
                        >
                            確認へ
                        </button>
                    </div>
                )}
            </main>

            {/* モーダル */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl border border-gray-100 transform transition-all animate-scale-in overflow-hidden min-h-[300px] flex items-center">
                        {isCompleted ? (
                            <main className="w-full text-center animate-fade-in">
                                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">登録が完了しました</h2>
                                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                    新しい{labels[activeTab]}が<br />正常に保存されました。
                                </p>
                                <button type="button" onClick={handleResetForm} className="w-full py-4 bg-gray-950 hover:bg-gray-800 text-white rounded-xl font-bold shadow-md transition-all active:scale-95">
                                    続けて他のデータを登録する
                                </button>
                            </main>
                        ) : (
                            <div className="w-full">
                                <h3 className="text-lg font-bold text-center mb-6">登録内容の確認</h3>
                                <p className="text-sm text-gray-600 text-center mb-6">この内容で登録してもよろしいですか？</p>
                                <div className="space-y-2.5">
                                    <button onClick={handleSubmit} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all active:scale-[0.98]">
                                        登録する
                                    </button>
                                    <button onClick={() => setShowModal(false)} className="w-full py-2.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">
                                        修正する
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}