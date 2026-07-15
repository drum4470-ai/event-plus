<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // これが必要です
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Hidden;

#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // HasApiTokens を追加

    // protected $primaryKey = 'user_id';

    protected $fillable = [
        'name',
        'email',
        'password',
        'telephone',
        'address',
        'company',
        'role',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    // リレーション定義はそのまま活かせます
    public function application(): HasMany
    {
        return $this->hasMany(Application::class, 'user_id', 'user_id');
    }

    public function application_equipment(): HasMany
    {
        return $this->hasMany(ApplicationEquipment::class, 'user_id', 'user_id');
    }

    public function password_reset(): HasMany
    {
        return $this->hasMany(PasswordReset::class, 'user_id', 'user_id');
    }
}
