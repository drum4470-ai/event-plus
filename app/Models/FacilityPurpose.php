<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FacilityPurpose extends Model
{
    use HasFactory;

    protected $table = 'facility_purposes';

    protected $primaryKey = 'facility_purpose_id';

    protected $fillable = [
        'facility_id',
        'purpose_id'
    ];


    public function facilities(): BelongsTo
    {
        return $this->belongsTo(
            Facility::class,
            'facility_id',
            'facility_id'
        );
    }


    public function purposes(): BelongsTo
    {
        return $this->belongsTo(
            Purpose::class,
            'purpose_id',
            'purpose_id'
        );
    }
// もし自分自身ではなく、別の関連であればここを修正
    public function facilityPurposes(): HasMany
    {
        return $this->hasMany(
            FacilityPurpose::class,
            'facility_purpose_id', // 外部キー
            'facility_purpose_id'  // ローカルキー
        );
    }


    public function facilityPurposeEquipments(): HasMany
    {
        return $this->hasMany(
            FacilityPurposeEquipment::class,
            'facility_purpose_id',
            'facility_purpose_id'
        );
    }
}