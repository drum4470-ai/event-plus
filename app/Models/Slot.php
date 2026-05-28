<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Slot extends Model
{
    use HasFactory;

    // 💡 テーブル名「slots」はモデル名の標準複数形なので省略可能です
    // protected $table = 'slots';

    protected $primaryKey = 'slot_id';
    
    protected $fillable = [
        'name', // 例：午前、午後、夜間、コマ1、など
    ];

    // 💡 created_at / updated_at の日付キャストは標準機能なので省略
    protected $casts = [];

    /**
     * 💡 【施設との相互リンク】
     * この時間枠（例：午前）が、どの施設（部屋）で利用可能かを逆引きします。
     * ※Facility側の定義に合わせて中間テーブル名を 'building_facility_slots' に統一しています。
     */
    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class, 'building_facility_slots', 'slot_id', 'facility_id');
    }

    /**
     * この時間枠に関連する予約申請一覧を取得
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'slot_id', 'slot_id');
    }
}