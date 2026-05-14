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
            $table->id('slot_id')->comment('時間枠ID');
            $table->foreignId('facility_id')->constrained('facilities', 'facility_id')->onDelete('cascade')->comment('施設ID');
            $table->string('name', 20)->comment('時間枠名');
            $table->timestamps();
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
