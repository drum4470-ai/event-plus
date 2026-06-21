import React, { useState } from 'react';
import api from '@/api';
import CommonModal from '@/Components/CommonModal';
import { calculateSimilarity } from "@/Utils/levenshtein";

export default function PurposeRegistration({ existingNames = [], submitUrls = {} }) {
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

    const handleNameChange = (value) => {
        setData({ name: value });
        setDuplicateError('');
        setSimilarityWarning('');

        if (!value.trim()) return;

        const isDuplicate = existingNames.some(f => f.name === value);
        if (isDuplicate) {
            setDuplicateError('同じ名前の利用目的が既に登録されています');
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
        if (!data.name) return;
        setProcessing(true);
        try {
            await api.post(submitUrls.purpose_store || '/administrator/purposes', data);
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
            const url = `${submitUrls.purpose_update || '/administrator/purposes'}/${editingItem.purpose_id}`;
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
            const url = `${submitUrls.purpose_update || '/administrator/purposes'}/${editingItem.purpose_id}`;
            await api.delete(url);
            setDeleteSecondConfirm(false);
            setDeleteSuccessModal(true);
        } catch (err) {
            alert('削除に失敗しました');
        } finally {
            setProcessing(false);
        }
    };

    // その他、JSX内の各ハンドラ引数を修正し、
    // inputのonChangeを以下のように更新してください：
    // onChange={(e) => handleNameChange(e.target.value)}
    // 編集側:
    // onChange={(e) => setEditData({ name: e.target.value })}
}