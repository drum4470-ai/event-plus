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

            $table->id('facility_purpose_equipment_id')
                ->comment('施設目的設備ID');


            $table->foreignId('facility_purpose_id')
                ->comment('施設目的ID')
                ->constrained(
                    'facility_purposes',
                    'facility_purpose_id'
                )
                ->cascadeOnDelete();


            $table->foreignId('equipment_id')
                ->comment('設備ID')
                ->constrained(
                    'equipments',
                    'equipment_id'
                )
                ->cascadeOnDelete();


            $table->unique([
                'facility_purpose_id',
                'equipment_id'
            ]);


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