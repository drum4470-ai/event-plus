<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacilitySlot extends Model
{
    use HasFactory;

    protected $table = 'facility_slots';


    protected $fillable = [
        'facility_id',
        'slot_id',
    ];

    protected $casts = [];


    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class, 'facility_id', 'facility_id');
    }

    /**
     * この時間枠設定の対象となっているマスターの「時間枠」を取得
     */
    public function slot(): BelongsTo
    {
        return $this->belongsTo(Slot::class, 'slot_id', 'slot_id');
    }
}