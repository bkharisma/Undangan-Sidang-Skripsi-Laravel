<?php

namespace App\Imports;

use App\Models\Dosen;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;

class DosenImport
{
    private array $errors = [];
    private int $validCount = 0;

    public function __construct(private readonly string $filePath) {}

    public function process(): void
    {
        ini_set('memory_limit', '512M');

        $reader = IOFactory::createReaderForFile($this->filePath);
        $reader->setReadDataOnly(true);
        $spreadsheet = $reader->load($this->filePath);

        $worksheet = $spreadsheet->getActiveSheet();
        $rows = $worksheet->toArray();

        foreach ($rows as $index => $row) {
            if ($index === 0) {
                continue;
            }

            $data = [
                'nama' => trim((string) ($row[0] ?? '')),
                'inisial' => trim((string) ($row[1] ?? '')),
            ];

            $rowContent = trim(implode('', array_map(fn ($c) => (string) ($c ?? ''), $row)));
            if ($rowContent === '') {
                continue;
            }

            $validator = Validator::make($data, [
                'nama' => ['required', 'string', 'max:255'],
                'inisial' => ['required', 'string', 'max:10', 'unique:dosen,inisial'],
            ], [
                'nama.required' => 'Nama dosen wajib diisi.',
                'inisial.required' => 'Inisial wajib diisi.',
                'inisial.unique' => 'Inisial sudah digunakan.',
            ]);

            if ($validator->fails()) {
                $this->errors[] = [
                    'row' => $index + 1,
                    'data' => $data,
                    'messages' => $validator->errors()->all(),
                ];
            } else {
                Dosen::create($validator->validated());
                $this->validCount++;
            }
        }

        $spreadsheet->disconnectWorksheets();
        unset($spreadsheet, $worksheet, $rows);
    }

    public function getValidCount(): int
    {
        return $this->validCount;
    }

    public function getErrorCount(): int
    {
        return count($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
