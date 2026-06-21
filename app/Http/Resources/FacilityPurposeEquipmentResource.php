<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacilityPurposeEquipmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
        // 紐付けid名が未定
        'created_at'  => $this->created_at ? $this->created_at->format('Y-m-d H:i') : null,
        'updated_at'  => $this->updated_at ? $this->updated_at->format('Y-m-d H:i') : null,
    ];
    }
}
