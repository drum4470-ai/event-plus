<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Application extends Model
{
    use HasFactory;

    protected $table = 'applications';

    protected $primaryKey = 'application_id';


    protected $fillable = [
        'user_id',
        'facility_id',
        'facility_slot_id',
        'purpose_id',
        'event_name',
        'usage_date',
        'address',
        'telephone',
        'status',
    ];


    protected $casts = [
        'usage_date' => 'date',
        'status' => 'integer',
    ];


    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }


    public function facilities(): BelongsTo
    {
        return $this->belongsTo(
            Facility::class,
            'facility_id',
            'facility_id'
        );
    }


    public function facilitySlots(): BelongsTo
    {
        return $this->belongsTo(
            FacilitySlot::class,
            'facility_slot_id',
            'facility_slot_id'
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


    public function applicationComments(): HasMany
    {
        return $this->hasMany(ApplicationComment::class);
    }
}

        