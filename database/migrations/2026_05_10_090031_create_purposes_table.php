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
        // 💡 目的マスタ（purposes）を作る正しい処理に修正します！
        Schema::create('purposes', function (Blueprint $table) {
            $table->id('purpose_id')->comment('目的ID'); // シーダー（MasterDataSeeder）の定義に合わせます
            $table->string('name')->comment('目的名');    // 「会議」「ダンス」などの目的名
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purposes');
    }
};