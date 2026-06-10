<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePicRequest;
use App\Http\Requests\UpdatePicRequest;
use App\Imports\PicImport;
use App\Models\Pic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PicController extends Controller
{
    public function index()
    {
        $pic = Pic::query()
            ->when(request('search'), function ($query, $search) {
                $query->where('nama', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return inertia('Admin/Pic/Index', [
            'pic' => $pic,
            'filters' => request()->only('search'),
        ]);
    }

    public function create()
    {
        return inertia('Admin/Pic/Create');
    }

    public function store(StorePicRequest $request)
    {
        Pic::create($request->validated());

        return redirect()
            ->route('admin.pic.index')
            ->with('success', 'PIC berhasil ditambahkan.');
    }

    public function edit(Pic $pic)
    {
        return inertia('Admin/Pic/Edit', [
            'pic' => $pic,
        ]);
    }

    public function update(UpdatePicRequest $request, Pic $pic)
    {
        $pic->update($request->validated());

        return redirect()
            ->route('admin.pic.index')
            ->with('success', 'PIC berhasil diperbarui.');
    }

    public function destroy(Pic $pic)
    {
        $pic->delete();

        return redirect()
            ->route('admin.pic.index')
            ->with('success', 'PIC berhasil dihapus.');
    }

    public function bulkCreate()
    {
        return inertia('Admin/Pic/BulkCreate', [
            'importResults' => null,
        ]);
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'],
        ]);

        $file = $request->file('file');
        $path = $file->storeAs('temp', uniqid('bulk_pic_') . '.' . $file->getClientOriginalExtension());

        $import = new PicImport(storage_path('app/private/' . $path));
        $import->process();

        Storage::delete($path);

        $total = $import->getValidCount() + $import->getErrorCount();

        if ($import->getValidCount() > 0 && $import->getErrorCount() === 0) {
            return redirect()
                ->route('admin.pic.index')
                ->with('success', "{$import->getValidCount()} PIC berhasil ditambahkan.");
        }

        return inertia('Admin/Pic/BulkCreate', [
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

        $sheet->getStyle('A1')->getFont()->setBold(true);
        $sheet->getColumnDimension('A')->setWidth(40);

        $sheet->setCellValue('A2', 'Nama PIC Contoh');

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, 'template_pic.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
