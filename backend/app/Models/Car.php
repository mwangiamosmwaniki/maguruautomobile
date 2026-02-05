<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'make',
        'model',
        'year',
        'mileage',
        'price',
        'transmission',
        'fuel_type',
        'body_type',
        'color',
        'engine_cc',
        'condition',
        'status',
        'description',
        'images',
        'image_url',
    ];

    protected $casts = [
        'images' => 'array',
        'year' => 'integer',
        'mileage' => 'integer',
        'price' => 'decimal:2',
        'engine_cc' => 'integer',
    ];

    // Accessor to get the first image as image_url
    public function getImageUrlAttribute($value)
    {
        if ($value) {
            return $value;
        }
        
        if ($this->images && is_array($this->images) && count($this->images) > 0) {
            return $this->images[0];
        }
        
        return null;
    }
}