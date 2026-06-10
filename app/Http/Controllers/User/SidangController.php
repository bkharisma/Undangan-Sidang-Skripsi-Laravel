<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSidangRequest;
use App\Http\Requests\UpdateSidangRequest;
use App\Models\Dosen;
use App\Models\Jam;
use App\Models\Mahasiswa;
use App\Models\Pic;
use App\Models\Ruangan;
use App\Models\Sidang;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SidangController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Sidang::where('user_id', $request->user()->id)
            ->with([
                'mahasiswa',
                'penguji1',
                'penguji2',
                'pimpinanSidang',
                'jadwalSidang',
            ])
            ;

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul_skripsi', 'like', "%{$search}%")
                    ->orWhereHas('mahasiswa', function ($q) use ($search) {
                        $q->where('nama', 'like', "%{$search}%")
                            ->orWhere('nim', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('tahun_akademik')) {
            $query->where('tahun_akademik', $request->tahun_akademik);
        }

        if ($request->filled('prodi')) {
            $query->whereHas('mahasiswa', function ($q) use ($request) {
                $q->where('program_studi', $request->prodi);
            });
        }

        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');

        if ($sort === 'nim') {
            $query->join('mahasiswa', 'sidang.mahasiswa_id', '=', 'mahasiswa.id')
                ->select('sidang.*')
                ->orderBy('mahasiswa.nim', $direction);
        } elseif ($sort === 'nama') {
            $query->join('mahasiswa', 'sidang.mahasiswa_id', '=', 'mahasiswa.id')
                ->select('sidang.*')
                ->orderBy('mahasiswa.nama', $direction);
        } elseif ($sort === 'jadwal') {
            $query->leftJoin('jadwal_sidang', 'sidang.id', '=', 'jadwal_sidang.sidang_id')
                ->select('sidang.*')
                ->orderByRaw("jadwal_sidang.id IS NOT NULL {$direction}, jadwal_sidang.id {$direction}");
        } elseif ($sort === 'tahun_akademik') {
            $query->orderBy('sidang.tahun_akademik', $direction);
        } elseif ($sort === 'tanggal_ujian') {
            $query->orderBy('sidang.tanggal_ujian', $direction);
        } else {
            $query->latest();
        }

        $perPage = (int) $request->get('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50]) ? $perPage : 10;
        $sidang = $query->paginate($perPage)->withQueryString();

        $prodiOptions = Mahasiswa::distinct()->orderBy('program_studi')->pluck('program_studi');

        return Inertia::render('User/Sidang/Index', [
            'sidang' => $sidang,
            'filters' => $request->only(['search', 'tahun_akademik', 'sort', 'direction', 'prodi', 'per_page']),
            'tahunAkademikOptions' => Sidang::tahunAkademikOptions(),
            'prodiOptions' => $prodiOptions,
        ]);
    }

    public function create(): Response
    {
        $mahasiswa = Mahasiswa::orderBy('nama')->get();
        $dosen = Dosen::orderBy('nama')->get();
        $pic = Pic::orderBy('nama')->get();
        $ruangan = Ruangan::orderBy('nama')->get();
        $jam = Jam::orderBy('jam_mulai')->get();

        return Inertia::render('User/Sidang/Create', [
            'mahasiswa' => $mahasiswa,
            'dosen' => $dosen,
            'pic' => $pic,
            'ruangan' => $ruangan,
            'jam' => $jam,
            'tahunAkademikOptions' => Sidang::tahunAkademikOptions(),
        ]);
    }

    public function store(StoreSidangRequest $request): RedirectResponse
    {
        $sidang = Sidang::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        if ($request->filled('ruangan_id') && $request->filled('jam_id') && $request->filled('pic_id')) {
            $sidang->jadwalSidang()->create([
                'tanggal' => $request->tanggal_ujian,
                'ruangan_id' => $request->ruangan_id,
                'jam_id' => $request->jam_id,
                'pic_id' => $request->pic_id,
            ]);
        }

        return redirect()->route('sidang.show', $sidang)->with('success', 'Data sidang berhasil ditambahkan.');
    }

    public function show(Sidang $sidang): Response
    {
        Gate::authorize('view', $sidang);

        $sidang->load([
            'mahasiswa',
            'penguji1',
            'penguji2',
            'pimpinanSidang',
            'jadwalSidang.pic',
            'jadwalSidang.ruangan',
            'jadwalSidang.jam',
        ]);

        $pic = Pic::orderBy('nama')->get();
        $ruangan = Ruangan::orderBy('nama')->get();
        $jam = Jam::orderBy('jam_mulai')->get();

        return Inertia::render('User/Sidang/Show', [
            'sidang' => $sidang,
            'pic' => $pic,
            'ruangan' => $ruangan,
            'jam' => $jam,
        ]);
    }

    public function edit(Sidang $sidang): Response
    {
        Gate::authorize('update', $sidang);

        $sidang->load('jadwalSidang');

        $mahasiswa = Mahasiswa::orderBy('nama')->get();
        $dosen = Dosen::orderBy('nama')->get();
        $pic = Pic::orderBy('nama')->get();
        $ruangan = Ruangan::orderBy('nama')->get();
        $jam = Jam::orderBy('jam_mulai')->get();

        return Inertia::render('User/Sidang/Edit', [
            'sidang' => $sidang,
            'mahasiswa' => $mahasiswa,
            'dosen' => $dosen,
            'pic' => $pic,
            'ruangan' => $ruangan,
            'jam' => $jam,
            'tahunAkademikOptions' => Sidang::tahunAkademikOptions(),
        ]);
    }

    public function update(UpdateSidangRequest $request, Sidang $sidang): RedirectResponse
    {
        Gate::authorize('update', $sidang);

        $sidang->update($request->validated());

        if ($request->filled('ruangan_id') && $request->filled('jam_id') && $request->filled('pic_id')) {
            $sidang->jadwalSidang()->updateOrCreate(
                ['sidang_id' => $sidang->id],
                [
                    'tanggal' => $request->tanggal_ujian,
                    'ruangan_id' => $request->ruangan_id,
                    'jam_id' => $request->jam_id,
                    'pic_id' => $request->pic_id,
                ]
            );
        }

        return redirect()->route('sidang.show', $sidang)->with('success', 'Data sidang berhasil diperbarui.');
    }

    public function destroy(Sidang $sidang): RedirectResponse
    {
        Gate::authorize('delete', $sidang);

        $sidang->delete();

        return redirect()->route('sidang.index')->with('success', 'Data sidang berhasil dihapus.');
    }
}
