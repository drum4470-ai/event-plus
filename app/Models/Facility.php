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


    public function buildings(): BelongsTo
    {
        return $this->belongsTo(
            Building::class,
            'building_id',
            'building_id'
        );
    }

    

    public function facilityPurposes(): HasMany
    {
        return $this->hasMany(
            FacilityPurpose::class,
            'facility_id',
            'facility_id'
        );
    }
    public function facilitySlots(): HasMany
    {
        return $this->hasMany(
            FacilitySlot::class,
            'facility_id',
            'facility_id'
        );
    }


    public function purposes(): BelongsToMany
    {
        return $this->belongsToMany(
            Purpose::class,
            'facility_purposes',
            'facility_id',
            'purpose_id'
        );
    }


    public function applications(): HasMany
    {
        return $this->hasMany(
            Application::class,
            'facility_id',
            'facility_id'
        );
    }


    public function slots(): BelongsToMany
    {
        return $this->belongsToMany(
            Slot::class,
            'facility_slots',
            'facility_id',
            'slot_id'
        );
    }
    
}