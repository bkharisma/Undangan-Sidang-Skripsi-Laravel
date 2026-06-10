<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJadwalSidangRequest;
use App\Http\Requests\UpdateJadwalSidangRequest;
use App\Models\Sidang;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class JadwalSidangController extends Controller
{
    public function store(StoreJadwalSidangRequest $request, Sidang $sidang): RedirectResponse
    {
        Gate::authorize('update', $sidang);

        $sidang->jadwalSidang()->create($request->validated());

        return redirect()->route('sidang.show', $sidang)->with('success', 'Jadwal sidang berhasil ditambahkan.');
    }

    public function update(UpdateJadwalSidangRequest $request, Sidang $sidang): RedirectResponse
    {
        Gate::authorize('update', $sidang);

        $sidang->jadwalSidang()->updateOrCreate(
            ['sidang_id' => $sidang->id],
            $request->validated()
        );

        return redirect()->route('sidang.show', $sidang)->with('success', 'Jadwal sidang berhasil diperbarui.');
    }
}
