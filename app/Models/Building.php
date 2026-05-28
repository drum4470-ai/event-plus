<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Building extends Model
{
    use HasFactory;

    // 💡 Laravelはモデル名の複数形（buildings）を自動認識するため、実はこの1行は省略可能です
    // protected $table = 'buildings'; 

    protected $primaryKey = 'building_id';
    
    protected $fillable = [
        'name',
        'address',
    ];

    // 💡 Laravel 10以降（2026年現在も含む）では、created_at / updated_at は標準で
    // 自動的にCarbon（datetime）インスタンスにキャストされるため、ここの明示的な指定は不要（削除可能）です
    protected $casts = [];

    /**
     * 建物に属する施設（部屋）一覧を取得
     */
    public function facilities(): HasMany
    {
        return $this->hasMany(Facility::class, 'building_id', 'building_id');
    }

    /**
     * 建物に紐づく「施設-目的」の中間データ一覧を取得
     * 画面で「建物を選ぶ ➔ その建物で可能な目的リストを絞り込む」ときに活躍します
     */
    public function buildingFacilityPurposes(): HasMany
    {
        return $this->hasMany(BuildingFacilityPurpose::class, 'building_id', 'building_id');
    }
}