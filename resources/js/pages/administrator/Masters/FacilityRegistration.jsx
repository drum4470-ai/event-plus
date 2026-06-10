import React, { useState, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import CommonModal from '@/Components/CommonModal';
import { calculateSimilarity } from "../../../Utils/levenshtein";

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
    
    const { data, setData, post, reset, processing } = useForm({
        name: '',
        building_id: '',
    });

    const { data: editData, setData: setEditData, put, reset: resetEdit, processing: editProcessing } = useForm({
        name: '',
        building_id: '',
    });

    const { delete: destroy, processing: deleteProcessing } = useForm();

    const filteredFacilities = useMemo(() => {
        if (!selectedBuildingId) return existingNames;
        return existingNames.filter(f => String(f.building_id) === String(selectedBuildingId));
    }, [existingNames, selectedBuildingId]);

    // 入力値が変更されたときのバリデーション
    const handleNameChange = (value) => {
        setData('name', value);
        setDuplicateError('');
        setSimilarityWarning('');

        if (!value.trim()) return;

        // 完全一致をチェック
        const isDuplicate = filteredFacilities.some(f => f.name === value);
        if (isDuplicate) {
            setDuplicateError('同じ名前の施設が既に登録されています');
            return;
        }

        // 類似度をチェック
        const similarItems = filteredFacilities.filter(f => {
            const similarity = calculateSimilarity(f.name, value);
            return similarity > 0.7 && f.name !== value;
        });

        if (similarItems.length > 0) {
            setSimilarityWarning(`似た名前が存在しています: ${similarItems.map(f => f.name).join(', ')}`);
        }
    };

    // 登録確認ボタンクリック
    const handleRegisterClick = () => {
        if (!data.name || !data.building_id) {
            alert('施設名と建物を選択してください');
            return;
        }

        if (duplicateError) {
            alert('同じ名前の施設が既に存在しています。別の名前を入力してください。');
            return;
        }

        setConfirmModal(true);
    };

    // 登録確認OKボタンクリック
    const handleConfirmRegister = () => {
        const nameToSave = data.name;
        post(submitUrls.facility_store || '/administrator/facilities', {
            onSuccess: () => {
                setConfirmModal(false);
                setRegisteredName(nameToSave);
                setSuccessModal(true);
                reset();
                setData('building_id', selectedBuildingId);
                setDuplicateError('');
                setSimilarityWarning('');
            },
        });
    };

    // 成功モーダル閉じるときはモーダルを閉じるだけ
    const handleSuccessClose = () => {
        setSuccessModal(false);
    };

    // 編集モーダルを開く
    const handleEditClick = (item) => {
        setEditingItem(item);
        setEditData({
            name: item.name,
            building_id: item.building_id,
        });
        setEditModal(true);
    };

    // 編集確認
    const handleConfirmEdit = () => {
        const updateUrl = `${submitUrls.facility_update || '/administrator/facilities'}/${editingItem.facility_id}`;
        put(updateUrl, {
            onSuccess: () => {
                setEditModal(false);
                setEditSuccessModal(true);
                resetEdit();
            },
        });
    };

    // 編集成功モーダル閉じる
    const handleEditSuccessClose = () => {
        setEditSuccessModal(false);
        setEditingItem(null);
    };

    // 削除ボタンクリック（最初の確認）
    const handleDeleteClick = () => {
        setDeleteFirstConfirm(true);
    };

    // 最初の削除確認「本当に削除しますか？」
    const handleFirstDeleteConfirm = () => {
        setDeleteFirstConfirm(false);
        setDeleteSecondConfirm(true);
    };

    // 二次削除確認「本当に本当に削除しますか？」
    const handleSecondDeleteConfirm = () => {
        const deleteUrl = `${submitUrls.facility_update || '/administrator/facilities'}/${editingItem.facility_id}`;
        destroy(deleteUrl, {
            onSuccess: () => {
                setDeleteSecondConfirm(false);
                setDeleteSuccessModal(true);
                resetEdit();
            },
        });
    };

    // 削除成功モーダル閉じる
    const handleDeleteSuccessClose = () => {
        setDeleteSuccessModal(false);
        setEditModal(false);
        setEditingItem(null);
    };

    const buildingName = buildings.find(b => String(b.building_id || b.id) === String(selectedBuildingId))?.name;

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-4">施設マスタ</h2>
            
            {/* 入力フォーム */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <select 
                    className="w-full p-3 rounded-lg border border-gray-200"
                    value={selectedBuildingId}
                    onChange={(e) => {
                        const id = e.target.value;
                        setSelectedBuildingId(id);
                        setData('building_id', id);
                    }}
                >
                    <option value="">すべての建物を表示</option>
                    {buildings.map(b => (
                        <option key={b.building_id} value={b.building_id}>{b.name}</option>
                    ))}
                </select>

                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="施設名を入力"
                    className={`w-full p-3 rounded-lg border ${duplicateError ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                />
                {duplicateError && (
                    <p className="text-sm text-red-600 mt-2">❌ {duplicateError}</p>
                )}
                {similarityWarning && !duplicateError && (
                    <p className="text-sm text-orange-600 mt-2">⚠️ {similarityWarning}</p>
                )}

                <button 
                    onClick={handleRegisterClick}
                    disabled={processing || !!duplicateError}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    登録する
                </button>
            </div>
            
            {/* 一覧表示 */}
            <div className="mt-6">
                <h3 className="font-bold text-gray-700 mb-2">登録済み一覧</h3>
                <ul className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y">
                    {filteredFacilities.map((item) => {
                        const itemBuildingName = buildings.find(b => 
                            String(b.building_id || b.id) === String(item.building_id)
                        )?.name || '建物不明';

                        return (
                            <li 
                                key={item.facility_id} 
                                onClick={() => handleEditClick(item)}
                                className="p-3 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors"
                            >
                                <span>{item.name}</span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {itemBuildingName}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* 登録確認モーダル */}
            <CommonModal
                isOpen={confirmModal}
                onClose={() => setConfirmModal(false)}
                title="施設を登録してもよろしいですか？"
                confirmText="OK"
                cancelText="キャンセル"
                onConfirm={handleConfirmRegister}
                isLoading={processing}
            >
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-600">施設名</p>
                        <p className="font-semibold text-gray-900">{data.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">建物</p>
                        <p className="font-semibold text-gray-900">{buildingName}</p>
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
                {/* data.name ではなく、保存した registeredName を使う */}
                <p className="text-gray-700">施設「{registeredName}」を登録しました。</p>
            </CommonModal>

            {/* 編集モーダル */}
            <CommonModal
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                title="施設情報を編集"
                confirmText="編集確認"
                cancelText="キャンセル"
                onConfirm={handleConfirmEdit}
                onDelete={handleDeleteClick}
                isLoading={editProcessing}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">施設名</label>
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData('name', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">建物</label>
                        <select
                            value={editData.building_id}
                            onChange={(e) => setEditData('building_id', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">選択してください</option>
                            {buildings.map(b => (
                                <option key={b.building_id} value={b.building_id}>{b.name}</option>
                            ))}
                        </select>
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
                <p className="text-gray-700">施設「{editingItem?.name}」を編集しました。</p>
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
                        施設「<span className="font-bold text-red-600">{editingItem?.name}</span>」を削除します。
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
                <p className="text-gray-700">施設「{editingItem?.name}」を削除しました。</p>
            </CommonModal>
        </div>
    );
}
