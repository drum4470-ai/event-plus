import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 各ページコンポーネントをインポート（パスは実際の構成に合わせてください）
import Login from './Pages/Administrator/Login';
import MasterManagement from './Pages/Administrator/MasterManagement';

const rootElement = document.getElementById('app');

if (rootElement) {
    createRoot(rootElement).render(
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    {/* React Router によるルーティング設定 */}
                    <Route path="/administrator/login" element={<Login />} />
                    <Route path="/administrator/master" element={<MasterManagement />} />
                    
                    {/* デフォルトのリダイレクトなど */}
                    <Route path="/" element={<Navigate to="/administrator/login" replace />} />
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
}