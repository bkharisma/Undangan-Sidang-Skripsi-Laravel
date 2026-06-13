<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRuanganRequest;
use App\Http\Requests\UpdateRuanganRequest;
use App\Imports\RuanganImport;
use App\Models\Ruangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RuanganController extends Controller
{
    public function index()
    {
        $ruangan = Ruangan::query()
            ->when(request('search'), function ($query, $search) {
                $query->where('nama', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Admin/Ruangan/Index', [
            'ruangan' => $ruangan,
            'filters' => request()->only('search'),
        ]);
    }

    public function create()
    {
        return inertia('Admin/Ruangan/Create');
    }

    public function store(StoreRuanganRequest $request)
    {
        Ruangan::create($request->validated());

        return redirect()
            ->route('admin.ruangan.index')
            ->with('success', 'Ruangan berhasil ditambahkan.');
    }

    public function edit(Ruangan $ruangan)
    {
        return inertia('Admin/Ruangan/Edit', [
            'ruangan' => $ruangan,
        ]);
    }

    public function update(UpdateRuanganRequest $request, Ruangan $ruangan)
    {
        $ruangan->update($request->validated());

        return redirect()
            ->route('admin.ruangan.index')
            ->with('success', 'Ruangan berhasil diperbarui.');
    }

    public function destroy(Ruangan $ruangan)
    {
        $ruangan->delete();

        return redirect()
            ->route('admin.ruangan.index')
            ->with('success', 'Ruangan berhasil dihapus.');
    }

    public function bulkCreate()
    {
        return inertia('Admin/Ruangan/BulkCreate', [
            'importResults' => null,
        ]);
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'],
        ]);

        $file = $request->file('file');
        $path = $file->storeAs('temp', uniqid('bulk_ruangan_') . '.' . $file->getClientOriginalExtension());

        try {
            $import = new RuanganImport(storage_path('app/private/' . $path));
            $import->process();
        } finally {
            Storage::delete($path);
        }

        $total = $import->getValidCount() + $import->getErrorCount();

        if ($import->getValidCount() > 0 && $import->getErrorCount() === 0) {
            return redirect()
                ->route('admin.ruangan.index')
                ->with('success', "{$import->getValidCount()} ruangan berhasil ditambahkan.");
        }

        return inertia('Admin/Ruangan/BulkCreate', [
            'importResults' => [
                'validCount' => $import->getValidCount(),
                'errorCount' => $import->getErrorCount(),
                'errors' => $import->getErrors(),
                'validIds' => $import->getValidIds(),
            ],
        ]);
    }

    public function downloadTemplate(): StreamedResponse
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setCellValue('A1', 'nama');

        $sheet->getStyle('A1')->getFont()->setBold(true);
        $sheet->getColumnDimension('A')->setWidth(40);

        $sheet->setCellValue('A2', 'Nama Ruangan Contoh');

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, 'template_ruangan.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
