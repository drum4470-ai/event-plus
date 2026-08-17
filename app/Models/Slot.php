<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Slot extends Model
{
    use HasFactory;

    protected $table = 'slots';

    protected $primaryKey = 'slot_id';

    protected $fillable = [
        'building_id',
        'name',
    ];


    public function buildings(): BelongsTo
    {
        return $this->belongsTo(
            Building::class,
            'building_id',
            'building_id'
        );
    }


    public function applications(): HasMany
    {
        return $this->hasMany(
            Application::class,
            'slot_id',
            'slot_id'
        );
    }

    public function facilitySlots(): BelongsToMany
    {
        return $this->belongsToMany(
            Facility::class,
            'facility_slots',
            'slot_id',
            'facility_id'
        );
    }
}