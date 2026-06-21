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
        Schema::create('applications', function (Blueprint $table) {
            $table->id()->comment('申請ID');
            $table->foreignId('user_id')->constrained('users', 'user_id')->onDelete('cascade')->comment('ユーザーID');
            $table->foreignId('facility_id')->constrained('facilities', 'facility_id')->onDelete('cascade')->comment('施設ID');
            $table->foreignId('slot_id')->constrained('facility_slots', 'slot_id')->onDelete('cascade')->comment('時間枠ID');

            $table->foreignId('equipment_id')->constrained('equipments', 'equipment_id')->onDelete('cascade')->comment('備品ID');
            $table->foreignId('purpose_id')->constrained('purposes', 'purpose_id')->onDelete('cascade')->comment('目的ID');
            $table->string('event_name')->comment('イベント名');
            $table->date('usage_date')->comment('利用日');
            $table->text('address')->comment('申請時住所');
            $table->string('telephone', 20)->comment('申請時電話番号');
            $table->unsignedInteger('status')->default(0)->comment('0:新規, 1:要対応, 2:確認中,3:承認済,4:実施済');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
