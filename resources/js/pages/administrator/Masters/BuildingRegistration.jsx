import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import CommonModal from '@/Components/CommonModal';
import { calculateSimilarity } from "../../../Utils/levenshtein";




export default function BuildingRegistration({ existingNames = [], submitUrls = {} }) {
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
        address: '',
    });

    const { data: editData, setData: setEditData, put, reset: resetEdit, processing: editProcessing } = useForm({
        name: '',
        address: '',
    });

    const { delete: destroy, processing: deleteProcessing } = useForm();

    // 入力値が変更されたときのバリデーション
    const handleNameChange = (value) => {
        setData('name', value);
        setDuplicateError('');
        setSimilarityWarning('');

        if (!value.trim()) return;

        // 完全一致をチェック
        const isDuplicate = existingNames.some(f => f.name === value);
        if (isDuplicate) {
            setDuplicateError('同じ名前の建物が既に登録されています');
            return;
        }

        // 類似度をチェック
        const similarItems = existingNames.filter(f => {
            const similarity = calculateSimilarity(f.name, value);
            return similarity > 0.7 && f.name !== value;
        });

        if (similarItems.length > 0) {
            setSimilarityWarning(`似た名前が存在しています: ${similarItems.map(f => f.name).join(', ')}`);
        }
    };

    // 登録確認ボタンクリック
    const handleRegisterClick = () => {
        if (!data.name) {
            alert('建物名を入力してください');
            return;
        }

        if (duplicateError) {
            alert('同じ名前の建物が既に存在しています。別の名前を入力してください。');
            return;
        }

        setConfirmModal(true);
    };

    // 登録確認OKボタンクリック
    const handleConfirmRegister = () => {
        const nameToSave = data.name;
        post(submitUrls.building_store || '/administrator/buildings', {
            onSuccess: () => {
                setConfirmModal(false);
                setRegisteredName(nameToSave);
                setSuccessModal(true);
                reset();
                setDuplicateError('');
                setSimilarityWarning('');
            },
        });
    };

    // 成功モーダル閉じる
    const handleSuccessClose = () => {
        setSuccessModal(false);
    };

    // 編集モーダルを開く
    const handleEditClick = (item) => {
        setEditingItem(item);
        setEditData({
            name: item.name,
            address: item.address,
        });
        setEditModal(true);
    };

    // 編集確認
    const handleConfirmEdit = () => {
        const updateUrl = `${submitUrls.building_update || '/administrator/buildings'}/${editingItem.building_id}`;
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

    // 削除ボタンクリック
    const handleDeleteClick = () => {
        setDeleteFirstConfirm(true);
    };

    // 最初の削除確認
    const handleFirstDeleteConfirm = () => {
        setDeleteFirstConfirm(false);
        setDeleteSecondConfirm(true);
    };

    // 二次削除確認
    const handleSecondDeleteConfirm = () => {
        const deleteUrl = `${submitUrls.building_update || '/administrator/buildings'}/${editingItem.building_id}`;
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
