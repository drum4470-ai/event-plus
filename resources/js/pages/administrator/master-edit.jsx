import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import ErrorMessage from '@/Components/ErrorMessage';
import { useMasterValidation } from '@/Hooks/useMasterValidation'; // 💡 iport のタイポを修正

export default function MasterEdit({ auth, type, items = [], buildings = [] }) {
    // 現在選択中の編集対象ID（null の時は新規または未選択状態）
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // 各マスタの日本語ラベル
    const labels = {
        building: '建物',
        facility: '施設',
        slot: '時間枠',
        equipment: '付帯設備',
        purpose: '利用目的',
    };

    const currentLabel = labels[type] || 'マスタ';

    // Inertiaのフォーム管理
    const { data, setData, put, processing, errors, clearErrors } = useForm({
        type: type,
        name: '',
        address: '',       // 建物用
        building_id: '',   // 施設用
    });

    // 重複・類似チェック用の名前リスト作成
    const existingNames = items.filter(item => {
        const id = item.id || item.building_id || item.facility_id || item.slot_id || item.equipment_id || item.purpose_id;
        return id !== editingId;
    }).map(item => item.name);
    
    const { customError, isSimilar } = useMasterValidation(data.name, existingNames, currentLabel);

    // バリデーション判定
    const isError = customError && !isSimilar;
    const isNameValid = data.name.trim() !== '';
    const isAddressValid = type === 'building' ? (data.address && data.address.trim() !== '') : true;
    const isBuildingValid = type === 'facility' ? data.building_id !== '' : true;
    
    // 更新ボタンを押せる条件
    const canUpdate = editingId !== null && isNameValid && isAddressValid && isBuildingValid && !isError;

    // 📝 編集ボタンを押した時の処理
    const startEdit = (item) => {
        clearErrors();
        setEditingId(item.id || item.building_id || item.facility_id || item.slot_id || item.equipment_id || item.purpose_id);
        
        setData({
            type: type,
            name: item.name,
            address: item.address || '',
            building_id: item.building_id || '',
        });
    };

    // 🔄 キャンセルボタン
    const cancelEdit = () => {
        setEditingId(null);
        setData({ type, name: '', address: '', building_id: '' });
        clearErrors();
    };

        // 🚀 更新実行
    const handleConfirm = (e) => {
        e.preventDefault();
        if (!canUpdate) return;
        setShowModal(true); // 💡 モーダルを表示
    };

    // 2. 実際に更新を実行する処理（モーダル内のボタンから呼ぶ）
    const submit = () => {
        put(`/administrator/master-edit/${editingId}`, {
            onSuccess: () => {
                setShowModal(false);
                cancelEdit();
            }
        });
    };

    // 🗑️ 削除実行
    const handleDelete = (id) => {
        if (confirm(`本当にこの${currentLabel}を削除してもよろしいですか？\n※関連するデータも一緒に削除される場合があります。`)) {
            router.delete(`/administrator/master-edit/${id}`, {
                data: { type: type },
                onSuccess: () => {
                    if (editingId === id) cancelEdit();
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Head title={`${currentLabel}マスタ編集・一覧`} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ヘッダー */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">{currentLabel}マスタ管理</h1>
                        <p className="mt-2 text-sm text-gray-600">データの編集および削除を行えます</p>
                    </div>
                    <Link
                        href="/administrator/master-selection?mode=edit"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 bg-white px-4 py-2 rounded-xl border shadow-sm transition-all"
                    >
                        ← カテゴリ選択へ戻る
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* 🛠️ 左側：編集入力フォーム（カード） */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm sticky top-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            {editingId ? '選択中のデータを編集' : '編集するデータを選択してください'}
                        </h2>

                        {editingId ? (
                            <form onSubmit={handleConfirm} className="space-y-5">
                                {/* 名前入力 */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        {currentLabel}名
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 transition-all outline-none"
                                        placeholder={`新しい${currentLabel}名を入力`}
                                    />
                                    <ErrorMessage message={customError || errors.name} isSimilar={isSimilar} />
                                </div>

                                {/* 建物マスタ専用：住所欄 */}
                                {type === 'building' && (
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            住所
                                        </label>
                                        <input
                                            type="text"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 transition-all outline-none"
                                            placeholder="住所を入力"
                                        />
                                        {errors.address && <p className="text-xs text-red-500 mt-1">❌ {errors.address}</p>}
                                    </div>
                                )}

                                {/* 施設マスタ専用：所属建物選択プルダウン（💡 実装を追加） */}
                                {type === 'facility' && (
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            所属する建物
                                        </label>
                                        <select
                                            value={data.building_id}
                                            onChange={(e) => setData('building_id', e.target.value)}
                                            className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 transition-all outline-none bg-white"
                                        >
                                            <option value="">-- 建物を選んでください --</option>
                                            {buildings.map((b) => (
                                                <option key={b.id || b.building_id} value={b.id || b.building_id}>
                                                    {b.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.building_id && <p className="text-xs text-red-500 mt-1">❌ {errors.building_id}</p>}
                                    </div>
                                )}

                                {/* ボタンエリア */}
                                <div className="flex space-x-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-xl transition-all text-sm"
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!canUpdate || processing}
                                        className={`flex-1 py-3 text-white font-medium rounded-xl transition-all text-sm shadow-md ${
                                            canUpdate && !processing
                                                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
                                                : 'bg-gray-300 cursor-not-allowed shadow-none'
                                        }`}
                                    >
                                        {processing ? '更新中...' : '更新する'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                                <p className="text-sm text-gray-400">右側の一覧リストから<br />編集したいデータの「📝 編集」<br />ボタンを押してください。</p>
                            </div>
                        )}
                    </div>

                    {/* 📋 右側：登録済み一覧リスト */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-gray-900">登録済み{currentLabel}一覧</h2>
                            <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                                全 {items.length} 件
                            </span>
                        </div>

                        {items.length === 0 ? (
                            <div className="text-center py-20 text-gray-400 text-sm">
                                データが1件も登録されていません。
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                                {items.map((item) => {
                                    const id = item.id || item.building_id || item.facility_id || item.facility_slot_id || item.equipment_id || item.purpose_id;
                                    const isCurrentEditing = editingId === id;

                                    return (
                                        <div 
                                            key={id} 
                                            className={`p-5 flex items-center justify-between transition-colors ${
                                                isCurrentEditing ? 'bg-indigo-50/50' : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="space-y-1 pr-4">
                                                <div className="font-semibold text-gray-900 flex items-center gap-2">
                                                    {item.name}
                                                    {isCurrentEditing && (
                                                        <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-medium animate-pulse">
                                                            編集中
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {type === 'building' && item.address && (
                                                    <div className="text-xs text-gray-400">📍 {item.address}</div>
                                                )}
                                                {type === 'facility' && item.building && (
                                                    <div className="text-xs text-gray-400">🏢 所属: {item.building.name}</div>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-2 shrink-0">
                                                <button
                                                    onClick={() => startEdit(item)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 ${
                                                        isCurrentEditing
                                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                            : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-500 hover:text-indigo-600'
                                                    }`}
                                                >
                                                    📝 編集
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(id)}
                                                    className="px-3 py-1.5 bg-white text-red-600 border border-gray-200 hover:border-red-500 hover:bg-red-50 rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                                                >
                                                    🗑️ 削除
                                                </button>
                                                
                                            </div>
                                        </div>
                                    );
                                    
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* 背景レイヤー */}
                    <div 
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setShowModal(false)}
                    ></div>
                    
                    {/* モーダルコンテンツ */}
                    <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl border border-gray-100 transform transition-all">
                        <h2 className="text-lg font-bold text-center text-gray-800 mb-5">登録内容の確認</h2>
                        
                        <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100 space-y-4">
                            <div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{labels[type]}名</span>
                                <p className="text-xl font-bold text-gray-800 break-all mt-0.5">{data.name}</p>
                            </div>
                            
                            {type === 'building' && (
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">住所</span>
                                    <p className="text-sm font-semibold text-gray-600 break-all mt-0.5">{data.address}</p>
                                </div>
                            )}
                            
                            {type === 'facility' && (
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">所属建物</span>
                                    <p className="text-sm font-semibold text-gray-600 break-all mt-0.5">
                                        {buildings.find(b => String(b.id || b.building_id) === String(data.building_id))?.name || '未選択'}
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-2.5">
                            <button 
                                type="button" 
                                onClick={submit} 
                                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all active:scale-[0.98]"
                            >
                                この内容で登録する
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setShowModal(false)} 
                                className="w-full py-2.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none"
                            >
                                修正する
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}