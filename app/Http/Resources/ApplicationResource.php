<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'application_id' => $this->application_id,
            'user_id' => $this->user_id,
            'facility_id' => $this->facility_id,
            'facility_slot_id' => $this->facility_slot_id,
            'purpose_id' => $this->purpose_id,
            'event_name' => $this->event_name,
            'usage_date' => $this->usage_date,
            'address' => $this->address,
            'telephone' => $this->telephone,
            'status' => $this->status,
            'created_at' => $this->created_at
                ? $this->created_at->format('Y-m-d H:i')
                : null,
            'updated_at' => $this->updated_at
                ? $this->updated_at->format('Y-m-d H:i')
                : null,
        ];
    }
}