<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipment extends Model
{
    use HasFactory;


    protected $table = 'equipments';
    protected $primaryKey = 'equipment_id';
    
    protected $fillable = [
        'name',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    
    public function applications(): BelongsToMany
    {
      
        return $this->belongsToMany(Application::class);
    }

    public function facilityPurposeEquipments(): HasMany
    {
        return $this->hasMany(
            FacilityPurposeEquipment::class,
            'equipment_id',
            'equipment_id'
        );
    }
}