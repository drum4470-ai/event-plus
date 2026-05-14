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
        Schema::create('facility_purposes', function (Blueprint $table) {
            $table->id('facility_purpose_id')->comment('施設目的紐付け');
            $table->foreignId('facility_id')->constrained('facilities', 'facility_id')->onDelete('cascade')->comment('施設ID');
            $table->foreignId('purpose_id')->constrained('purposes', 'purpose_id')->onDelete('cascade')->comment('目的ID');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facility_purposes');
    }
};
