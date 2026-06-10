<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'sidang_id',
    'tanggal',
    'ruangan_id',
    'jam_id',
    'pic_id',
])]
class JadwalSidang extends Model
{
    protected $table = 'jadwal_sidang';

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
        ];
    }

    public function sidang(): BelongsTo
    {
        return $this->belongsTo(Sidang::class);
    }

    public function pic(): BelongsTo
    {
        return $this->belongsTo(Pic::class);
    }

    public function ruangan(): BelongsTo
    {
        return $this->belongsTo(Ruangan::class);
    }

    public function jam(): BelongsTo
    {
        return $this->belongsTo(Jam::class);
    }
}
