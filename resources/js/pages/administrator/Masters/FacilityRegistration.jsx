import React, { useState, useMemo } from 'react';
import api from '@/api'; // axiosインスタンス
import CommonModal from '@/Components/CommonModal';
import { calculateSimilarity } from "@/Utils/levenshtein";

export default function FacilityRegistration({ existingNames = [], buildings = [], submitUrls = {} }) {
    const [selectedBuildingId, setSelectedBuildingId] = useState('');
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
    const [data, setData] = useState({ name: '', building_id: '' });
    const [editData, setEditData] = useState({ name: '', building_id: '' });

    const filteredFacilities = useMemo(() => {
        if (!selectedBuildingId) return existingNames;
        return existingNames.filter(f => String(f.building_id) === String(selectedBuildingId));
    }, [existingNames, selectedBuildingId]);

    const handleNameChange = (value) => {
        setData(prev => ({ ...prev, name: value }));
        setDuplicateError('');
        setSimilarityWarning('');

        if (!value.trim()) return;

        const isDuplicate = filteredFacilities.some(f => f.name === value);
        if (isDuplicate) {
            setDuplicateError('同じ名前の施設が既に登録されています');
            return;
        }

        const similarItems = filteredFacilities.filter(f => {
            const similarity = calculateSimilarity(f.name, value);
            return similarity > 0.7 && f.name !== value;
        });

        if (similarItems.length > 0) {
            setSimilarityWarning(`似た名前が存在しています: ${similarItems.map(f => f.name).join(', ')}`);
        }
    };

    // 登録処理
    const handleConfirmRegister = async () => {
        if (!data.name || !data.building_id) {
            alert('施設名と建物を選択してください');
            return;
        }
        setProcessing(true);
        try {
            await api.post(submitUrls.facility_store || '/administrator/facilities', data);
            setConfirmModal(false);
            setRegisteredName(data.name);
            setSuccessModal(true);
            setData({ name: '', building_id: selectedBuildingId });
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
            const url = `${submitUrls.facility_update || '/administrator/facilities'}/${editingItem.facility_id}`;
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
            const url = `${submitUrls.facility_update || '/administrator/facilities'}/${editingItem.facility_id}`;
            await api.delete(url);
            setDeleteSecondConfirm(false);
            setDeleteSuccessModal(true);
        } catch (err) {
            alert('削除に失敗しました');
        } finally {
            setProcessing(false);
        }
    };

    // JSX内での各イベントハンドラ修正例
    // 入力フォームの建物選択:
    // onChange={(e) => { const id = e.target.value; setSelectedBuildingId(id); setData(prev => ({...prev, building_id: id})); }}
    // 編集フォームの建物選択:
    // onChange={(e) => setEditData(prev => ({...prev, building_id: e.target.value}))}
}