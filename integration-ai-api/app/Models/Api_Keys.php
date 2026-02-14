<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Api_Keys extends Model
{
    use HasUuids;

    protected $fillable = [
        'client_id',
        'key',
        'is_active',
        'last_used_at'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_used_at' => 'datetime',
    ];

    public function client()
    {
        return $this->belongsTo(Clients::class);
    }
}
