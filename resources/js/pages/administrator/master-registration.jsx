import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { createPortal } from 'react-dom'; // インポート確認

export default function MasterRegistration({ auth, type, existingNames = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [customError, setCustomError] = useState('');
    const [isSimilar, setIsSimilar] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        type: type || 'facility',
        name: '',
    });

    const labels = {
        building: '建物',
        facility: '施設',
        slot: '時間枠',
        equipment: '付帯設備',
        purpose: '利用目的',
    };

    useEffect(() => {
        const inputName = data.name.trim();
        if (!inputName) {
            setCustomError('');
            setIsSimilar(false);
            return;
        }

        const isExactMatch = existingNames.includes(inputName);
        const similarMatch = existingNames.find(existing => 
            existing.includes(inputName) || inputName.includes(existing)
        );

        if (isExactMatch) {
            setCustomError(`この${labels[type]}名は既に登録されています。`);
            setIsSimilar(false);
        } else if (similarMatch) {
            setCustomError(`類似した${labels[type]}名（${similarMatch}）が既に登録されています。重複の可能性がありますが本当に登録しますか？`);
            setIsSimilar(true);
        } else {
            setCustomError('');
            setIsSimilar(false);
        }
    }, [data.name, existingNames]);

    const isError = customError && !isSimilar;
    const canOpenModal = data.name.trim() !== '' && !isError;

    const submit = (e) => {
        e.preventDefault();
        setShowModal(false);
        post('/administrator/master-registration', {
            onSuccess: () => {
                setData('name', '');
                alert('登録が完了しました');
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <Head title={`${labels[type]}マスタ入力`} />

            <header className="py-6 text-center">
                <h1 className="text-lg font-bold">A14 {labels[type]}マスタ入力</h1>
            </header>

            <main className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border">
                <div className="space-y-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            新しい{labels[type]}名を入力
                        </label>
                        <input
                            type="text"
                            id={`${labels[type]}-name`}
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={`${labels[type]}名を入力してください`}
                            className={`w-full p-4 rounded-xl border-2 transition-all outline-none ${
                                customError 
                                    ? (isSimilar ? 'border-orange-300 bg-orange-50' : 'border-red-300 bg-red-50') 
                                    : 'border-gray-100 focus:border-indigo-500'
                            }`}
                            autoComplete='off'
                        />
                        {customError && (
                            <p className={`text-xs mt-2 ml-1 ${isSimilar ? 'text-orange-600' : 'text-red-500'}`}>
                                {customError}
                            </p>
                        )}
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                        <p className="text-[10px] text-gray-400 mb-1 px-1 uppercase font-bold tracking-widest">登録済みリスト</p>
                        {existingNames.length > 0 ? (
                            [...existingNames]
                                .sort((a, b) => a.localeCompare(b, 'ja'))
                                .map((name, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setData('name', name)}
                                        className={`w-full p-3 text-left rounded-xl border transition-all text-sm ${
                                            data.name === name
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                                                : 'border-gray-100 hover:border-gray-200 text-gray-500'
                                        }`}
                                    >
                                        {name}
                                    </button>
                                ))
                        ) : (
                            <p className="text-center py-4 text-xs text-gray-400">データなし</p>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    disabled={!canOpenModal || processing}
                    className={`w-full py-4 rounded-xl font-bold shadow-md transition-all ${
                        canOpenModal
                            ? (isSimilar ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95')
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {isSimilar ? '注意を確認して次へ' : '登録内容を確認する'}
                </button>
            </main>

{/* モーダル確認画面 */}
{showModal && (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    }}>
        {/* 背景の暗転レイヤー */}
        <div 
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)'
            }}
            onClick={() => setShowModal(false)}
        ></div>

        {/* 中央のカード本体 */}
        <div 
            style={{
                position: 'relative',
                backgroundColor: 'white',
                width: '100%',
                maxWidth: '400px',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                display: 'block' // 下に並ばないように明示
            }}
            onClick={(e) => e.stopPropagation()} 
        >
            <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: '900', marginBottom: '24px' }}>
                登録内容の確認
            </h2>

            <div style={{ backgroundColor: '#f9fafb', padding: '24px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #f3f4f6' }}>
                <p style={{ fontSize: '24px', fontWeight: 'bold', wordBreak: 'break-all' }}>
                    {data.name}
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                    type="button"
                    onClick={submit}
                    style={{ width: '100%', padding: '16px', backgroundColor: '#4f46e5', color: 'white', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                >
                    この内容で登録する
                </button>
                <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    style={{ width: '100%', padding: '12px', color: '#9ca3af', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
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