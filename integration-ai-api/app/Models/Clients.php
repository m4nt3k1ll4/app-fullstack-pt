<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Clients extends Model
{
    use HasUuids;
    protected $fillable = [
        'name',
        'email',
        'status'
    ];

    public function apiKeys()
    {
        return $this->hasMany(ApiKeys::class);
    }
}
