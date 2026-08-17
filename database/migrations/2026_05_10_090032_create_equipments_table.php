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
        // 💡 ここが 'equipment' を作る正しい処理になっている必要があります！
        Schema::create('equipments', function (Blueprint $table) {
            $table->id('equipment_id')->comment('設備ID'); // シーダーに合わせて主キーは equipment_id
            $table->string('name')->comment('設備名');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipments');
    }
};