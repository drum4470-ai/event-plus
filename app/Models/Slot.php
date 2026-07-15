<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Slot extends Model
{
    use HasFactory;

    protected $table = 'slots';
    // protected $primaryKey = 'slot_id';
    
    protected $fillable = [
        'name', // 例：午前、午後、夜間、コマ1、など
    ];

    protected $casts = [];

    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class, 'building_facility_slots', 'slot_id', 'facility_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'slot_id', 'slot_id');
    }
}