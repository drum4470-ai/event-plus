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
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id')->comment('ユーザーID');
            $table->string('name')->comment('氏名');
            $table->string('email')->unique()->comment('メールアドレス');
            $table->string('telephone', 20)->comment('電話番号');
            $table->string('password',4096 )->comment('パスワード');
            $table->string('address')->comment('住所');
            $table->string('company')->nullable()->comment('団体名');
            $table->integer('role')->default(0)->comment('権限レベル'); // 0 利用者, 1 担当者, 2 承認者, 3 管理者
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
