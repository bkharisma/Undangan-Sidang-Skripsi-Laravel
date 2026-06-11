<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['jam_mulai', 'jam_selesai'])]
class Jam extends Model
{
    protected $table = 'jam';

    protected function jamMulai(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? substr($value, 0, 5) : $value,
        );
    }

    protected function jamSelesai(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? substr($value, 0, 5) : $value,
        );
    }

    public function jadwalSidang(): HasMany
    {
        return $this->hasMany(JadwalSidang::class);
    }
}
