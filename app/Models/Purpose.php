<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Purpose extends Model
{
    use HasFactory;

    protected $primaryKey = 'purpose_id';
    
    protected $fillable = [
        'name',
    ];

    protected $casts = [];

    /**
     * この利用目的に関連する予約申請一覧を取得
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'purpose_id', 'purpose_id');
    }

    /**
     * 目的が紐づいている「建物-施設-目的」の中間データ一覧を取得
     */
    public function buildingFacilityPurposes(): HasMany
    {
        return $this->hasMany(BuildingFacilityPurpose::class, 'purpose_id', 'purpose_id');
    }

    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class, 'building_facility_purposes', 'purpose_id', 'facility_id');
    }
}