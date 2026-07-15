<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Purpose extends Model
{
    use HasFactory;

    protected $table = 'purposes';
    // protected $primaryKey = 'purpose_id';
    
    protected $fillable = [
        'name',
    ];

    protected $casts = [];

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'purpose_id', 'purpose_id');
    }

    public function buildingFacilityPurposes(): HasMany
    {
        return $this->hasMany(BuildingFacilityPurpose::class, 'purpose_id', 'purpose_id');
    }

    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class, 'building_facility_purposes', 'purpose_id', 'facility_id');
    }
}