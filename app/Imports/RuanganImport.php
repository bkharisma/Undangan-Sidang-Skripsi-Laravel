<?php

namespace App\Imports;

use App\Models\Ruangan;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;

class RuanganImport
{
    private array $errors = [];
    private int $validCount = 0;
    private array $validIds = [];

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
            ];

            $rowContent = trim(implode('', array_map(fn ($c) => (string) ($c ?? ''), $row)));
            if ($rowContent === '') {
                continue;
            }

            $validator = Validator::make($data, [
                'nama' => ['required', 'string', 'max:255'],
            ], [
                'nama.required' => 'Nama ruangan wajib diisi.',
            ]);

            if ($validator->fails()) {
                $this->errors[] = [
                    'row' => $index + 1,
                    'data' => $data,
                    'messages' => $validator->errors()->all(),
                ];
            } else {
                $ruangan = Ruangan::create($validator->validated());
                $this->validIds[] = $ruangan->id;
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

    public function getValidIds(): array
    {
        return $this->validIds;
    }
}
