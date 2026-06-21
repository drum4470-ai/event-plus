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
    isDanger = false,
    showCancel = true, // 追加
    showConfirm = true // 追加
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                </div>
                <div className="px-6 py-4">{children}</div>
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 justify-between items-center">
                    {onDelete && (
                        <button onClick={onDelete} disabled={isLoading} className="px-4 py-2 text-white bg-orange-600 hover:bg-orange-700 rounded-lg">
                            削除
                        </button>
                    )}
                    
                    <div className="flex gap-3 ml-auto">
                        {showCancel && (
                            <button onClick={onClose} disabled={isLoading} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg">
                                {cancelText}
                            </button>
                        )}
                        {showConfirm && (
                            <button 
                                onClick={onConfirm || onClose} // onConfirmがなければ閉じるボタンとして機能
                                disabled={isLoading}
                                className={`px-4 py-2 text-white rounded-lg ${isDanger ? 'bg-red-600' : 'bg-blue-600'}`}
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