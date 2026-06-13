<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJamRequest;
use App\Http\Requests\UpdateJamRequest;
use App\Imports\JamImport;
use App\Models\Jam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class JamController extends Controller
{
    public function index()
    {
        $jam = Jam::query()
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Admin/Jam/Index', [
            'jam' => $jam,
        ]);
    }

    public function create()
    {
        return inertia('Admin/Jam/Create');
    }

    public function store(StoreJamRequest $request)
    {
        Jam::create($request->validated());

        return redirect()
            ->route('admin.jam.index')
            ->with('success', 'Jam berhasil ditambahkan.');
    }

    public function edit(Jam $jam)
    {
        return inertia('Admin/Jam/Edit', [
            'jam' => $jam,
        ]);
    }

    public function update(UpdateJamRequest $request, Jam $jam)
    {
        $jam->update($request->validated());

        return redirect()
            ->route('admin.jam.index')
            ->with('success', 'Jam berhasil diperbarui.');
    }

    public function destroy(Jam $jam)
    {
        $jam->delete();

        return redirect()
            ->route('admin.jam.index')
            ->with('success', 'Jam berhasil dihapus.');
    }

    public function bulkCreate()
    {
        return inertia('Admin/Jam/BulkCreate', [
            'importResults' => null,
        ]);
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'],
        ]);

        $file = $request->file('file');
        $path = $file->storeAs('temp', uniqid('bulk_jam_') . '.' . $file->getClientOriginalExtension());

        try {
            $import = new JamImport(storage_path('app/private/' . $path));
            $import->process();
        } finally {
            Storage::delete($path);
        }

        $total = $import->getValidCount() + $import->getErrorCount();

        if ($import->getValidCount() > 0 && $import->getErrorCount() === 0) {
            return redirect()
                ->route('admin.jam.index')
                ->with('success', "{$import->getValidCount()} jam berhasil ditambahkan.");
        }

        return inertia('Admin/Jam/BulkCreate', [
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

        $sheet->setCellValue('A1', 'jam_mulai');
        $sheet->setCellValue('B1', 'jam_selesai');

        $sheet->getStyle('A1:B1')->getFont()->setBold(true);
        $sheet->getColumnDimension('A')->setWidth(20);
        $sheet->getColumnDimension('B')->setWidth(20);

        $sheet->setCellValue('A2', '08:00');
        $sheet->setCellValue('B2', '10:00');

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, 'template_jam.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
