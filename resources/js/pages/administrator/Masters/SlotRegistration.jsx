import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import CommonModal from '@/Components/CommonModal';
import { calculateSimilarity } from "../../../Utils/levenshtein";


export default function SlotRegistration({ existingNames = [], submitUrls = {} }) {
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
        start_time: '',
        end_time: '',
    });

    const { data: editData, setData: setEditData, put, reset: resetEdit, processing: editProcessing } = useForm({
        name: '',
        start_time: '',
        end_time: '',
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
            setDuplicateError('同じ名前の時間帯が既に登録されています');
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
        if (!data.name || !data.start_time || !data.end_time) {
            alert('時間帯の名称と開始時間、終了時間を入力してください');
            return;
        }

        if (duplicateError) {
            alert('同じ名前の時間帯が既に存在しています。別の名前を入力してください。');
            return;
        }

        setConfirmModal(true);
    };

    // 登録確認OKボタンクリック
    const handleConfirmRegister = () => {
        const nameToSave = data.name;
        post(submitUrls.slot_store || '/administrator/slots', {
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
            start_time: item.start_time,
            end_time: item.end_time,
        });
        setEditModal(true);
    };

    // 編集確認
    const handleConfirmEdit = () => {
        const updateUrl = `${submitUrls.slot_update || '/administrator/slots'}/${editingItem.slot_id}`;
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
        const deleteUrl = `${submitUrls.slot_update || '/administrator/slots'}/${editingItem.slot_id}`;
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
            <h2 className="text-xl font-bold mb-4">時間帯マスタ</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="時間帯の名称（例：午前）"
                    className="w-full p-3 rounded-lg border border-gray-200"
                />
                
                <div className="flex gap-4">
                    <input
                        type="time"
                        value={data.start_time}
                        onChange={(e) => setData('start_time', e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200"
                    />
                    <span className="self-center">〜</span>
                    <input
                        type="time"
                        value={data.end_time}
                        onChange={(e) => setData('end_time', e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200"
                    />
                </div>

                <button 
                    onClick={handleRegisterClick}
                    disabled={processing}
                    className="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    登録する
                </button>
            </div>
            
            <div className="mt-6">
                <h3 className="font-bold text-gray-700 mb-2">登録済み時間帯一覧</h3>
                <ul className="bg-white rounded-lg shadow-sm border border-gray-100 divide-y">
                    {existingNames.length > 0 ? (
                        existingNames.map((item) => (
                            <li 
                                key={item.slot_id} 
                                onClick={() => handleEditClick(item)}
                                className="p-3 flex justify-between cursor-pointer hover:bg-blue-50 transition-colors"
                            >
                                <span>{item.name}</span>
                                <span className="text-gray-500">
                                    {item.start_time} 〜 {item.end_time}
                                </span>
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
                title="時間帯を登録してもよろしいですか？"
                confirmText="OK"
                cancelText="キャンセル"
                onConfirm={handleConfirmRegister}
                isLoading={processing}
            >
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-600">時間帯名</p>
                        <p className="font-semibold text-gray-900">{data.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">時間</p>
                        <p className="font-semibold text-gray-900">{data.start_time} 〜 {data.end_time}</p>
                    </div>
                </div>
            </CommonModal>

            {/* 登録成功モーダル */}
            <CommonModal
                isOpen={successModal}
                onClose={handleSuccessClose}
                title="✓ 登録しました"
                cancelText="閉じる"
            >
                <p className="text-gray-700">時間帯「{data.name}」を登録しました。</p>
            </CommonModal>

            {/* 編集モーダル */}
            <CommonModal
                isOpen={editModal}
                onClose={() => setEditModal(false)}
                title="時間帯情報を編集"
                confirmText="編集確認"
                cancelText="キャンセル"
                onConfirm={handleConfirmEdit}
                onDelete={handleDeleteClick}
                isLoading={editProcessing}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">時間帯名</label>
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData('name', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">開始時間</label>
                        <input
                            type="time"
                            value={editData.start_time}
                            onChange={(e) => setEditData('start_time', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">終了時間</label>
                        <input
                            type="time"
                            value={editData.end_time}
                            onChange={(e) => setEditData('end_time', e.target.value)}
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
                <p className="text-gray-700">時間帯「{editingItem?.name}」を編集しました。</p>
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
                        時間帯「<span className="font-bold text-red-600">{editingItem?.name}</span>」を削除します。
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
                <p className="text-gray-700">時間帯「{editingItem?.name}」を削除しました。</p>
            </CommonModal>
        </div>
    );
}
