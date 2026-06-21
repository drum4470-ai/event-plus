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
        Schema::create('application_equipment', function (Blueprint $table) {
            $table->id()->comment('申請備品紐付け');
            $table->foreignId('application_id')->constrained('applications', 'application_id')->onDelete('cascade')->comment('申請ID');
            $table->foreignId('equipment_id')->constrained('equipments', 'equipment_id')->onDelete('cascade')->comment('備品ID');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_equipment');
    }
};
