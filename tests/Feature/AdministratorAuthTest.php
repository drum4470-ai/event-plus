<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdministratorAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_development_bypass_allows_login_without_credentials(): void
    {
        config(['app.env' => 'local']);

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'email@example.com',
            'password' => Hash::make('password'),
            'telephone' => '09000000000',
            'address' => 'Test Address',
            'company' => 'Test Company',
        ]);

        $response = $this->postJson('/api/administrator/login', [
            'email' => 'email@example.com',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJson(['message' => 'ログイン成功(開発用バイパス)']);

        $this->assertTrue(Auth::guard('admin')->check());
    }
}
