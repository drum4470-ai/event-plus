<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        // 一時的に外部キー制約を無効化（SQLite用）
        DB::statement('PRAGMA foreign_keys = OFF;');

        // 1. 既存データをクリア
        DB::table('facility_slots')->delete(); 
        DB::table('facility_purpose_equipment')->delete();
        DB::table('facility_purposes')->delete();
        DB::table('facilities')->delete();
        DB::table('slots')->delete();
        DB::table('purposes')->delete();
        DB::table('equipment')->delete();
        DB::table('buildings')->delete();

        // 2. 建物のサンプルデータ
        DB::table('buildings')->insert([
            ['building_id' => 1, 'name' => '神明いきいきプラザ', 'address' => '港区神明'],
            ['building_id' => 2, 'name' => '虎ノ門いきいきプラザ', 'address' => '港区虎ノ門'],
            ['building_id' => 3, 'name' => '三田いきいきプラザ', 'address' => '港区三田'],
        ]);

        // 3. 施設のサンプルデータ (facility_id: 1 〜 12)
        DB::table('facilities')->insert([
            ['facility_id' => 1,  'building_id' => 1, 'name' => '会議室A'],
            ['facility_id' => 2,  'building_id' => 1, 'name' => '会議室B'],
            ['facility_id' => 3,  'building_id' => 1, 'name' => '会議室C'],
            ['facility_id' => 4,  'building_id' => 1, 'name' => '会議室D'],
            ['facility_id' => 5,  'building_id' => 1, 'name' => '料理室'],
            ['facility_id' => 6,  'building_id' => 1, 'name' => '体育館'],
            ['facility_id' => 7,  'building_id' => 1, 'name' => 'ダンススタジオ'],
            ['facility_id' => 8,  'building_id' => 1, 'name' => '音楽スタジオ'],
            ['facility_id' => 9,  'building_id' => 2, 'name' => '会議室A'],
            ['facility_id' => 10, 'building_id' => 3, 'name' => '会議室A'],
            ['facility_id' => 11, 'building_id' => 3, 'name' => '会議室B'],
            ['facility_id' => 12, 'building_id' => 3, 'name' => '料理室'],
        ]);

        // 4. 時間帯スロットのサンプルデータ (slot_id: 1 〜 4)
        DB::table('slots')->insert([
            ['slot_id' => 1, 'name' => '午前'],
            ['slot_id' => 2, 'name' => '午後'],
            ['slot_id' => 3, 'name' => '夜間'],
            ['slot_id' => 4, 'name' => '終日'],
        ]);

        // 5. 利用目的のサンプルデータ (purpose_id: 1 〜 4)
        DB::table('purposes')->insert([
            ['purpose_id' => 1, 'name' => '会議'],
            ['purpose_id' => 2, 'name' => 'ダンス'],
            ['purpose_id' => 3, 'name' => 'バスケットボール'],
            ['purpose_id' => 4, 'name' => '茶道'],
        ]);

        // 6. 付帯設備のサンプルデータ (equipment_id: 1 〜 4)
        DB::table('equipment')->insert([
            ['equipment_id' => 1, 'name' => 'マイク・スピーカー'],
            ['equipment_id' => 2, 'name' => 'バスケットボール'],
            ['equipment_id' => 3, 'name' => 'プロジェクター'],
            ['equipment_id' => 4, 'name' => 'ホワイトボード'],
        ]);

        // 7. 施設×目的の紐付け
        DB::table('facility_purposes')->insert([
            ['id' => 1, 'facility_id' => 1,  'purpose_id' => 1], // 会議室A(神明) × 会議
            ['id' => 2, 'facility_id' => 7,  'purpose_id' => 2], // ダンススタジオ(神明) × ダンス
            ['id' => 3, 'facility_id' => 6,  'purpose_id' => 3], // 体育館(神明) × バスケットボール
            ['id' => 4, 'facility_id' => 9,  'purpose_id' => 1], // 会議室A(虎ノ門) × 会議
            ['id' => 5, 'facility_id' => 9,  'purpose_id' => 4], // 会議室A(虎ノ門) × 茶道
            ['id' => 6, 'facility_id' => 10, 'purpose_id' => 1], // 会議室A(三田) × 会議
            ['id' => 7, 'facility_id' => 11, 'purpose_id' => 4], // 会議室B(三田) × 茶道
        ]);

        // 8. 施設×目的×付帯設備の紐付け
        DB::table('facility_purpose_equipment')->insert([ // 💡 「s」を付けました
            ['facility_purpose_id' => 1, 'equipment_id' => 3], // 会議室Aの会議（id:1） × プロジェクター
            ['facility_purpose_id' => 3, 'equipment_id' => 2], // 体育館のバスケ（id:3） × バスケットボール
        ]);

        // 9. 建物×施設×時間枠の紐付け
        DB::table('facility_slots')->insert([ 
            ['facility_id' => 6,  'slot_id' => 3],
            ['facility_id' => 1,  'slot_id' => 1],
            ['facility_id' => 1,  'slot_id' => 2],
            ['facility_id' => 1,  'slot_id' => 3],
            ['facility_id' => 9,  'slot_id' => 1],
            ['facility_id' => 9,  'slot_id' => 2],
            ['facility_id' => 10, 'slot_id' => 1],
            ['facility_id' => 10, 'slot_id' => 2],
            ['facility_id' => 10, 'slot_id' => 3],
        ]);

        // 処理が終わったら外部キー制約を元に戻す
        DB::statement('PRAGMA foreign_keys = ON;');
    }
}