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
        Schema::create('facility_equipment', function (Blueprint $table) {
            $table->id('facility_equipment_id')->comment('施設備品紐付け');
            $table->foreignId('facility_id')->constrained('facilities', 'facility_id')->onDelete('cascade')->comment('施設ID');
            $table->foreignId('equipment_id')->constrained('equipments', 'equipment_id')->onDelete('cascade')->comment('備品ID');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facility_equipment');
    }
};
