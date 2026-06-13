<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Setting extends Model
{
    protected $table = 'settings';

    protected $fillable = [
        'app_logo',
        'app_name',
        'app_deskripsi',
        'favicon',
    ];

    protected $appends = [
        'app_logo_url',
        'favicon_url',
    ];

    private static ?self $cachedInstance = null;

    public static function getAktif(): ?self
    {
        if (self::$cachedInstance === null) {
            self::$cachedInstance = static::firstOrCreate([]);
        }

        return self::$cachedInstance;
    }

    public static function tahunAjaranAktif(): ?string
    {
        return static::getAktif()?->tahun_ajaran_aktif;
    }

    public static function flushCache(): void
    {
        self::$cachedInstance = null;
    }

    public function getAppLogoUrlAttribute(): ?string
    {
        if ($this->app_logo) {
            return Storage::disk('public')->url($this->app_logo);
        }
        return null;
    }

    public function getFaviconUrlAttribute(): ?string
    {
        if ($this->favicon) {
            return Storage::disk('public')->url($this->favicon);
        }
        return null;
    }
}
