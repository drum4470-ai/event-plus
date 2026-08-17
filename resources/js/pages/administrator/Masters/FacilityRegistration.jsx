import React, { useState, useEffect } from 'react';
import api from '@/api';
import CommonModal from '@/Components/CommonModal';
import { calculateSimilarity } from "@/Utils/levenshtein";

export default function FacilityRegistration({ existingNames = [], onUpdate = () => {} , buildings = [] }) {
    console.log(existingNames);
    console.log(buildings);

    const [facilities, setFacilities] = useState(existingNames);
    const [formData, setFormData] = useState({ building_id: '' , name: ''});
    const [editData, setEditData] = useState({ building_id: '' ,name: ''});
    
    // モーダル用State管理
    const [confirmModal, setConfirmModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editSuccessModal, setEditSuccessModal] = useState(false);
    const [deleteFirstConfirm, setDeleteFirstConfirm] = useState(false);
    const [deleteSecondConfirm, setDeleteSecondConfirm] = useState(false);
    const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);
    
    const [editingItem, setEditingItem] = useState(null);
    const [duplicateError, setDuplicateError] = useState('');
    const [similarityWarning, setSimilarityWarning] = useState('');
    const [processing, setProcessing] = useState(false);



    const handleNameChange = (value) => {
        setFormData({ ...formData, name: value });
        setDuplicateError('');
        setSimilarityWarning('');
        if (!value.trim()) return;

        // 💡 「同じ建物ID」かつ「同じ施設名」のものが既に存在するかチェック
        const isDuplicate = facilities.some(
            f => String(f.building_id) === String(formData.building_id) && f.name === value
        );
        if (isDuplicate) {
            setDuplicateError('選択した建物内に同じ名前の施設が既に登録されています');
        }

        // 類似度チェックも同じ建物内に絞るとより親切です
        const sameBuildingFacilities = facilities.filter(
            f => String(f.building_id) === String(formData.building_id)
        );
        const similar = sameBuildingFacilities.filter(
            f => calculateSimilarity(f.name, value) > 0.7 && f.name !== value
        );
        if (similar.length > 0) {
            setSimilarityWarning(`似た名前が存在しています: ${similar.map(f => f.name).join(', ')}`);
        }
    };

    // 建物（select）が変更された時にも重複チェックを再評価できるようにする
    const handleBuildingChange = (buildingId) => {
        setFormData(prev => ({ ...prev, building_id: buildingId }));
        if (formData.name) {
            // 建物が変わったタイミングで重複エラーを再チェック
            const isDuplicate = facilities.some(
                f => String(f.building_id) === String(buildingId) && f.name === formData.name
            );
            if (isDuplicate) {
                setDuplicateError('選択した建物内に同じ名前の施設が既に登録されています');
            } else {
                setDuplicateError('');
            }
        }
    };

    const handleRegisterClick = () => {
        if (!formData.name) return alert('施設名を入力してください');
        if (duplicateError) return alert('入力内容に不備があります');
        setConfirmModal(true);
    };

    const handleConfirmRegister = async () => {
        setProcessing(true);
        try {
            const response = await api.post('/administrator/facilities', formData);
            onUpdate();
            setFacilities([...facilities, response.data]);
            setConfirmModal(false);
            setSuccessModal(true);
            setFormData({ name: '', building_id: '' });
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const handleConfirmEdit = async () => {
        setProcessing(true);
        try {
            const response = await api.put(`/administrator/facilities/${editingItem.facility_id}`, editData);
            onUpdate();
            setFacilities(facilities.map(b => b.facility_id === editingItem.facility_id ? response.data : b));
            setEditModal(false);
            setEditSuccessModal(true);
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const handleSecondDeleteConfirm = async () => {
        if (!editingItem || !editingItem.facility_id) return;
        setProcessing(true);
        try {
            await api.delete(`/administrator/facilities/${editingItem.facility_id}`);
            onUpdate();
            setFacilities(facilities.filter(b => b.facility_id !== editingItem.facility_id));
            setDeleteSecondConfirm(false);
            setDeleteSuccessModal(true);
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4">施設マスタ</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">

                <select 
                    value={formData.building_id || ''} 
                    onChange={(e) => {
                        const selectedBuildingId = e.target.value;
                        setFormData(prev => ({ ...prev, building_id: selectedBuildingId }));
                        
                        // 建物変更時に、その建物内で同じ施設名が既に使われていないかリアルタイム再チェック
                        setDuplicateError('');
                        if (formData.name.trim() && selectedBuildingId) {
                            const isDuplicate = facilities.some(
                                f => String(f.building_id) === String(selectedBuildingId) && f.name === formData.name
                            );
                            if (isDuplicate) {
                                setDuplicateError('選択した建物内に同じ名前の施設が既に登録されています');
                            }
                        }
                    }} 
                    className="w-full p-3 border rounded-lg"
                >
                    <option value="">建物を選択してください</option>
                    {buildings?.map((building) => (
                        <option key={building.building_id} value={building.building_id}>
                            {building.name}
                        </option>
                    ))}
                </select>
                <input 
                    value={formData.name || ''} 
                    onChange={(e) => handleNameChange(e.target.value)} 
                    className="w-full p-3 border rounded-lg" 
                    placeholder="施設名" 
                />
                <button 
                    onClick={handleRegisterClick} 
                    disabled={processing} 
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                >
                    登録する
                </button>
            </div>

            <ul className="mt-6 bg-white rounded-lg border divide-y">
                {existingNames?.map((item, index) => (
                    <li 
                        key={item.id ?? index}
                        onClick={() => { 
                            setEditingItem(item); 
                            setEditData({name: item.name || '', building_id: item.building_id || ''}); 
                            setEditModal(true); 
                        }}
                        className="p-3 cursor-pointer hover:bg-blue-50 flex justify-between items-center"
                    >
                        <div className="font-bold">{item.name}</div>
                        <div className="font-gray">{item.buildings.name}</div>
                    </li>
                ))}
            </ul>

            {/* モーダル群：既存のまま（Inertia非依存なので動作可能） */}
            <CommonModal isOpen={confirmModal} onClose={() => setConfirmModal(false)} onConfirm={handleConfirmRegister} title="確認" confirmText="OK">登録しますか？</CommonModal>
            <CommonModal isOpen={successModal} onClose={() => setSuccessModal(false)} onConfirm={() => setSuccessModal(false)} showCancel={false} title="完了" confirmText="OK">登録しました。</CommonModal>
            {/* 編集モーダル内 */}
            <CommonModal isOpen={editModal} onClose={() => setEditModal(false)} onConfirm={handleConfirmEdit} onDelete={() => { setEditModal(false); setDeleteFirstConfirm(true); }} title="編集" confirmText="保存">
                <select 
                    value={editData.building_id || ''} 
                    onChange={(e) => setEditData(prev => ({ ...prev, building_id: e.target.value }))} 
                    className="w-full p-2 border"
                >
                    <option value="">所属する建物名</option>
                    {buildings?.map((building) => (
                        <option key={building.building_id} value={building.building_id}>
                            {building.name}
                        </option>
                    ))}
                </select>
                <input 
                    value={editData.name} 
                    onChange={(e) => setEditData({...editData, name: e.target.value})} 
                    className="w-full p-2 border mt-2" 
                />
            </CommonModal>
            <CommonModal isOpen={deleteFirstConfirm} onClose={() => setDeleteFirstConfirm(false)} onConfirm={() => {setDeleteFirstConfirm(false); setDeleteSecondConfirm(true);}} title="削除確認" confirmText="次へ" isDanger>本当に削除しますか？</CommonModal>
            <CommonModal isOpen={deleteSecondConfirm} onClose={() => setDeleteSecondConfirm(false)} onConfirm={handleSecondDeleteConfirm} title="最終確認" confirmText="削除を実行" isDanger>元に戻せません。</CommonModal>
            <CommonModal isOpen={deleteSuccessModal} onClose={() => {setDeleteSuccessModal(false); setEditingItem(null);}} onConfirm={() => {setDeleteSuccessModal(false); setEditingItem(null);}} showCancel={false} title="削除完了" confirmText="OK">削除しました。</CommonModal>
        </div>
    );
}