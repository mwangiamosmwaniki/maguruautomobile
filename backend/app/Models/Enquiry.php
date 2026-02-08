<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'message',
        'car_id',
    ];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }
}
