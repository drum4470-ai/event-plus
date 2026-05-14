<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;


class Purpose extends Model
{
    protected $table = 'purposes';
    protected $primaryKey = 'purpose_id';
    protected $fillable = [
        'name',
    ];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function application(): HasMany
    {
        return $this->hasMany(Application::class, 'purpose_id', 'purpose_id');
    }
    public function equipment(): HasMany
    {
        return $this->hasMany(Equipment::class, 'purpose_id', 'purpose_id');
    }
    public function facility(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class, 'facility_purposes', 'purpose_id', 'facility_id');
    }
}
