<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stock extends Model
{
    protected $fillable = [
        'product_id',
        'stock',
        'unit_value',
        'sale_value',
        'total_stock',
    ];

    protected $casts = [
        'stock' => 'integer',
        'unit_value' => 'decimal:2',
        'sale_value' => 'decimal:2',
        'total_stock' => 'decimal:2',
    ];

    /**
     * El producto al que pertenece este stock
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }
}
