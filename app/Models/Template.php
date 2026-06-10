<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    protected $table = 'templates';

    protected $fillable = [
        'header_image',
        'header_logo',
        'ttd_image',
        'ttd_kota',
        'ttd_jabatan',
        'ttd_nama',
        'ttd_nip',
        'deskripsi',
    ];
}
