<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $setting = \App\Models\Setting::getAktif();
        $tahunAjaranAktif = \App\Models\TahunAkademik::tahunAjaranAktif();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'setting' => $setting ? [
                'app_logo_url' => $setting->app_logo_url,
                'app_name' => $setting->app_name,
                'app_deskripsi' => $setting->app_deskripsi,
                'favicon_url' => $setting->favicon_url,
            ] : null,
            'tahunAjaranAktif' => $tahunAjaranAktif ? [
                'tahun' => $tahunAjaranAktif,
            ] : null,
        ];
    }
}
