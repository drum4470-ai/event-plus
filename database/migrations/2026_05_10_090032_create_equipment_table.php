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
        Schema::create('equipment', function (Blueprint $table) {
            $table->id('equipment_id')->comment('備品ID');
            $table->string('name')->comment('備品名');
            $table->foreignId('purpose_id')->constrained('purposes', 'purpose_id')->onDelete('cascade')->comment('目的ID');
            $table->foreignId('facility_id')->constrained('facilities', 'facility_id')->onDelete('cascade')->comment('施設ID');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};
