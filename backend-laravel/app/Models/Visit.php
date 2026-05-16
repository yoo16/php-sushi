<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Visit extends Model
{
    protected $fillable = [
        'seat_id',
        'status',
        'total',
        'total_with_tax',
    ];

    protected function casts(): array
    {
        return [
            'seat_id' => 'integer',
            'total' => 'integer',
            'total_with_tax' => 'integer',
        ];
    }

    public function seat(): BelongsTo
    {
        return $this->belongsTo(Seat::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
