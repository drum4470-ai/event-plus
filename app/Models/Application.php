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
    // protected $primaryKey = 'application_id';
    
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'application_id',
        'user_id',
        'facility_id',
        'equipment_id',
        'slot_id',
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
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class, 'facility_id', 'facility_id');
    }
    public function facility_slot(): BelongsTo
    {
        return $this->belongsTo(FacilitySlot::class, 'slot_id', 'slot_id');
    }
    public function purpose(): BelongsTo
    {
        return $this->belongsTo(Purpose::class, 'purpose_id', 'purpose_id');
        }
    public function application_comment(): HasMany
    {
        return $this->hasMany(ApplicationComment::class, 'application_id', 'application_id');
        }
    
    public function equipment(): BelongsToMany
    {
        return $this->belongsToMany(Equipment::class, 'application_equipment', 'application_id', 'equipment_id');
    }
        
        }
        