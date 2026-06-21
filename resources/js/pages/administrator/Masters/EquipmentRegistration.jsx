import React, { useState } from 'react';
import api from '@/api'; // axiosインスタンス
import CommonModal from '@/Components/CommonModal';
import { calculateSimilarity } from "@/Utils/levenshtein";

export default function EquipmentRegistration({ existingNames = [], submitUrls = {} }) {
    const [confirmModal, setConfirmModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [editSuccessModal, setEditSuccessModal] = useState(false);
    const [deleteFirstConfirm, setDeleteFirstConfirm] = useState(false);
    const [deleteSecondConfirm, setDeleteSecondConfirm] = useState(false);
    const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);
    
    const [duplicateError, setDuplicateError] = useState('');
    const [similarityWarning, setSimilarityWarning] = useState('');
    const [registeredName, setRegisteredName] = useState('');
    const [processing, setProcessing] = useState(false);

    // useState に置き換え
    const [data, setData] = useState({ name: '' });
    const [editData, setEditData] = useState({ name: '' });

    // 入力値バリデーション
    const handleNameChange = (value) => {
        setData({ name: value });
        setDuplicateError('');
        setSimilarityWarning('');

        if (!value.trim()) return;

        const isDuplicate = existingNames.some(f => f.name === value);
        if (isDuplicate) {
            setDuplicateError('同じ名前の設備が既に登録されています');
            return;
        }

        const similarItems = existingNames.filter(f => {
            const similarity = calculateSimilarity(f.name, value);
            return similarity > 0.7 && f.name !== value;
        });

        if (similarItems.length > 0) {
            setSimilarityWarning(`似た名前が存在しています: ${similarItems.map(f => f.name).join(', ')}`);
        }
    };

    // 登録処理
    const handleConfirmRegister = async () => {
        setProcessing(true);
        try {
            await api.post(submitUrls.equipment_store || '/administrator/equipment', data);
            setConfirmModal(false);
            setRegisteredName(data.name);
            setSuccessModal(true);
            setData({ name: '' });
        } catch (err) {
            alert('登録に失敗しました');
        } finally {
            setProcessing(false);
        }
    };

    // 編集更新処理
    const handleConfirmEdit = async () => {
        setProcessing(true);
        try {
            const url = `${submitUrls.equipment_update || '/administrator/equipment'}/${editingItem.equipment_id}`;
            await api.put(url, editData);
            setEditModal(false);
            setEditSuccessModal(true);
        } catch (err) {
            alert('更新に失敗しました');
        } finally {
            setProcessing(false);
        }
    };

    // 削除処理
    const handleSecondDeleteConfirm = async () => {
        setProcessing(true);
        try {
            const url = `${submitUrls.equipment_update || '/administrator/equipment'}/${editingItem.equipment_id}`;
            await api.delete(url);
            setDeleteSecondConfirm(false);
            setDeleteSuccessModal(true);
        } catch (err) {
            alert('削除に失敗しました');
        } finally {
            setProcessing(false);
        }
    };

    // 戻り値部分は既存の JSX をそのまま使用可能（変数名の微調整のみ）
    // ... (以下、元の JSX をそのまま利用)
    // ※ 注意: input の onChange や モーダルの props を適宜 useState 用に調整してください
}