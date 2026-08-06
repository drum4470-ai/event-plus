<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; // 日付生成用
use Illuminate\Support\Facades\Hash;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('PRAGMA foreign_keys = OFF;');
        $now = Carbon::now();

        // 1. 既存データをクリア
        DB::table('facility_slots')->truncate(); 
        DB::table('facility_purpose_equipments')->truncate();
        DB::table('facility_purposes')->truncate();
        DB::table('facilities')->truncate();
        DB::table('slots')->truncate();
        DB::table('purposes')->truncate();
        DB::table('equipments')->truncate();
        DB::table('buildings')->truncate();

        // 2. 建物のサンプルデータ
        DB::table('buildings')->insert([
            ['building_id' => 1, 'name' => '神明いきいきプラザ', 'address' => '港区神明', 'created_at' => $now, 'updated_at' => $now],
            ['building_id' => 2, 'name' => '虎ノ門いきいきプラザ', 'address' => '港区虎ノ門', 'created_at' => $now, 'updated_at' => $now],
            ['building_id' => 3, 'name' => '三田いきいきプラザ', 'address' => '港区三田', 'created_at' => $now, 'updated_at' => $now],
        ]);

        // 3. 施設のサンプルデータ
        DB::table('facilities')->insert([
            ['facility_id' => 1,  'building_id' => 1, 'name' => '会議室A', 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 2,  'building_id' => 1, 'name' => '会議室B', 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 3,  'building_id' => 1, 'name' => '会議室C', 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 4,  'building_id' => 1, 'name' => '会議室D', 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 5,  'building_id' => 1, 'name' => '料理室', 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 6,  'building_id' => 1, 'name' => '体育館', 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 7,  'building_id' => 1, 'name' => 'ダンススタジオ', 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 8,  'building_id' => 1, 'name' => '音楽スタジオ', 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 9,  'building_id' => 2, 'name' => '会議室A', 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 10, 'building_id' => 3, 'name' => '会議室A', 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 11, 'building_id' => 3, 'name' => '会議室B', 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 12, 'building_id' => 3, 'name' => '料理室', 'created_at' => $now, 'updated_at' => $now],
        ]);

        // 4. 時間帯スロット
        DB::table('slots')->insert([
            ['slot_id' => 1, 'name' => '午前', 'created_at' => $now, 'updated_at' => $now],
            ['slot_id' => 2, 'name' => '午後', 'created_at' => $now, 'updated_at' => $now],
            ['slot_id' => 3, 'name' => '夜間', 'created_at' => $now, 'updated_at' => $now],
            ['slot_id' => 4, 'name' => '終日', 'created_at' => $now, 'updated_at' => $now],
        ]);

        // 5. 利用目的
        DB::table('purposes')->insert([
            ['purpose_id' => 1, 'name' => '会議', 'created_at' => $now, 'updated_at' => $now],
            ['purpose_id' => 2, 'name' => 'ダンス', 'created_at' => $now, 'updated_at' => $now],
            ['purpose_id' => 3, 'name' => 'バスケットボール', 'created_at' => $now, 'updated_at' => $now],
            ['purpose_id' => 4, 'name' => '茶道', 'created_at' => $now, 'updated_at' => $now],
        ]);

        // 6. 付帯設備
        DB::table('equipments')->insert([
            ['equipment_id' => 1, 'name' => 'マイク・スピーカー', 'created_at' => $now, 'updated_at' => $now],
            ['equipment_id' => 2, 'name' => 'バスケットボール', 'created_at' => $now, 'updated_at' => $now],
            ['equipment_id' => 3, 'name' => 'プロジェクター', 'created_at' => $now, 'updated_at' => $now],
            ['equipment_id' => 4, 'name' => 'ホワイトボード', 'created_at' => $now, 'updated_at' => $now],
        ]);

        // 7. 紐付けデータ（中間テーブルもタイムスタンプが必要な場合は追加）
        DB::table('facility_purposes')->insert([
            ['facility_id' => 1,  'purpose_id' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 7,  'purpose_id' => 2, 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 6,  'purpose_id' => 3, 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 9,  'purpose_id' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 9,  'purpose_id' => 4, 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 10, 'purpose_id' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 11, 'purpose_id' => 4, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('facility_purpose_equipments')->insert([
            ['facility_purpose_id' => 1, 'equipment_id' => 3, 'created_at' => $now, 'updated_at' => $now],
            ['facility_purpose_id' => 3, 'equipment_id' => 2, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('facility_slots')->insert([ 
            ['facility_id' => 6,  'slot_id' => 3, 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 1,  'slot_id' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 1,  'slot_id' => 2, 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 1,  'slot_id' => 3, 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 9,  'slot_id' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 9,  'slot_id' => 2, 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 10, 'slot_id' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 10, 'slot_id' => 2, 'created_at' => $now, 'updated_at' => $now],
            ['facility_id' => 10, 'slot_id' => 3, 'created_at' => $now, 'updated_at' => $now],
        ]);
        DB::table('users')->insert([ 
            [
            'name' => 'Administrator',
            'email' => 'admin@event-plus.test',
            'password' => Hash::make('password'), // 本番環境では別の方法で
            'telephone' => '03-1234-5678',
            'address' => '東京都千代田区',
            'company' => 'Event Plus',
            'role' => 1,
            'created_at' => $now,
            'updated_at' => $now,
            ],
        ]);

        DB::statement('PRAGMA foreign_keys = ON;');
    }
}