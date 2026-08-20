import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';
import api from '@/api';

// ページコンポーネントをインポート

import Login from './Pages/Administrator/Login';
import Dashboard from './Pages/Administrator/Dashboard';

import MasterManagement from './Pages/Administrator/MasterManagement';
import FacilityRegistration from './Pages/Administrator/Masters/FacilityRegistration';
import BuildingRegistration from './Pages/Administrator/Masters/BuildingRegistration';
import PurposeRegistration from './Pages/Administrator/Masters/PurposeRegistration';
import EquipmentRegistration from './Pages/Administrator/Masters/EquipmentRegistration';
import SlotRegistration from './Pages/Administrator/Masters/SlotRegistration';
// 他のページも同様にインポート
import RelationManagement from './Pages/Administrator/RelationManagement';
import FacilityPurposeEquipmentRelation from './Pages/Administrator/Relations/FacilityPurposeEquipmentRelation';
import FacilityPurposeRelation from './Pages/Administrator/Relations/FacilityPurposeRelation';
import FacilitySlotRelation from './Pages/Administrator/Relations/FacilitySlotRelation';

import AccountManagement from './Pages/Administrator/AccountManagement';

const App = () => (
    <BrowserRouter>
        <Routes>

            <Route path="/" element={<Navigate to="/administrator/login" />} />
            
            {/* 画面一覧 */}
            <Route path="/administrator/login" element={<Login />} />
            <Route path="/administrator/dashboard" element={<Dashboard />} />
            <Route path="/administrator/master" element={<MasterManagement />}>
                {/* /master/facility-registration を子として定義 */}
                <Route path="facility-registration" element={<FacilityRegistration />} />
                <Route path="building-registration" element={<BuildingRegistration />} />
                <Route path="equipment-registration" element={<EquipmentRegistration />} />
                <Route path="purpose-registration" element={<PurposeRegistration />} />
                <Route path="slot-registration" element={<SlotRegistration />} />
            </Route>
            <Route path="/administrator/relation" element={<RelationManagement />}>
                <Route path="facilityPurpose-equipment-relation" element={<FacilityPurposeEquipmentRelation />} />
                <Route path="facility-purpose-relation" element={<FacilityPurposeRelation />} />
                <Route path="facility-slot-relation" element={<FacilitySlotRelation />} />
            </Route>
            <Route path="/administrator/account" element={<AccountManagement />}>

            </Route>
            
        </Routes>
    </BrowserRouter>
);

const container = document.getElementById('app');
if (!window.root) {
    window.root = ReactDOM.createRoot(container);
}

// 2. 既存のルートを使ってレンダリングする
console.log("レンダリング開始直前");
window.root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
console.log("レンダリング実行完了");