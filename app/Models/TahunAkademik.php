<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TahunAkademik extends Model
{
    protected $table = 'tahun_akademik';

    protected $fillable = ['tahun', 'is_active'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public static function getAktif(): ?self
    {
        return static::where('is_active', true)->first();
    }

    public static function tahunAjaranAktif(): ?string
    {
        return static::getAktif()?->tahun;
    }

    public function getLabelAttribute(): string
    {
        $year = (int) substr($this->tahun, 0, 4);
        $semester = substr($this->tahun, 4, 1);
        $nextYear = $year + 1;
        $label = $semester === '1' ? 'Ganjil' : 'Genap';

        return "{$year}/{$nextYear} - {$label}";
    }

    public static function booted(): void
    {
        static::saving(function (self $ta) {
            if ($ta->is_active) {
                static::where('id', '!=', $ta->id)->update(['is_active' => false]);
            }
        });
    }
}
