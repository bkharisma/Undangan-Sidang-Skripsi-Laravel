<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Imports\SidangImport;
use App\Models\Jam;
use App\Models\Pic;
use App\Models\Ruangan;
use App\Models\Sidang;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SidangController extends Controller
{
    public function index(Request $request)
    {
        $query = Sidang::query()
            ->with([
                'mahasiswa',
                'penguji1',
                'penguji2',
                'pimpinanSidang',
                'user',
                'jadwalSidang.ruangan',
                'jadwalSidang.jam',
            ])
            ->when(request('search'), function ($query, $search) {
                $query->whereHas('mahasiswa', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nim', 'like', "%{$search}%");
                })->orWhere('judul_skripsi', 'like', "%{$search}%");
            })
            ->when(request('tahun_akademik'), function ($query, $tahunAkademik) {
                $query->where('tahun_akademik', $tahunAkademik);
            })
            ->when(request('prodi'), function ($query, $prodi) {
                $query->whereHas('mahasiswa', function ($q) use ($prodi) {
                    $q->where('program_studi', $prodi);
                });
            });

        $sort = request('sort', 'created_at');
        $direction = request('direction', 'desc');

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

        $perPage = (int) request('per_page', 10);
        $perPage = in_array($perPage, [10, 25, 50]) ? $perPage : 10;
        $sidang = $query->paginate($perPage)->withQueryString();

        $prodiOptions = \App\Models\Mahasiswa::distinct()->orderBy('program_studi')->pluck('program_studi');
        $pic = Pic::orderBy('nama')->get();
        $ruangan = Ruangan::orderBy('nama')->get();
        $jam = Jam::orderBy('jam_mulai')->get();

        return inertia('Admin/Sidang/Index', [
            'sidang' => $sidang,
            'filters' => request()->only(['search', 'tahun_akademik', 'sort', 'direction', 'prodi', 'per_page']),
            'tahunAkademikOptions' => Sidang::tahunAkademikOptions(),
            'prodiOptions' => $prodiOptions,
            'pic' => $pic,
            'ruangan' => $ruangan,
            'jam' => $jam,
        ]);
    }

    public function show(Sidang $sidang)
    {
        $sidang->load([
            'user',
            'mahasiswa',
            'penguji1',
            'penguji2',
            'pimpinanSidang',
            'jadwalSidang.pic',
            'jadwalSidang.ruangan',
            'jadwalSidang.jam',
        ]);

        return inertia('Admin/Sidang/Show', [
            'sidang' => $sidang,
        ]);
    }

    public function updateJadwal(Request $request, Sidang $sidang): RedirectResponse
    {
        $validated = $request->validate([
            'tanggal' => ['required', 'date'],
            'ruangan_id' => ['required', 'exists:ruangan,id'],
            'jam_id' => ['required', 'exists:jam,id'],
            'pic_id' => ['required', 'exists:pic,id'],
        ]);

        $sidang->jadwalSidang()->updateOrCreate(
            ['sidang_id' => $sidang->id],
            $validated
        );

        return redirect()->back()->with('success', 'Jadwal sidang berhasil diperbarui.');
    }

    public function bulkCreate()
    {
        return inertia('Admin/Sidang/BulkCreate', [
            'importResults' => null,
        ]);
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'],
        ]);

        $file = $request->file('file');
        $path = $file->storeAs('temp', uniqid('bulk_sidang_') . '.' . $file->getClientOriginalExtension());

        $import = new SidangImport(storage_path('app/private/' . $path), auth()->id());
        $import->process();

        Storage::delete($path);

        if ($import->getValidCount() > 0 && $import->getErrorCount() === 0) {
            return redirect()
                ->route('admin.sidang.index')
                ->with('success', "{$import->getValidCount()} sidang berhasil ditambahkan.");
        }

        return inertia('Admin/Sidang/BulkCreate', [
            'importResults' => [
                'validCount' => $import->getValidCount(),
                'errorCount' => $import->getErrorCount(),
                'errors' => $import->getErrors(),
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $query = Sidang::query()
            ->with([
                'mahasiswa',
                'penguji1',
                'penguji2',
                'pimpinanSidang',
                'jadwalSidang.ruangan',
                'jadwalSidang.jam',
                'jadwalSidang.pic',
            ])
            ->when($request->search, function ($q, $search) {
                $q->whereHas('mahasiswa', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('nim', 'like', "%{$search}%");
                })->orWhere('judul_skripsi', 'like', "%{$search}%");
            })
            ->when($request->tahun_akademik, function ($q, $tahun) {
                $q->where('tahun_akademik', $tahun);
            })
            ->when($request->prodi, function ($q, $prodi) {
                $q->whereHas('mahasiswa', function ($q) use ($prodi) {
                    $q->where('program_studi', $prodi);
                });
            })
            ->when($request->sort === 'nim', function ($q) use ($request) {
                $q->join('mahasiswa', 'sidang.mahasiswa_id', '=', 'mahasiswa.id')
                    ->select('sidang.*')
                    ->orderBy('mahasiswa.nim', $request->direction ?? 'asc');
            })
            ->when($request->sort === 'nama', function ($q) use ($request) {
                $q->join('mahasiswa', 'sidang.mahasiswa_id', '=', 'mahasiswa.id')
                    ->select('sidang.*')
                    ->orderBy('mahasiswa.nama', $request->direction ?? 'asc');
            })
            ->when($request->sort === 'tahun_akademik', function ($q) use ($request) {
                $q->orderBy('sidang.tahun_akademik', $request->direction ?? 'desc');
            })
            ->when($request->sort === 'tanggal_ujian', function ($q) use ($request) {
                $q->orderBy('sidang.tanggal_ujian', $request->direction ?? 'desc');
            })
            ->when(! in_array($request->sort, ['nim', 'nama', 'tahun_akademik', 'tanggal_ujian']), function ($q) {
                $q->latest();
            });

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

    public function downloadTemplate(): StreamedResponse
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setCellValue('A1', 'NIM');
        $sheet->setCellValue('B1', 'Judul Skripsi');
        $sheet->setCellValue('C1', 'Inisial Penguji 1');
        $sheet->setCellValue('D1', 'Inisial Penguji 2');
        $sheet->setCellValue('E1', 'Inisial Pimpinan Sidang');
        $sheet->setCellValue('F1', 'Tanggal Ujian');
        $sheet->setCellValue('G1', 'Tahun Akademik');
        $sheet->setCellValue('H1', 'Ruangan ID');
        $sheet->setCellValue('I1', 'Jam ID');
        $sheet->setCellValue('J1', 'PIC ID');

        $sheet->getStyle('A1:J1')->getFont()->setBold(true);
        $sheet->getColumnDimension('A')->setWidth(20);
        $sheet->getColumnDimension('B')->setWidth(50);
        $sheet->getColumnDimension('C')->setWidth(22);
        $sheet->getColumnDimension('D')->setWidth(22);
        $sheet->getColumnDimension('E')->setWidth(25);
        $sheet->getColumnDimension('F')->setWidth(18);
        $sheet->getColumnDimension('G')->setWidth(18);
        $sheet->getColumnDimension('H')->setWidth(15);
        $sheet->getColumnDimension('I')->setWidth(12);
        $sheet->getColumnDimension('J')->setWidth(12);

        $sheet->setCellValue('A2', '1234567890');
        $sheet->setCellValue('B2', 'Judul Contoh Skripsi');
        $sheet->setCellValue('C2', 'EF');
        $sheet->setCellValue('D2', 'GH');
        $sheet->setCellValue('E2', 'IJ');
        $sheet->setCellValue('F2', '2025-06-15');
        $sheet->setCellValue('G2', '20251');
        $sheet->setCellValue('H2', '1');
        $sheet->setCellValue('I2', '1');
        $sheet->setCellValue('J2', '1');

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, 'template_sidang.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
