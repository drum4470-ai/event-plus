import React from 'react';

export default function CommonModal({ 
    isOpen, 
    onClose, 
    title, 
    children,
    confirmText = '確認',
    cancelText = 'キャンセル',
    onConfirm,
    onDelete,
    isLoading = false,
    isDanger = false
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                {/* ヘッダー */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                </div>

                {/* コンテンツ */}
                <div className="px-6 py-4">
                    {children}
                </div>

                {/* フッター */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 justify-between items-center">
                    {/* 左側：削除ボタン */}
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            disabled={isLoading}
                            className="px-4 py-2 text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            削除
                        </button>
                    )}
                    
                    {/* 右側：キャンセルと確認 */}
                    <div className="flex gap-3 ml-auto">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        {onConfirm && (
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                                    isDanger
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {isLoading ? '処理中...' : confirmText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}