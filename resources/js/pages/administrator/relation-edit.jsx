import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function RelationEdit({ 
    buildings = [], 
    facilities = [], 
    relatedPurposes = [], 
    relatedEquipments = [], 
    relatedSlots = [],
    purposes = [],
    equipments = [],
    slots = []
}) {
    const [activeTab, setActiveTab] = useState('facility-purpose');
    const [selectedBuildingId, setSelectedBuildingId] = useState('');
    const [selectedFacilityId, setSelectedFacilityId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // フィルタリングロジック
    const filteredFacilities = useMemo(() => {
        if (!selectedBuildingId) return [];
        return facilities.filter(f => String(f.building_id) === String(selectedBuildingId));
    }, [selectedBuildingId, facilities]);

    const filteredData = useMemo(() => {
        if (!selectedFacilityId) return [];
        switch (activeTab) {
            case 'facility-purpose': return relatedPurposes.filter(p => String(p.facility_id) === String(selectedFacilityId));
            case 'equipment': return relatedEquipments.filter(e => String(e.facility_id) === String(selectedFacilityId));
            case 'slot': return relatedSlots.filter(s => String(s.facility_id) === String(selectedFacilityId));
            default: return [];
        }
    }, [activeTab, selectedFacilityId, relatedPurposes, relatedEquipments, relatedSlots]);

    // モーダル制御
    const openEditModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* ヘッダー（プレゼン資料のような美しいタイポグラフィ） */}
                <header className="border-l-4 border-indigo-600 pl-6 py-2">
                    <h1 className="text-3xl font-light text-gray-900 tracking-tight">紐付け設定の管理</h1>
                    <p className="text-gray-500 text-sm mt-1">施設ごとの目的、設備、および時間枠の最適化を行います。</p>
                </header>

                {/* 1. タブ選択 */}
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 max-w-md">
                    {['facility-purpose', 'equipment', 'slot'].map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => { setActiveTab(tab); setSelectedFacilityId(''); }}
                            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                                activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {tab === 'facility-purpose' ? '目的' : tab === 'equipment' ? '設備' : '時間枠'}
                        </button>
                    ))}
                </div>

                {/* 2. 選択エリア */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Building</label>
                        <select 
                            value={selectedBuildingId} 
                            onChange={(e) => { setSelectedBuildingId(e.target.value); setSelectedFacilityId(''); }} 
                            className="w-full p-4 bg-white border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-700 transition-all cursor-pointer"
                        >
                            <option value="">建物を選択してください</option>
                            {buildings?.map(b => <option key={b.building_id} value={b.building_id}>{b.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Facility</label>
                        <select 
                            value={selectedFacilityId} 
                            onChange={(e) => setSelectedFacilityId(e.target.value)} 
                            className="w-full p-4 bg-white border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-700 transition-all cursor-pointer disabled:opacity-50"
                            disabled={!selectedBuildingId}
                        >
                            <option value="">施設を選択してください</option>
                            {filteredFacilities.map(f => <option key={f.facility_id} value={f.facility_id}>{f.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* 3. 一覧リスト */}
                {selectedFacilityId && (
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <h3 className="font-bold text-gray-800 tracking-tight">登録済みの紐付け一覧</h3>
                            <span className="text-xs font-medium px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                                {filteredData.length} 件の登録
                            </span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {filteredData.length > 0 ? (
                                filteredData.map(item => (
                                    <div key={item.id} className="group flex justify-between items-center px-8 py-5 hover:bg-gray-50/80 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                                                {activeTab === 'facility-purpose' ? '🎯' : activeTab === 'equipment' ? '🛠️' : '🕒'}
                                            </div>
                                            <span className="text-gray-700 font-medium">
                                                {item.purpose?.name || item.name || '項目名なし'}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => openEditModal(item)} 
                                            className="opacity-0 group-hover:opacity-100 px-5 py-2 text-indigo-600 font-bold hover:bg-indigo-600 hover:text-white rounded-xl transition-all duration-300"
                                        >
                                            編集
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="px-8 py-12 text-center text-gray-400">
                                    <p className="text-sm">紐付けデータが見つかりません</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* 編集モーダル */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* 背景（オーバーレイ） */}
                    <div 
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300" 
                        onClick={() => setShowModal(false)}
                    ></div>
                    
                    {/* モーダルコンテンツ */}
                    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white/20 p-8 sm:p-10 transform animate-in zoom-in-95 duration-300">
                        <EditForm 
                            item={selectedItem} 
                            type={activeTab} 
                            purposes={purposes}
                            equipments={equipments}
                            slots={slots}
                            onClose={() => setShowModal(false)} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// 内部フォームコンポーネント
function EditForm({ item, type, purposes, equipments, slots, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        id: item?.id || '',
        name_id: item?.purpose_id || item?.equipment_id || item?.slot_id || '',
        // 目的タブの場合は、その目的のステータスなどもあればここに追加
    });

    const submit = (e) => {
        e.preventDefault();
        // ここでバックエンドの更新ルートへpost（例: route('relation.update')）
        post(route('relation.update', item.id), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <form onSubmit={submit} className="space-y-8">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">紐付けを編集</h3>
                <p className="text-sm text-gray-500">内容を確認して更新してください</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Selection</label>
                    <select 
                        value={data.name_id} 
                        onChange={e => setData('name_id', e.target.value)}
                        className="w-full p-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 text-gray-700"
                    >
                        {type === 'facility-purpose' && purposes.map(p => <option key={p.purpose_id} value={p.purpose_id}>{p.name}</option>)}
                        {type === 'equipment' && equipments.map(eq => <option key={eq.equipment_id} value={eq.equipment_id}>{eq.name}</option>)}
                        {type === 'slot' && slots.map(s => <option key={s.slot_id} value={s.slot_id}>{s.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
                <button 
                    disabled={processing}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {processing ? '更新中...' : 'データを更新する'}
                </button>
                <button 
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                >
                    キャンセル
                </button>
            </div>
        </form>
    );
}