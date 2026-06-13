<?php

namespace App\Imports;

use App\Models\ProgramStudi;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ProgramStudiImport
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
                'kode' => trim((string) ($row[0] ?? '')),
                'nama' => trim((string) ($row[1] ?? '')),
            ];

            $rowContent = trim(implode('', array_map(fn ($c) => (string) ($c ?? ''), $row)));
            if ($rowContent === '') {
                continue;
            }

            $validator = Validator::make($data, [
                'kode' => ['required', 'string', 'max:20', 'unique:program_studi,kode'],
                'nama' => ['required', 'string', 'max:255'],
            ], [
                'kode.required' => 'Kode program studi wajib diisi.',
                'kode.unique' => 'Kode program studi sudah digunakan.',
                'nama.required' => 'Nama program studi wajib diisi.',
            ]);

            if ($validator->fails()) {
                $this->errors[] = [
                    'row' => $index + 1,
                    'data' => $data,
                    'messages' => $validator->errors()->all(),
                ];
            } else {
                ProgramStudi::create($validator->validated());
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
