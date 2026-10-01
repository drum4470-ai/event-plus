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
            'building_id' => $this->building_id,
            'facility_id' => $this->facility_id,
            'facility_slot_id' => $this->facility_slot_id,
            'purpose_id' => $this->purpose_id,
            'event_name' => $this->event_name,
            'usage_date' => $this->usage_date ? $this->usage_date->format('Y年m月d日') : null,
            'address' => $this->address,
            'telephone' => $this->telephone,
            'status' => $this->status,

            'facilities' => $this->whenLoaded('facilities'),
            'purposes' => $this->whenLoaded('purposes'),
            'facility_slots' => $this->whenLoaded('facilitySlots'),
            'equipments' => $this->whenLoaded('equipments'),
            'application_comments' => $this->whenLoaded('applicationComments'),
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d') : null,
        ];
    }
}