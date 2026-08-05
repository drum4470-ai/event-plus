<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacilityPurposeEquipment extends Model
{
    use HasFactory;

    protected $table = 'facility_purpose_equipment';

    protected $primaryKey = 'facility_purpose_equipment_id';

    protected $fillable = [
        'facility_purpose_id',
        'equipment_id',
    ];


    /**
     * 親となる「施設×目的」の紐付けレコード
     */
    public function facilityPurposes(): BelongsTo
    {
        return $this->belongsTo(
            FacilityPurpose::class,
            'facility_purpose_id',
            'facility_purpose_id'
        );
    }


    /**
     * 紐づいている設備マスタ
     */
    public function equipments(): BelongsTo
    {
        return $this->belongsTo(
            Equipment::class,
            'equipment_id',
            'equipment_id'
        );
    }
}