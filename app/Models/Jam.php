<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['jam_mulai', 'jam_selesai'])]
class Jam extends Model
{
    protected $table = 'jam';

    public function jadwalSidang(): HasMany
    {
        return $this->hasMany(JadwalSidang::class);
    }
}
