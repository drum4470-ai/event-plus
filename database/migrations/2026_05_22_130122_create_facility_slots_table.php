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
        Schema::create('facility_slots', function (Blueprint $table) {
            $table->id('facility_slot_id')->comment('施設時間枠ID');
            // 施設への外部キー（これ経由で建物も特定できます）
            $table->foreignId('facility_id')->constrained('facilities', 'facility_id')->onDelete('cascade')->comment('施設ID');
            // 時間枠への外部キー
            $table->foreignId('slot_id')->constrained('slots', 'slot_id')->onDelete('cascade')->comment('時間枠ID');
            $table->timestamps();
            $table->unique(['facility_id', 'slot_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facility_slots');
    }
};