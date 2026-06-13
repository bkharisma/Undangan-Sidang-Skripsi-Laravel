<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProgramStudiRequest;
use App\Http\Requests\UpdateProgramStudiRequest;
use App\Imports\ProgramStudiImport;
use App\Models\ProgramStudi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProgramStudiController extends Controller
{
    public function index()
    {
        $programStudi = ProgramStudi::query()
            ->when(request('search'), function ($query, $search) {
                $query->where('nama', 'like', "%{$search}%")
                    ->orWhere('kode', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Admin/ProgramStudi/Index', [
            'programStudi' => $programStudi,
            'filters' => request()->only('search'),
        ]);
    }

    public function create()
    {
        return inertia('Admin/ProgramStudi/Create');
    }

    public function store(StoreProgramStudiRequest $request)
    {
        ProgramStudi::create($request->validated());

        return redirect()
            ->route('admin.program-studi.index')
            ->with('success', 'Program studi berhasil ditambahkan.');
    }

    public function edit(ProgramStudi $programStudi)
    {
        return inertia('Admin/ProgramStudi/Edit', [
            'programStudi' => $programStudi,
        ]);
    }

    public function update(UpdateProgramStudiRequest $request, ProgramStudi $programStudi)
    {
        $programStudi->update($request->validated());

        return redirect()
            ->route('admin.program-studi.index')
            ->with('success', 'Program studi berhasil diperbarui.');
    }

    public function destroy(ProgramStudi $programStudi)
    {
        $programStudi->delete();

        return redirect()
            ->route('admin.program-studi.index')
            ->with('success', 'Program studi berhasil dihapus.');
    }

    public function bulkCreate()
    {
        return inertia('Admin/ProgramStudi/BulkCreate', [
            'importResults' => null,
        ]);
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'],
        ]);

        $file = $request->file('file');
        $path = $file->storeAs('temp', uniqid('bulk_program_studi_') . '.' . $file->getClientOriginalExtension());

        try {
            $import = new ProgramStudiImport(storage_path('app/private/' . $path));
            $import->process();
        } finally {
            Storage::delete($path);
        }

        if ($import->getValidCount() > 0 && $import->getErrorCount() === 0) {
            return redirect()
                ->route('admin.program-studi.index')
                ->with('success', "{$import->getValidCount()} program studi berhasil ditambahkan.");
        }

        return inertia('Admin/ProgramStudi/BulkCreate', [
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

        $sheet->setCellValue('A1', 'kode');
        $sheet->setCellValue('B1', 'nama');

        $sheet->getStyle('A1:B1')->getFont()->setBold(true);
        $sheet->getColumnDimension('A')->setWidth(15);
        $sheet->getColumnDimension('B')->setWidth(40);

        $sheet->setCellValue('A2', 'TI');
        $sheet->setCellValue('B2', 'Teknik Informatika');

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, 'template_program_studi.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
