<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTahunAkademikRequest;
use App\Models\TahunAkademik;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TahunAkademikController extends Controller
{
    public function index(): Response
    {
        $data = TahunAkademik::orderBy('tahun', 'desc')->get();

        return Inertia::render('Admin/TahunAkademik/Index', [
            'tahunAkademikList' => $data,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/TahunAkademik/Create');
    }

    public function store(StoreTahunAkademikRequest $request): RedirectResponse
    {
        $kode = $request->getKodeTahun();

        if (TahunAkademik::where('tahun', $kode)->exists()) {
            return redirect()->back()
                ->with('error', 'Tahun akademik ' . $kode . ' sudah ada.')
                ->withInput();
        }

        TahunAkademik::create(['tahun' => $kode]);

        return redirect()->route('admin.tahun-akademik.index')
            ->with('success', 'Tahun akademik berhasil ditambahkan.');
    }

    public function edit(TahunAkademik $tahunAkademik): Response
    {
        return Inertia::render('Admin/TahunAkademik/Edit', [
            'tahunAkademik' => $tahunAkademik,
        ]);
    }

    public function update(StoreTahunAkademikRequest $request, TahunAkademik $tahunAkademik): RedirectResponse
    {
        $kode = $request->getKodeTahun();

        $exists = TahunAkademik::where('tahun', $kode)
            ->where('id', '!=', $tahunAkademik->id)
            ->exists();

        if ($exists) {
            return redirect()->back()
                ->with('error', 'Tahun akademik ' . $kode . ' sudah ada.')
                ->withInput();
        }

        $tahunAkademik->update(['tahun' => $kode]);

        return redirect()->route('admin.tahun-akademik.index')
            ->with('success', 'Tahun akademik berhasil diperbarui.');
    }

    public function destroy(TahunAkademik $tahunAkademik): RedirectResponse
    {
        $tahunAkademik->delete();

        return redirect()->route('admin.tahun-akademik.index')
            ->with('success', 'Tahun akademik berhasil dihapus.');
    }

    public function toggleActive(TahunAkademik $tahunAkademik): RedirectResponse
    {
        $tahunAkademik->update(['is_active' => !$tahunAkademik->is_active]);

        return redirect()->route('admin.tahun-akademik.index')
            ->with('success', $tahunAkademik->is_active
                ? 'Tahun akademik ' . $tahunAkademik->label . ' ditandai sebagai aktif.'
                : 'Tahun akademik ' . $tahunAkademik->label . ' dinonaktifkan.');
    }
}
