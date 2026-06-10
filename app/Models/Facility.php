<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Facility extends Model
{
    use HasFactory;

    protected $table = 'facilities';
    protected $primaryKey = 'facility_id';
    
    protected $fillable = [
        'name',
        'building_id',
    ];

    protected $casts = [];

    /**
     * 所属している「建物」を取得
     */
    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class, 'building_id', 'building_id');
    }    
    
    public function slots(): BelongsToMany
    {
        return $this->belongsToMany(Slot::class, 'building_facility_slots', 'facility_id', 'slot_id');
    }
        
    public function purposes(): BelongsToMany
    {
        return $this->belongsToMany(Purpose::class, 'building_facility_purposes', 'facility_id', 'purpose_id');
    }

    /**
     * この施設に対する予約申請一覧を取得
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'facility_id', 'facility_id');
    }

    /**
     * 施設に紐づく「施設-目的」の中間データ一覧を取得
    */
    public function buildingFacilityPurposes(): HasMany
    {
        return $this->hasMany(BuildingFacilityPurpose::class, 'facility_id', 'facility_id');
    }
         
    /**
     * 施設に紐づく「施設-時間枠」の中間データ一覧を取得
     */
    public function buildingFacilitySlots(): HasMany
    {
        return $this->hasMany(BuildingFacilitySlot::class, 'facility_id', 'facility_id');
    }
}