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
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

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

    public function export(Request $request): StreamedResponse
    {
        $query = Sidang::where('user_id', $request->user()->id)
            ->with([
                'mahasiswa',
                'penguji1',
                'penguji2',
                'pimpinanSidang',
                'jadwalSidang.ruangan',
                'jadwalSidang.jam',
                'jadwalSidang.pic',
            ]);

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
        } elseif ($sort === 'tahun_akademik') {
            $query->orderBy('sidang.tahun_akademik', $direction);
        } elseif ($sort === 'tanggal_ujian') {
            $query->orderBy('sidang.tanggal_ujian', $direction);
        } else {
            $query->latest();
        }

        $sidangList = $query->get();

        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        $headers = [
            'No',
            'NIM',
            'Nama Mahasiswa',
            'Program Studi',
            'Judul Skripsi',
            'Tahun Akademik',
            'Tanggal Ujian',
            'Penguji 1',
            'Penguji 2',
            'Pimpinan Sidang',
            'Ruangan',
            'Jam',
            'PIC',
        ];

        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '1', $header);
            $sheet->getStyle($col . '1')->getFont()->setBold(true);
            $col++;
        }

        $sheet->getColumnDimension('A')->setWidth(5);
        $sheet->getColumnDimension('B')->setWidth(18);
        $sheet->getColumnDimension('C')->setWidth(25);
        $sheet->getColumnDimension('D')->setWidth(25);
        $sheet->getColumnDimension('E')->setWidth(50);
        $sheet->getColumnDimension('F')->setWidth(16);
        $sheet->getColumnDimension('G')->setWidth(16);
        $sheet->getColumnDimension('H')->setWidth(22);
        $sheet->getColumnDimension('I')->setWidth(22);
        $sheet->getColumnDimension('J')->setWidth(22);
        $sheet->getColumnDimension('K')->setWidth(18);
        $sheet->getColumnDimension('L')->setWidth(18);
        $sheet->getColumnDimension('M')->setWidth(18);

        foreach ($sidangList as $i => $s) {
            $row = $i + 2;
            $jadwal = $s->jadwalSidang;
            $sheet->setCellValue('A' . $row, $i + 1);
            $sheet->setCellValue('B' . $row, $s->mahasiswa?->nim ?? '-');
            $sheet->setCellValue('C' . $row, $s->mahasiswa?->nama ?? '-');
            $sheet->setCellValue('D' . $row, $s->mahasiswa?->program_studi ?? '-');
            $sheet->setCellValue('E' . $row, $s->judul_skripsi ?? '-');
            $sheet->setCellValue('F' . $row, $s->tahun_akademik ?? '-');
            $sheet->setCellValue('G' . $row, $s->tanggal_ujian ? \Carbon\Carbon::parse($s->tanggal_ujian)->format('d-m-Y') : '-');
            $sheet->setCellValue('H' . $row, $s->penguji1?->nama ?? '-');
            $sheet->setCellValue('I' . $row, $s->penguji2?->nama ?? '-');
            $sheet->setCellValue('J' . $row, $s->pimpinanSidang?->nama ?? '-');
            $sheet->setCellValue('K' . $row, $jadwal?->ruangan?->nama ?? '-');
            $sheet->setCellValue('L' . $row, $jadwal?->jam ? $jadwal->jam->jam_mulai . ' - ' . $jadwal->jam->jam_selesai : '-');
            $sheet->setCellValue('M' . $row, $jadwal?->pic?->nama ?? '-');
        }

        $filename = 'data_sidang_' . now()->format('Ymd_His') . '.xlsx';

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
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

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:sidang,id'],
        ]);

        $deleted = Sidang::whereIn('id', $validated['ids'])
            ->where('user_id', auth()->id())
            ->delete();

        return redirect()
            ->route('sidang.index')
            ->with('success', $deleted . ' data sidang berhasil dihapus.');
    }

    public function destroy(Sidang $sidang): RedirectResponse
    {
        Gate::authorize('delete', $sidang);

        $sidang->delete();

        return redirect()->route('sidang.index')->with('success', 'Data sidang berhasil dihapus.');
    }
}
