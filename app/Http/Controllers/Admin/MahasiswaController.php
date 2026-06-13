<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMahasiswaRequest;
use App\Http\Requests\UpdateMahasiswaRequest;
use App\Imports\MahasiswaImport;
use App\Models\Mahasiswa;
use App\Models\ProgramStudi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MahasiswaController extends Controller
{
    public function index()
    {
        $mahasiswa = Mahasiswa::query()
            ->when(request('search'), function ($query, $search) {
                $query->where('nama', 'like', "%{$search}%")
                    ->orWhere('nim', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Admin/Mahasiswa/Index', [
            'mahasiswa' => $mahasiswa,
            'filters' => request()->only('search'),
        ]);
    }

    public function create()
    {
        return inertia('Admin/Mahasiswa/Create', [
            'programStudiList' => ProgramStudi::orderBy('nama')->get(['id', 'kode', 'nama']),
        ]);
    }

    public function store(StoreMahasiswaRequest $request)
    {
        Mahasiswa::create($request->validated());

        return redirect()
            ->route('admin.mahasiswa.index')
            ->with('success', 'Mahasiswa berhasil ditambahkan.');
    }

    public function edit(Mahasiswa $mahasiswa)
    {
        return inertia('Admin/Mahasiswa/Edit', [
            'mahasiswa' => $mahasiswa,
            'programStudiList' => ProgramStudi::orderBy('nama')->get(['id', 'kode', 'nama']),
        ]);
    }

    public function update(UpdateMahasiswaRequest $request, Mahasiswa $mahasiswa)
    {
        $mahasiswa->update($request->validated());

        return redirect()
            ->route('admin.mahasiswa.index')
            ->with('success', 'Mahasiswa berhasil diperbarui.');
    }

    public function destroy(Mahasiswa $mahasiswa)
    {
        $mahasiswa->delete();

        return redirect()
            ->route('admin.mahasiswa.index')
            ->with('success', 'Mahasiswa berhasil dihapus.');
    }

    public function bulkCreate()
    {
        return inertia('Admin/Mahasiswa/BulkCreate', [
            'importResults' => null,
        ]);
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'],
        ]);

        $file = $request->file('file');
        $path = $file->storeAs('temp', uniqid('bulk_mahasiswa_') . '.' . $file->getClientOriginalExtension());

        try {
            $import = new MahasiswaImport(storage_path('app/private/' . $path));
            $import->process();
        } finally {
            Storage::delete($path);
        }

        $total = $import->getValidCount() + $import->getErrorCount();

        if ($import->getValidCount() > 0 && $import->getErrorCount() === 0) {
            return redirect()
                ->route('admin.mahasiswa.index')
                ->with('success', "{$import->getValidCount()} mahasiswa berhasil ditambahkan.");
        }

        return inertia('Admin/Mahasiswa/BulkCreate', [
            'importResults' => [
                'validCount' => $import->getValidCount(),
                'errorCount' => $import->getErrorCount(),
                'errors' => $import->getErrors(),
            ],
        ]);
    }

    public function downloadTemplate(): StreamedResponse
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setCellValue('A1', 'nim');
        $sheet->setCellValue('B1', 'nama');
        $sheet->setCellValue('C1', 'kode_prodi');

        $sheet->getStyle('A1:C1')->getFont()->setBold(true);
        $sheet->getColumnDimension('A')->setWidth(20);
        $sheet->getColumnDimension('B')->setWidth(40);
        $sheet->getColumnDimension('C')->setWidth(30);

        $sheet->setCellValue('A2', '12345678');
        $sheet->setCellValue('B2', 'Nama Contoh Mahasiswa');
        $sheet->setCellValue('C2', 'DIK');

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, 'template_mahasiswa.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
