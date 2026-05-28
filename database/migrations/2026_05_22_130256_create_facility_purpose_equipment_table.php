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
        // 💡 テーブル名を 'facility_purpose_equipment' に変更
        Schema::create('facility_purpose_equipment', function (Blueprint $table) {
            $table->id()->comment('施設目的設備ID');
            
            // 💡 施設IDと目的IDをバラバラに持つのではなく、親である『facility_purposeのID』を1つだけ持ちます！
            $table->foreignId('facility_purpose_id')->comment('施設目的ID');
            
            // 💡 あとは紐付ける『設備ID』があれば完璧です！
            $table->foreignId('equipment_id')->comment('設備ID');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facility_purpose_equipment');
    }
};