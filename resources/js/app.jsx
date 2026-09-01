import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';


// 管理者
import AdministratorLogin from './Pages/Administrator/AdministratorLogin';
import AdministratorDashboard from './Pages/Administrator/AdministratorDashboard';
import MasterManagement from './Pages/Administrator/MasterManagement';
import FacilityRegistration from './Pages/Administrator/Masters/FacilityRegistration';
import BuildingRegistration from './Pages/Administrator/Masters/BuildingRegistration';
import PurposeRegistration from './Pages/Administrator/Masters/PurposeRegistration';
import EquipmentRegistration from './Pages/Administrator/Masters/EquipmentRegistration';
import SlotRegistration from './Pages/Administrator/Masters/SlotRegistration';
import RelationManagement from './Pages/Administrator/RelationManagement';
import FacilityPurposeEquipmentRelation from './Pages/Administrator/Relations/FacilityPurposeEquipmentRelation';
import FacilityPurposeRelation from './Pages/Administrator/Relations/FacilityPurposeRelation';
import FacilitySlotRelation from './Pages/Administrator/Relations/FacilitySlotRelation';
import AccountManagement from './Pages/Administrator/AccountManagement';
// ユーザー
import UserLogin from './Pages/User/UserLogin';
import UserDashboard from './Pages/User/UserDashboard';
import UserRegistration from './Pages/User/UserRegistration';
import ForgotPassword from './Pages/User/ForgotPassword';
import ResetPassword from '@/Pages/User/ResetPassword';



const App = () => (
    <BrowserRouter>
        <Routes>            
            <Route path="/administrator/login" element={<AdministratorLogin />} />
            <Route path="/administrator/dashboard" element={<AdministratorDashboard />} />
            <Route path="/administrator/master" element={<MasterManagement />}>
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
            <Route path="/administrator/account" element={<AccountManagement />} />

            {/* ユーザー */}
            <Route path="/login" element={<UserLogin />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/user-registration" element={<UserRegistration />} />
            {/* <Route path="/password-reset" element={<PasswordReset />} /> */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

        </Routes>
    </BrowserRouter>
);

const container = document.getElementById('app');
if (!window.root) {
    window.root = ReactDOM.createRoot(container);
}

// 2. 既存のルートを使ってレンダリングする
// console.log("レンダリング開始直前");
window.root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
// console.log("レンダリング実行完了");