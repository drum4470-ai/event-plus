<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BuildingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            // 日付をISO 8601形式で統一するなど、フロントが扱いやすい形に加工
            'created_at' => $this->created_at->format('Y-m-d H:i'),
        ];
    }
}
