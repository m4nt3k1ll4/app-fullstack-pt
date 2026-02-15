<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

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

    /**
     * El stock asociado a este producto
     */
    public function stock(): HasOne
    {
        return $this->hasOne(Stock::class, 'product_id');
    }
}
