import React, { useState, useEffect, useCallback } from 'react';

import FacilityPurposeRelation from './Relations/FacilityPurposeRelation';
import FacilityPurposeEquipmentRelation from './Relations/FacilityPurposeEquipmentRelation';
import FacilitySlotRelation from './Relations/FacilitySlotRelation';

import api from '@/api';


export default function RelationManagement() {

    const [data, setData] = useState({
        facilities: [],
        purposes: [],
        equipments: [],
        slots: []
    });


    const [activeTab, setActiveTab] = useState('facility_purpose');


    const [loading, setLoading] = useState(true);



    // リレーションデータ取得
    const refreshData = useCallback(async () => {

        try {

            const response = await api.get('/administrator/relation');


            console.log('relation response', response.data);


            setData({
                facilities: response.data.facilities ?? []
            });


        } catch(error) {

            console.error(
                'Relation取得失敗:',
                error.response ?? error
            );

        }

    }, []);



    useEffect(() => {

        const init = async () => {

            await refreshData();

            setLoading(false);

        };


        init();

    }, [refreshData]);





    const tabs = [

        {
            id:'facility_purpose',
            label:'施設 × 利用目的'
        },

        {
            id:'facilityPurpose_equipment',
            label:'施設目的 × 備品'
        },

        {
            id:'facility_slot',
            label:'施設 × 時間枠'
        },

    ];




    const ComponentMap = {


        facility_purpose: () => (

            <FacilityPurposeRelation
                facilities={data.facilities}
                purposes={data.purposes}
                onUpdate={refreshData}
            />

        ),



        facilityPurpose_equipment: () => (

            <FacilityPurposeEquipmentRelation
                facilities={data.facilities}
                equipments={data.equipments}
                purposes={data.purposes}
                onUpdate={refreshData}
            />

        ),



        facility_slot: () => (

            <FacilitySlotRelation
                facilities={data.facilities}
                slots={data.slots}
                onUpdate={refreshData}
            />

        ),

    };




    if (loading) {

        return (
            <div className="p-8">
                読み込み中...
            </div>
        );

    }





    return (

        <div className="p-8">


            <h2 className="text-2xl font-bold mb-6">
                リレーション（紐付け）管理
            </h2>



            <div className="flex space-x-4 border-b mb-6">

                {tabs.map(tab => (

                    <button

                        key={tab.id}

                        onClick={() => setActiveTab(tab.id)}

                        className={`pb-2 px-4 font-bold transition-colors ${
                            
                            activeTab === tab.id

                            ? 'border-b-2 border-indigo-600 text-indigo-600'

                            : 'text-gray-400 hover:text-gray-600'

                        }`}

                    >

                        {tab.label}

                    </button>

                ))}


            </div>




            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">


                {
                    ComponentMap[activeTab]
                    ? ComponentMap[activeTab]()
                    : <div>選択してください</div>
                }


            </div>



        </div>

    );

}