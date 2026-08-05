<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 💡 時間枠マスタ（slots）を作る正しい処理に修正します！
        Schema::create('slots', function (Blueprint $table) {
            $table->id('slot_id')->comment('時間枠ID'); // シーダー（MasterDataSeeder）の定義に合わせます
            $table->string('name')->comment('時間枠名'); // 「午前」「午後」「夜間」などの枠名
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slots');
    }
};