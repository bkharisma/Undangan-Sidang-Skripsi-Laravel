<?php

namespace App\Models;

use App\Models\Setting;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;

#[Fillable([
    'user_id',
    'dosen_id',
    'nomor_surat',
])]
class Undangan extends Model
{
    protected $table = 'undangan';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function dosen(): BelongsTo
    {
        return $this->belongsTo(Dosen::class);
    }

    public function sidangList(): Attribute
    {
        return Attribute::make(
            get: function () {
                $tahunAktif = Setting::tahunAjaranAktif();

                return Sidang::where(function ($q) {
                    $q->where('penguji1_id', $this->dosen_id)
                        ->orWhere('penguji2_id', $this->dosen_id)
                        ->orWhere('pimpinan_sidang_id', $this->dosen_id);
                })
                    ->when($tahunAktif, fn ($q) => $q->where('tahun_akademik', $tahunAktif))
                    ->with(['jadwalSidang.ruangan', 'jadwalSidang.jam', 'mahasiswa'])
                    ->get()
                    ->map(function (Sidang $sidang) {
                        $role = match ($this->dosen_id) {
                            $sidang->penguji1_id => 'Penguji 1',
                            $sidang->penguji2_id => 'Penguji 2',
                            $sidang->pimpinan_sidang_id => 'Pimpinan Sidang',
                            default => 'Dosen',
                        };

                        $jadwal = $sidang->jadwalSidang;

                        return [
                            'sidang_id' => $sidang->id,
                            'hari_tanggal' => $jadwal?->tanggal,
                            'ruangan' => $jadwal?->ruangan?->nama ?? '-',
                            'waktu' => $jadwal && $jadwal->jam
                                ? $jadwal->jam->jam_mulai . ' - ' . $jadwal->jam->jam_selesai
                                : '-',
                            'nama_mahasiswa' => $sidang->mahasiswa?->nama ?? '-',
                            'nim' => $sidang->mahasiswa?->nim ?? '-',
                            'program_studi' => $sidang->mahasiswa?->program_studi ?? '-',
                            'judul_skripsi' => $sidang->judul_skripsi,
                            'peran' => $role,
                        ];
                    });
            }
        );
    }
}
