<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacilityPurposeEquipment extends Model
{
    use HasFactory;

    // 💡 新しいテーブル名を指定
    protected $table = 'facility_purpose_equipment';

    // 💡 主キーはデフォルトの 'id' を使うため、カスタム設定（$primaryKey）は不要なので削除しました

    protected $fillable = [
        'facility_purpose_id', // 💡 カラム名を変更
        'equipment_id', 
    ];

    protected $casts = [];

    /**
     * 親となる「施設×目的」の紐付けレコードを取得
     */
    public function facilityPurpose(): BelongsTo
    {
        return $this->belongsTo(
            FacilityPurpose::class, 
            'facility_purpose_id', // このテーブルの外部キー
            'id'                   // FacilityPurpose側の主キー
        );
    }

    /**
     * 紐づいているマスターの「設備（備品）」を取得
     */
    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class, 'equipment_id', 'equipment_id');
    }
}