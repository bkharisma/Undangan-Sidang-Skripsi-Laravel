<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nim', 'nama', 'program_studi'])]
class Mahasiswa extends Model
{
    protected $table = 'mahasiswa';

    public function sidang(): HasMany
    {
        return $this->hasMany(Sidang::class);
    }
}
