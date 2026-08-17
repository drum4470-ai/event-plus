<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationComment extends Model
{
    use HasFactory;

    protected $table = 'application_comments';

    protected $primaryKey = 'comment_id';


    protected $fillable = [
        'application_id',
        'user_id',
        'body',
    ];


    public function applications(): BelongsTo
    {
        return $this->belongsTo(
            Application::class,
            'application_id',
            'application_id'
        );
    }


    public function users(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'user_id',
            'user_id'
        );
    }
}