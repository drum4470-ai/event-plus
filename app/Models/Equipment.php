<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Equipment extends Model
{
    use HasFactory;


    protected $table = 'equipment';
    // protected $primaryKey = 'equipment_id';
    
    protected $fillable = [
        'name',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * 💡 注目：古い目的（purpose）関連のリレーションはここには書かない！
     * 「どの設備がどの施設・目的で使えるか」は、新しく作った中間モデル
     * 『FacilityPurposeEquipment』側から繋ぎにいくため、
     * このマスターモデル側はこれだけで驚くほどスッキリして正解です。
     */

    /**
     * 予約（申請）に紐づく設備（※もし予約機能で使うなら残してOKです！）
     */
    public function applications(): BelongsToMany
    {
        // 💡 メソッド名をLaravelの習慣に合わせて複数形「applications」に微調整しました
        return $this->belongsToMany(Application::class, 'application_equipment', 'equipment_id', 'application_id');
    }
}