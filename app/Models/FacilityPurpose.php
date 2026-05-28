<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class FacilityPurpose extends Model
{
    use HasFactory;

    // 💡 テーブル名を設定（マイグレーションで設定した名前に合わせます）
    protected $table = 'facility_purposes';

    // 💡 マイグレーションで $table->id() としたので、カスタム主キーの指定は不要（デフォルトの 'id' を使うため削除）
    // protected $primaryKey = 'building_facility_purpose_id';

    protected $fillable = [
        'facility_id',
        'purpose_id',
    ];

    /**
     * 💡 建物リレーション（building()）はここからは削除します！
     * コントローラー側で「facility.building」と繋げて呼ぶことで、
     * 施設経由で建物データを安全に引っ張ってこれるようになります。
     */

    /**
     * この紐付けの対象となっている「施設（部屋）」を取得
     */
    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class, 'facility_id', 'facility_id');
    }

    /**
     * この紐付けの対象となっているマスターの「目的」を取得
     */
    public function purpose(): BelongsTo
    {
        return $this->belongsTo(Purpose::class, 'purpose_id', 'purpose_id');
    }

    /**
     * この「施設×目的」のペアに紐づいている設備設定（中間レコード）を全取得
     */
    public function facilityPurposeEquipments(): HasMany
    {
        return $this->hasMany(
            FacilityPurposeEquipment::class, 
            'facility_purpose_id', 
            'id' // 新しい中間テーブルの親ID
        );
    }

    /**
     * この「施設×目的」に紐づく設備マスタを一気に多対多で取得したい場合
     */
    public function equipments(): BelongsToMany
    {
        return $this->belongsToMany(
            Equipment::class,
            'facility_purpose_equipment', // 新しい中間テーブル名
            'facility_purpose_id',
            'equipment_id'
        );
    }
}