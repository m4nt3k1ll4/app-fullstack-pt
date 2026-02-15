<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{

    protected $fillable = [
        'name',
        'features',
        'price',
        'ai_description',
        'images',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'images' => 'array',
    ];
}
