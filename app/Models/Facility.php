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
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class, 'building_id', 'building_id');
    }

    public function application(): HasMany
    {
        return $this->hasMany(Application::class, 'facility_id', 'facility_id');
    }
    public function facility_slot(): HasMany
    {
        return $this->hasMany(FacilitySlot::class, 'facility_id', 'facility_id');
    }
    public function facility_equipment(): HasMany
    {
        return $this->hasMany(FacilityEquipment::class, 'facility_id', 'facility_id');
    }
    public function purpose(): BelongsToMany
    {
        return $this->belongsToMany(Purpose::class, 'facility_purposes', 'facility_id', 'purpose_id');
    }
    public function equipment(): BelongsToMany
    {
        return $this->belongsToMany(Equipment::class, 'facility_equipment', 'facility_id', 'equipment_id');
    }
}
