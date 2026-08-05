<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacilitySlot extends Model
{
    use HasFactory;

    protected $table = 'facility_slots';

    protected $primaryKey = 'facility_slot_id';


    protected $fillable = [
        'facility_id',
        'slot_id',
    ];


    public function facilities(): BelongsTo
    {
        return $this->belongsTo(
            Facility::class,
            'facility_id',
            'facility_id'
        );
    }


    public function slots(): BelongsTo
    {
        return $this->belongsTo(
            Slot::class,
            'slot_id',
            'slot_id'
        );
    }
}