<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nama', 'inisial'])]
class Dosen extends Model
{
    protected $table = 'dosen';

    public function sidangPenguji1(): HasMany
    {
        return $this->hasMany(Sidang::class, 'penguji1_id');
    }

    public function sidangPenguji2(): HasMany
    {
        return $this->hasMany(Sidang::class, 'penguji2_id');
    }

    public function sidangPimpinan(): HasMany
    {
        return $this->hasMany(Sidang::class, 'pimpinan_sidang_id');
    }

    public function undangan(): HasMany
    {
        return $this->hasMany(Undangan::class);
    }
}
