<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Building;

class FacilityFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            // updateで建物IDを必須にしているため、ここでも紐づける
            'building_id' => Building::factory(),
        ];
    }
}