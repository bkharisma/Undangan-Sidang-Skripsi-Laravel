<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSettingRequest;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function edit(): Response
    {
        $setting = Setting::firstOrCreate([]);

        return Inertia::render('Admin/Setting/Edit', [
            'setting' => $setting,
        ]);
    }

    public function update(UpdateSettingRequest $request): RedirectResponse
    {
        $setting = Setting::firstOrCreate([]);
        $data = $request->only(['app_name', 'app_deskripsi']);

        if ($request->hasFile('app_logo')) {
            if ($setting->app_logo) {
                Storage::disk('public')->delete($setting->app_logo);
            }
            $data['app_logo'] = $request->file('app_logo')->store('setting', 'public');
        }

        if ($request->hasFile('favicon')) {
            if ($setting->favicon) {
                Storage::disk('public')->delete($setting->favicon);
            }
            $data['favicon'] = $request->file('favicon')->store('setting', 'public');
        }

        $setting->update($data);
        Setting::flushCache();

        return redirect()->route('admin.setting.edit')
            ->with('success', 'Pengaturan berhasil disimpan.');
    }
}
