<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Building extends Model
{

    use HasFactory;
    protected $table = 'buildings';
    protected $primaryKey = 'building_id';
    
    protected $fillable = [
        'name',
        'address',
    ];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    public function facilitiy(): HasMany
    {
        return $this->hasMany(Facility::class, 'building_id', 'building_id');
    }
}