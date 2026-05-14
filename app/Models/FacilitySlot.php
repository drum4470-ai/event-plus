<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FacilitySlot extends Model
{
    use HasFactory;
    protected $table = 'facility_slots';
    protected $primaryKey = 'slot_id';
    protected $fillable = [
        'facility_id',
        'name',
    ];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class, 'facility_id', 'facility_id');
    }
    public function application(): HasMany
    {
        return $this->hasMany(Application::class, 'slot_id', 'slot_id');
    }
}
