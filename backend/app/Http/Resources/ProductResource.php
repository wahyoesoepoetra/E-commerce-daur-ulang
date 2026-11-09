<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'product_id' => $this->product_id,
            'name' => $this->name,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'category' => $this->category?->category,
            'price' => $this->price,
            'img' => $this->img ? asset('storage/' . $this->img) : null,
            'stock' => $this->stock,
            'slug' => $this->slug,
        ];
    }
}