import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function MasterRegistration({ auth, type = 'facility', existingNames = [], buildings = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [customError, setCustomError] = useState('');
    const [isSimilar, setIsSimilar] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        type: type,
        name: '',
        address: '',
        building_id: '',
    });

    const labels = {
        building: '建物',
        facility: '施設',
        slot: '時間枠',
        equipment: '付帯設備',
        purpose: '利用目的',
    };

    // 重複・類似チェック
    useEffect(() => {
        const inputName = data.name.trim();
        if (!inputName) {
            setCustomError('');
            setIsSimilar(false);
            return;
        }

      // 💡 facility の場合は「建物ID」も含めて比較するように修正
        const isExactMatch = existingNames.some(existing => 
            existing.name === inputName && existing.building_id === data.building_id
        );

        const similarMatch = existingNames.find(existing => 
            // 名前が似ているか、かつ「同じ建物内」であるかを確認
            existing.building_id === data.building_id && 
            (existing.name.includes(inputName) || inputName.includes(existing.name))
        );

        if (isExactMatch) {
            setCustomError(`この${labels[type]}名は既に登録されています。`);
            setIsSimilar(false);
        } else if (similarMatch) {
            setCustomError(`類似した${labels[type]}名（${similarMatch}）が既に登録されています。`);
            setIsSimilar(true);
        } else {
            setCustomError('');
            setIsSimilar(false);
        }
    }, [data.name, existingNames]);

    const isError = customError && !isSimilar;
    const isNameValid = data.name.trim() !== '';
    const isAddressValid = type === 'building' ? data.address.trim() !== '' : true;
    
    // 💡 施設マスタの場合は、建物の選択も必須条件に加える
    const isBuildingSelectValid = type === 'facility' ? data.building_id !== '' : true;
    
    const canOpenModal = isNameValid && isAddressValid && isBuildingSelectValid && !isError;

    const submit = (e) => {
        e.preventDefault();
        setShowModal(false);
        post('/administrator/master-registration', {
            onSuccess: () => {
                setIsSubmitted(true);
            },
        });
    };

    const handleResetForm = () => {
        reset(); // 💡 useFormの提供するreset()関数を使うことで安全に初期化
        setCustomError('');       
        setIsSimilar(false);      
        setIsSubmitted(false);    
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 pb-12 flex flex-col items-center justify-center">
            <Head title={`${labels[type]}マスタ入力`} />

            <header className="py-6 text-center mb-2">
                <h1 className="text-xl font-bold text-gray-800">{labels[type]}マスタ新規登録</h1>
            </header>

            {/* メインカードコンテナ */}
            <div className="w-full max-w-md relative min-h-[480px]">
                
                {/* 1. 通常の入力フォーム画面 */}
                {!isSubmitted ? (
                    <main className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition-all duration-300">
                        <div className="space-y-5 mb-6">
                            
                            {/* 名前入力 */}
                            <div>
                                <label htmlFor="master-name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
                                    新しい{labels[type]}名
                                </label>
                                <input
                                    type="text"
                                    id="master-name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder={`${labels[type]}名を入力`}
                                    className={`w-full p-3.5 rounded-xl border-2 transition-all outline-none text-gray-700 font-medium ${
                                        customError 
                                            ? (isSimilar ? 'border-amber-300 bg-amber-50 focus:border-amber-500' : 'border-red-300 bg-red-50 focus:border-red-500') 
                                            : 'border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500'
                                    }`}
                                    autoComplete="off"
                                />
                                {customError && (
                                    <p className={`text-xs mt-2 ml-1 font-medium ${isSimilar ? 'text-amber-600' : 'text-red-500'}`}>
                                        {isSimilar ? '⚠️ ' : '❌ '}{customError}
                                    </p>
                                )}
                            </div>

                            {/* 住所入力（建物のみ） */}
                            {type === 'building' && (
                                <div>
                                    <label htmlFor="building-address" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
                                        住所
                                    </label>
                                    <input
                                        type="text"
                                        id="building-address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="住所を入力してください"
                                        className="w-full p-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500 transition-all outline-none text-gray-700 font-medium"
                                        autoComplete="off"
                                    />
                                </div>
                            )}

                            {/* 建物選択（施設のみ） */}
                            {type === 'facility' && (
                                <div>
                                    <label htmlFor="facility-building" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
                                        所属建物
                                    </label>
                                    <select
                                        id="facility-building"
                                        value={data.building_id}
                                        onChange={(e) => setData('building_id', e.target.value)}
                                        className="w-full p-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500 transition-all outline-none text-gray-700 font-medium"
                                    >
                                        <option value="">-- 建物を選択してください --</option>
                                        {buildings.map((b) => (
                                            <option key={b.building_id} value={b.building_id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* 登録済みリスト */}
                            <div>
                                <p className="text-xs font-bold text-gray-400 mb-2 px-1 uppercase tracking-wider">
                                    登録済みの{labels[type]}一覧 ({existingNames.length}件)
                                </p>
                                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 border border-gray-100 rounded-xl p-2 bg-gray-50/50">
                                    {existingNames.length > 0 ? (
                                        type === 'facility' ? (
                                            Object.entries(
                                                existingNames
                                                    .filter(item => !data.building_id || String(item.building_id) === String(data.building_id))
                                                    .reduce((acc, item) => {
                                                        const buildingName = item.building_name || '建物不明';
                                                        if (!acc[buildingName]) acc[buildingName] = [];
                                                        acc[buildingName].push(item);
                                                        return acc;
                                                    }, {})
                                                ).map(([buildingName, facilities]) => (
                                                <div key={buildingName} className="mb-4">
                                                    {/* 💡 2. フィルタリング時は見出しをシンプルにするか条件分岐 */}
                                                    {facilities.map((f, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => setData('name', f.name)}
                                                            className={`w-full p-2.5 text-left rounded-lg border text-xs transition-all mb-1 ${
                                                                data.name === f.name 
                                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-sm' 
                                                                    : 'border-transparent bg-white hover:border-gray-200 text-gray-600 shadow-sm'
                                                            }`}
                                                        >
                                                            {f.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            ))
            
                                    ) : (
                                        // 💡 その他のマスタ（建物、用途など）は従来通り
                                        [...existingNames].sort((a, b) => a.localeCompare(b, 'ja')).map((name, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => setData('name', name)}
                                                className={`w-full p-2.5 text-left rounded-lg border text-xs transition-all ${
                                                    data.name === name ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-sm' : 'border-transparent bg-white hover:border-gray-200 text-gray-600 shadow-sm'
                                                }`}
                                            >
                                                {name}
                                            </button>
                                        ))
                                    )
                                ) : (
                                    <p className="text-center py-4 text-xs text-gray-400">登録されているデータはありません</p>
                                )}

                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            disabled={!canOpenModal || processing}
                            className={`w-full py-4 rounded-xl font-bold shadow-md transition-all active:scale-[0.98] ${
                                canOpenModal
                                    ? (isSimilar ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white')
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                            }`}
                        >
                            {isSimilar ? '重複の可能性を確認して次へ' : '登録内容を確認する'}
                        </button>
                        
                        <div className="mt-4 text-center">
                            <Link href="/administrator/master-selection" className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">
                                ← カテゴリ選択に戻る
                            </Link>
                        </div>
                    </main>
                ) : (
                    /* 2. 登録完了画面 */
                    <main className="w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center flex flex-col justify-center items-center absolute inset-0 animate-fade-in">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                        
                        <h2 className="text-xl font-bold text-gray-800 mb-2">登録が完了しました</h2>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            新しい{labels[type]}「<span className="font-semibold text-gray-700">{data.name}</span>」が<br />正常に保存されました。
                        </p>

                        <button
                            type="button"
                            onClick={handleResetForm}
                            className="w-full py-4 bg-gray-950 hover:bg-gray-800 text-white rounded-xl font-bold shadow-md transition-all active:scale-95"
                        >
                            続けて他のデータを登録する
                        </button>
                    </main>
                )}
            </div>

            {/* 3. モーダル確認画面 (Tailwind CSS 完全リプレイス版) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* 背景レイヤー */}
                    <div 
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setShowModal(false)}
                    ></div>
                    
                    {/* モーダルコンテンツ */}
                    <div className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl border border-gray-100 transform transition-all animate-scale-in">
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
                                        {/* 💡 安全な文字列キャスト比較に変更してクラッシュを完全に防止 */}
                                        {buildings.find(b => String(b.building_id) === String(data.building_id))?.name || '未選択'}
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