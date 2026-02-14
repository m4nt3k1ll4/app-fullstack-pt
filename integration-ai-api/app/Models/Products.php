<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Products extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'features',
        'price',
        'ai_description',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];
}
