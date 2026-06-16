import React, { useState } from 'react';
import axios from 'axios';
import CommonModal from '@/Components/CommonModal';
import { calculateSimilarity } from "@/Utils/levenshtein";

export default function BuildingRegistration({ existingNames = [] }) {
    // 1. 全てのデータをこのStateに集約します
    const [buildings, setBuildings] = useState(existingNames);
    const [formData, setFormData] = useState({ name: '', address: '' });
    const [editData, setEditData] = useState({ name: '', address: '' });
    
    // モーダル管理用のState
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

    // バリデーション処理
    const handleNameChange = (value) => {
        setFormData({ ...formData, name: value });
        setDuplicateError('');
        setSimilarityWarning('');

        if (!value.trim()) return;

        const isDuplicate = buildings.some(f => f.name === value);
        if (isDuplicate) {
            setDuplicateError('同じ名前の建物が既に登録されています');
            return;
        }

        const similarItems = buildings.filter(f => calculateSimilarity(f.name, value) > 0.7 && f.name !== value);
        if (similarItems.length > 0) {
            setSimilarityWarning(`似た名前が存在しています: ${similarItems.map(f => f.name).join(', ')}`);
        }
    };

    // 登録処理 (Axios)
    const handleConfirmRegister = async () => {
        setProcessing(true);
        try {
            const response = await axios.post('/api/administrator/buildings', formData);
            setBuildings([...buildings, response.data.data]);
            setConfirmModal(false);
            setSuccessModal(true);
            setFormData({ name: '', address: '' });
        } catch (error) {
            if (error.response?.status === 422) setDuplicateError('入力内容に不備があります');
        } finally {
            setProcessing(false);
        }
    };

    // 編集処理 (Axios)
    const handleConfirmEdit = async () => {
        setProcessing(true);
        try {
            const response = await axios.put(`/api/administrator/buildings/${editingItem.building_id}`, editData);
            setBuildings(buildings.map(b => b.building_id === editingItem.building_id ? response.data.data : b));
            setEditModal(false);
            setEditSuccessModal(true);
        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    // 削除処理 (Axios)
    const handleSecondDeleteConfirm = async () => {
        setProcessing(true);
        try {
            await axios.delete(`/api/administrator/buildings/${editingItem.building_id}`);
            setBuildings(buildings.filter(b => b.building_id !== editingItem.building_id));
            setDeleteSecondConfirm(false);
            setDeleteSuccessModal(true);
        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    // 編集ボタンクリック時にデータをセット
    const handleEditClick = (item) => {
        setEditingItem(item);
        setEditData({ name: item.name, address: item.address });
        setEditModal(true);
    };

    // ... (以下、成功時のクローズ処理やモーダル起動関数などは適宜追加)

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4">建物マスタ</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="建物名を入力"
                    className={`w-full p-3 rounded-lg border ${duplicateError ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                />
                {duplicateError && (
                    <p className="text-sm text-red-600 mt-2">❌ {duplicateError}</p>
                )}
                {similarityWarning && !duplicateError && (
                    <p className="text-sm text-orange-600 mt-2">⚠️ {similarityWarning}</p>
                )}

                <input
                    type="text"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="住所を入力"
                    className="w-full p-3 rounded-lg border border-gray-200"
                />

                <button 
                    onClick={handleRegisterClick}
                    disabled={processing || !!duplicateError}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    登録する
                </button>
            </div>
            
            <div className="mt-6">
                <h3 className="font-bold text-gray-700 mb-2">登録済み建物一覧</h3>
                <ul className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y">
                    {existingNames.length > 0 ? (
                        existingNames.map((item) => (
                            <li 
                                key={item.building_id} 
                                onClick={() => handleEditClick(item)}
                                className="p-3 cursor-pointer hover:bg-blue-50 transition-colors"
                            >
                                <div className="font-bold">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.address}</div>
                            </li>
                        ))
                    ) : (
                        <li className="p-3 text-gray-400">データがありません</li>
                    )}
                </ul>
            </div>

            {/* 登録確認モーダル */}
            <CommonModal
                isOpen={confirmModal}
                onClose={() => setConfirmModal(false)}
                title="建物を登録してもよろしいですか？"
                confirmText="OK"
                cancelText="キャンセル"
                onConfirm={handleConfirmRegister}
                isLoading={processing}
            >
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-600">建物名</p>
                        <p className="font-semibold text-gray-900">{data.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">住所</p>
                        <p className="font-semibold text-gray-900">{data.address}</p>
                    </div>
                    {similarityWarning && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-sm text-orange-700">⚠️ {similarityWarning}</p>
                        </div>
                    )}
                </div>
            </CommonModal>

            {/* 登録成功モーダル */}
            <CommonModal
                isOpen={successModal}
                onClose={handleSuccessClose}
                title="✓ 登録しました"
                cancelText="閉じる"
            >
                <p className="text-gray-700">建物「{registeredName}」を登録しました。</p>
            </CommonModal>

            {/* 編集モーダル */}
            <CommonModal
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                title="建物情報を編集"
                confirmText="編集確認"
                cancelText="キャンセル"
                onConfirm={handleConfirmEdit}
                onDelete={handleDeleteClick}
                isLoading={editProcessing}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">建物名</label>
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData('name', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">住所</label>
                        <input
                            type="text"
                            value={editData.address}
                            onChange={(e) => setEditData('address', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </CommonModal>

            {/* 編集成功モーダル */}
            <CommonModal
                isOpen={editSuccessModal}
                onClose={handleEditSuccessClose}
                title="✓ 編集しました"
                cancelText="閉じる"
            >
                <p className="text-gray-700">建物「{editingItem?.name}」を編集しました。</p>
            </CommonModal>

            {/* 最初の削除確認モーダル */}
            <CommonModal
                isOpen={deleteFirstConfirm}
                onClose={() => setDeleteFirstConfirm(false)}
                title="⚠️ 本当に削除しますか？"
                confirmText="削除する"
                cancelText="キャンセル"
                onConfirm={handleFirstDeleteConfirm}
                isLoading={deleteProcessing}
                isDanger={true}
            >
                <div className="space-y-3">
                    <p className="text-gray-700">
                        建物「<span className="font-bold text-red-600">{editingItem?.name}</span>」を削除します。
                    </p>
                    <p className="text-sm text-gray-600">
                        この操作は取り消せません。本当に削除してもよろしいですか？
                    </p>
                </div>
            </CommonModal>

            {/* 二次削除確認モーダル */}
            <CommonModal
                isOpen={deleteSecondConfirm}
                onClose={() => setDeleteSecondConfirm(false)}
                title="⚠️ 最終確認：本当に削除しますか？"
                confirmText="確定して削除"
                cancelText="キャンセル"
                onConfirm={handleSecondDeleteConfirm}
                isLoading={deleteProcessing}
                isDanger={true}
            >
                <div className="space-y-3">
                    <p className="text-gray-700 font-bold">
                        本当に本当に削除してもよろしいですか？
                    </p>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">
                            「<span className="font-bold">{editingItem?.name}</span>」は削除されます。
                        </p>
                    </div>
                </div>
            </CommonModal>

            {/* 削除成功モーダル */}
            <CommonModal
                isOpen={deleteSuccessModal}
                onClose={handleDeleteSuccessClose}
                title="✓ 削除しました"
                cancelText="閉じる"
            >
                <p className="text-gray-700">建物「{editingItem?.name}」を削除しました。</p>
            </CommonModal>
        </div>
    );
}
