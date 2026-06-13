<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDosenRequest;
use App\Http\Requests\UpdateDosenRequest;
use App\Imports\DosenImport;
use App\Models\Dosen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DosenController extends Controller
{
    public function index()
    {
        $dosen = Dosen::query()
            ->when(request('search'), function ($query, $search) {
                $query->where('nama', 'like', "%{$search}%")
                    ->orWhere('inisial', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Admin/Dosen/Index', [
            'dosen' => $dosen,
            'filters' => request()->only('search'),
        ]);
    }

    public function create()
    {
        return inertia('Admin/Dosen/Create');
    }

    public function store(StoreDosenRequest $request)
    {
        Dosen::create($request->validated());

        return redirect()
            ->route('admin.dosen.index')
            ->with('success', 'Dosen berhasil ditambahkan.');
    }

    public function edit(Dosen $dosen)
    {
        return inertia('Admin/Dosen/Edit', [
            'dosen' => $dosen,
        ]);
    }

    public function update(UpdateDosenRequest $request, Dosen $dosen)
    {
        $dosen->update($request->validated());

        return redirect()
            ->route('admin.dosen.index')
            ->with('success', 'Dosen berhasil diperbarui.');
    }

    public function destroy(Dosen $dosen)
    {
        $dosen->delete();

        return redirect()
            ->route('admin.dosen.index')
            ->with('success', 'Dosen berhasil dihapus.');
    }

    public function bulkCreate()
    {
        return inertia('Admin/Dosen/BulkCreate', [
            'importResults' => null,
        ]);
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'],
        ]);

        $file = $request->file('file');
        $path = $file->storeAs('temp', uniqid('bulk_dosen_') . '.' . $file->getClientOriginalExtension());

        try {
            $import = new DosenImport(storage_path('app/private/' . $path));
            $import->process();
        } finally {
            Storage::delete($path);
        }

        $total = $import->getValidCount() + $import->getErrorCount();

        if ($import->getValidCount() > 0 && $import->getErrorCount() === 0) {
            return redirect()
                ->route('admin.dosen.index')
                ->with('success', "{$import->getValidCount()} dosen berhasil ditambahkan.");
        }

        return inertia('Admin/Dosen/BulkCreate', [
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

        $sheet->setCellValue('A1', 'nama');
        $sheet->setCellValue('B1', 'inisial');

        $sheet->getStyle('A1:B1')->getFont()->setBold(true);
        $sheet->getColumnDimension('A')->setWidth(40);
        $sheet->getColumnDimension('B')->setWidth(15);

        $sheet->setCellValue('A2', 'Dr. Contoh Dosen');
        $sheet->setCellValue('B2', 'CD');

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, 'template_dosen.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
