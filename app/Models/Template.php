<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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

    protected $appends = [
        'header_image_url',
        'header_logo_url',
        'ttd_image_url',
    ];

    public function getHeaderImageUrlAttribute(): ?string
    {
        if ($this->header_image) {
            return Storage::disk('public')->url($this->header_image);
        }

        return null;
    }

    public function getHeaderLogoUrlAttribute(): ?string
    {
        if ($this->header_logo) {
            return Storage::disk('public')->url($this->header_logo);
        }

        return null;
    }

    public function getTtdImageUrlAttribute(): ?string
    {
        if ($this->ttd_image) {
            return Storage::disk('public')->url($this->ttd_image);
        }

        return null;
    }
}
