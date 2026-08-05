<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facility_purposes', function (Blueprint $table) {
            $table->id('facility_purpose_id')->comment('施設目的ID');
            // 施設への外部キー
            $table->foreignId('facility_id')->constrained('facilities', 'facility_id')->onDelete('cascade')->comment('施設ID');
            // 目的への外部キー
            $table->foreignId('purpose_id')->constrained('purposes', 'purpose_id')->onDelete('cascade')->comment('目的ID');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facility_purposes');
    }
};
