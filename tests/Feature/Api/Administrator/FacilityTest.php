<?php

namespace Tests\Feature\Api\Administrator;

use App\Models\User;
use App\Models\Facility;
use App\Models\Building;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FacilityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // 認証ユーザーの作成
        $user = User::factory()->create();
        $this->actingAs($user);
    }

    /** @test */
    public function 施設を更新できる()
    {
        $facility = Facility::factory()->create(['name' => '旧施設']);
        $building = Building::factory()->create(['name' => '新館']); // 名前を指定しておく

        $payload = [
            'name' => '新施設',
            'building_id' => $building->building_id
        ];

        // 1. リクエスト送信（building_id を送れば十分）
        $response = $this->putJson("/api/administrator/facilities/{$facility->facility_id}", $payload);

        // 2. HTTPステータスの検証
        $response->assertStatus(202);

        // 3. レスポンスのJSON構造を検証（ここで building_name を確認！）
        $response->assertJsonPath('data.building_name', '新館');

        // 4. DBの状態を検証
        $this->assertDatabaseHas('facilities', [
            'facility_id' => $facility->facility_id,
            'name' => '新施設'
        ]);
    }
}