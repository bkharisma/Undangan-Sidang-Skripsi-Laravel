<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'user_id',
    'mahasiswa_id',
    'judul_skripsi',
    'penguji1_id',
    'penguji2_id',
    'pimpinan_sidang_id',
    'tanggal_ujian',
    'tahun_akademik',
])]
class Sidang extends Model
{
    protected $table = 'sidang';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function penguji1(): BelongsTo
    {
        return $this->belongsTo(Dosen::class, 'penguji1_id');
    }

    public function penguji2(): BelongsTo
    {
        return $this->belongsTo(Dosen::class, 'penguji2_id');
    }

    public function pimpinanSidang(): BelongsTo
    {
        return $this->belongsTo(Dosen::class, 'pimpinan_sidang_id');
    }

    public function jadwalSidang(): HasOne
    {
        return $this->hasOne(JadwalSidang::class);
    }

    public static function tahunAkademikOptions(): array
    {
        $currentYear = (int) date('Y');
        $options = [];

        for ($year = $currentYear - 5; $year <= $currentYear + 1; $year++) {
            $nextYear = $year + 1;
            $options[] = [
                'value' => $year . '1',
                'label' => "{$year}/{$nextYear} - Ganjil",
            ];
            $options[] = [
                'value' => $year . '2',
                'label' => "{$year}/{$nextYear} - Genap",
            ];
        }

        return $options;
    }
}
