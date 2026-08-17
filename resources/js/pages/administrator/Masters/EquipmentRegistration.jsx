import React, { useState, useEffect } from 'react';
import api from '@/api';
import CommonModal from '@/Components/CommonModal';
import { calculateSimilarity } from "@/Utils/levenshtein";

export default function EquipmentRegistration({ existingNames = [], onUpdate = () => {} }) {
    const [equipments, setEquipments] = useState(existingNames);
    const [formData, setFormData] = useState({ name: ''});
    const [editData, setEditData] = useState({ name: ''});
    
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
        const isDuplicate = equipments.some(f => f.name === value);
        if (isDuplicate) setDuplicateError('同じ名前の付帯設備が既に登録されています');
        const similar = equipments.filter(f => calculateSimilarity(f.name, value) > 0.7 && f.name !== value);
        if (similar.length > 0) setSimilarityWarning(`似た名前が存在しています: ${similar.map(f => f.name).join(', ')}`);
    };

    const handleRegisterClick = () => {
        if (!formData.name) return alert('付帯設備名を入力してください');
        if (duplicateError) return alert('入力内容に不備があります');
        setConfirmModal(true);
    };

    const handleConfirmRegister = async () => {
        setProcessing(true);
        try {
            const response = await api.post('/administrator/equipment', formData);
            onUpdate();
            setEquipments([...equipments, response.data]);
            setConfirmModal(false);
            setSuccessModal(true);
            setFormData({ name: '' });
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const handleConfirmEdit = async () => {
        setProcessing(true);
        try {
            const response = await api.put(`/administrator/equipment/${editingItem.equipment_id}`, editData);
            onUpdate();
            setEquipments(equipments.map(b => b.equipment_id === editingItem.equipment_id ? response.data : b));
            setEditModal(false);
            setEditSuccessModal(true);
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const handleSecondDeleteConfirm = async () => {
        if (!editingItem || !editingItem.equipment_id) return;
        setProcessing(true);
        try {
            await api.delete(`/administrator/equipment/${editingItem.equipment_id}`);
            onUpdate();
            setEquipments(equipments.filter(b => b.equipment_id !== editingItem.equipment_id));
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
            <h2 className="text-xl font-bold mb-4">付帯設備マスタ</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <input 
                    value={formData.name || ''} 
                    onChange={(e) => handleNameChange(e.target.value)} 
                    className="w-full p-3 border rounded-lg" 
                    placeholder="付帯設備名" 
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
                        key={item.id ?? index} // idがなければindexを使う
                        onClick={() => { 
                            setEditingItem(item); 
                            setEditData({name: item.name}); 
                            setEditModal(true); 
                        }}
                        className="p-3 cursor-pointer hover:bg-blue-50"
                    >
                        <div className="font-bold">{item.name}</div>
                    </li>
                ))}
            </ul>

            {/* モーダル群：既存のまま（Inertia非依存なので動作可能） */}
            <CommonModal isOpen={confirmModal} onClose={() => setConfirmModal(false)} onConfirm={handleConfirmRegister} title="確認" confirmText="OK">登録しますか？</CommonModal>
            <CommonModal isOpen={successModal} onClose={() => setSuccessModal(false)} onConfirm={() => setSuccessModal(false)} showCancel={false} title="完了" confirmText="OK">登録しました。</CommonModal>
            <CommonModal isOpen={editModal} onClose={() => setEditModal(false)} onConfirm={handleConfirmEdit} onDelete={() => { setEditModal(false); setDeleteFirstConfirm(true); }} title="編集" confirmText="保存">
                <input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="w-full p-2 border" />
            </CommonModal>
            <CommonModal isOpen={deleteFirstConfirm} onClose={() => setDeleteFirstConfirm(false)} onConfirm={() => {setDeleteFirstConfirm(false); setDeleteSecondConfirm(true);}} title="削除確認" confirmText="次へ" isDanger>本当に削除しますか？</CommonModal>
            <CommonModal isOpen={deleteSecondConfirm} onClose={() => setDeleteSecondConfirm(false)} onConfirm={handleSecondDeleteConfirm} title="最終確認" confirmText="削除を実行" isDanger>元に戻せません。</CommonModal>
            <CommonModal isOpen={deleteSuccessModal} onClose={() => {setDeleteSuccessModal(false); setEditingItem(null);}} onConfirm={() => {setDeleteSuccessModal(false); setEditingItem(null);}} showCancel={false} title="削除完了" confirmText="OK">削除しました。</CommonModal>
        </div>
    );
}