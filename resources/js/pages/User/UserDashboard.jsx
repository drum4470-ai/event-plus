import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import UserDrawer from '@/Components/UserDrawer';

export default function UserDashboard() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ヘッダー等にドロワーを開くボタンを配置 */}
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="font-bold text-xl">ダッシュボード</h1>
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                >
                    メニューを開く
                </button>
            </header>

            <main className="p-6">
                {/* メインコンテンツ */}
            </main>

            {/* ドロワーコンポーネントを配置 */}
            <UserDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
            />
        </div>
        
    );
}