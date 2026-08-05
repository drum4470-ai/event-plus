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

    protected $primaryKey = 'purpose_id';

    protected $fillable = [
        'name',
    ];


    public function facilityPurposes(): HasMany
    {
        return $this->hasMany(
            FacilityPurpose::class,
            'purpose_id',
            'purpose_id'
        );
    }


    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(
            Facility::class,
            'facility_purposes',
            'purpose_id',
            'facility_id'
        );
    }


    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}