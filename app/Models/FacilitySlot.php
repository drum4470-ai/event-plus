<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacilitySlot extends Model
{
    use HasFactory;

    // 💡 新しいテーブル名を指定
    protected $table = 'facility_slots';

    // 💡 主キーを id にしたため、カスタム主キー（$primaryKey）の設定は削除

    protected $fillable = [
        'facility_id',
        'slot_id',
    ];

    protected $casts = [];

    /**
     * 💡 building() リレーションは、施設（facility）経由で
     * 取得できるため不要になったので削除しました！
     */

    /**
     * この時間枠設定が紐づいている「施設（部屋）」を取得
     */
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