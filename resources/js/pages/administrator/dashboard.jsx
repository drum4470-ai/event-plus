import React, { useEffect, useState } from 'react';
// import api from '@/api';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {


   return (
        <div className="min-h-screen bg-gray-100 p-4 pb-12">
            {/* <Head /> の代わりに標準的な方法でタイトルを設定 */}
            <header className="py-6 mb-4">
                <h1 className="text-xl font-bold text-center text-gray-800">A2 ダッシュボード</h1>
            </header>

            <div className="max-w-md mx-auto space-y-6">
                
                <section className="space-y-3">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">管理者メニュー</h2>
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                        {/* react-router-dom の Link を使用 */}
                        <Link to="/administrator/account" className="flex items-center p-4 hover:bg-gray-50">
                            <span className="flex-1 font-medium">アカウント管理</span>
                            <span className="text-gray-400">＞</span>
                        </Link>
                        <Link to="/administrator/relation" className="flex items-center p-4 hover:bg-gray-50">
                            <span className="flex-1 font-medium">リレーション管理</span>
                            <span className="text-gray-400">＞</span>
                        </Link>
                        <Link to="/administrator/master" className="flex items-center p-4 hover:bg-gray-50">
                            <span className="flex-1 font-medium">マスタ管理</span>
                            <span className="text-gray-400">＞</span>
                        </Link>
                    </div>
                </section>

                {/* 他のセクションも同様に Link to="..." に変更 */}

            </div>
        </div>
    );
}