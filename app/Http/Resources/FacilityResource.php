<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacilityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
        'facility_id' => $this->facility_id,
        'building_id' => $this->building_id,
        'building_name' => $this->building->name ?? null,
        'name'        => $this->name,
        'created_at'  => $this->created_at ? $this->created_at->format('Y-m-d H:i') : null,
        'updated_at'  => $this->updated_at ? $this->updated_at->format('Y-m-d H:i') : null,
    ];
    }
}
