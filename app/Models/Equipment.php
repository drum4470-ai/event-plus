<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Equipment extends Model
{
    use HasFactory;
    protected $table = 'equipment';
    protected $primaryKey = 'equipment_id';
    
    protected $fillable = [
        'name',
        'facility_id',
        'purpose_id',
    ];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function purpose(): BelongsTo
    {
        return $this->belongsTo(Purpose::class, 'purpose_id', 'purpose_id');
    }

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class, 'facility_id', 'facility_id');
    }
    public function equipment(): BelongsToMany
    {
        return $this->belongsToMany(Equipment::class, 'facility_equipment', 'equipment_id', 'facility_id');
    }
    public function application(): BelongsToMany
    {
        return $this->belongsToMany(Application::class, 'application_equipment', 'equipment_id', 'application_id');
    }
}
