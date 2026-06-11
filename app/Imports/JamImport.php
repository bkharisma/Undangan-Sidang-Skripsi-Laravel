<?php

namespace App\Imports;

use App\Models\Jam;
use Illuminate\Support\Facades\Validator;

class JamImport
{
    private array $errors = [];
    private int $validCount = 0;
    private array $validIds = [];

    public function __construct(private readonly string $filePath) {}

    public function process(): void
    {
        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($this->filePath);
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = $worksheet->toArray();

        foreach ($rows as $index => $row) {
            if ($index === 0) {
                continue;
            }

            $data = [
                'jam_mulai' => trim((string) ($row[0] ?? '')),
                'jam_selesai' => trim((string) ($row[1] ?? '')),
            ];

            $rowContent = trim(implode('', array_map(fn ($c) => (string) ($c ?? ''), $row)));
            if ($rowContent === '') {
                continue;
            }

            $validator = Validator::make($data, [
                'jam_mulai' => ['required', 'date_format:H:i'],
                'jam_selesai' => ['required', 'date_format:H:i', 'after:jam_mulai'],
            ], [
                'jam_mulai.required' => 'Jam mulai wajib diisi.',
                'jam_selesai.required' => 'Jam selesai wajib diisi.',
                'jam_selesai.after' => 'Jam selesai harus setelah jam mulai.',
            ]);

            if ($validator->fails()) {
                $this->errors[] = [
                    'row' => $index + 1,
                    'data' => $data,
                    'messages' => $validator->errors()->all(),
                ];
            } else {
                $jam = Jam::create($validator->validated());
                $this->validIds[] = $jam->id;
                $this->validCount++;
            }
        }
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
