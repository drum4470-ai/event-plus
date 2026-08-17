import React from "react";
import api from '@/api';

export default function FacilityPurposeEquipmentRelation({
    facilities = []
}) {

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">
                施設 × 利用目的 × 設備
            </h2>

            {facilities.map((facility) => (
                <div 
                    key={facility.facility_id}
                    className="mb-4 p-4 border rounded"
                >

                    <h3 className="font-bold">
                        {facility.name}
                    </h3>


                    {facility.facilityPurposes?.map((fp) => (
                        <div 
                            key={fp.id}
                            className="ml-4 mt-2"
                        >

                            <p>
                                利用目的：
                                {fp.purposes?.name}
                            </p>


                            {fp.facilityPurposeEquipments?.map((fpe) => (
                                <div
                                    key={fpe.id}
                                    className="ml-4"
                                >
                                    設備：
                                    {fpe.equipments?.name}
                                </div>
                            ))}

                        </div>
                    ))}

                </div>
            ))}

        </div>
    );
}