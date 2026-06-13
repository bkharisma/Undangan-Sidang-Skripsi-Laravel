<?php

namespace App\Imports;

use App\Models\Mahasiswa;
use App\Models\ProgramStudi;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;

class MahasiswaImport
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

            $kodeProdi = trim((string) ($row[2] ?? ''));

            $data = [
                'nim' => trim((string) ($row[0] ?? '')),
                'nama' => trim((string) ($row[1] ?? '')),
                'kode_prodi' => $kodeProdi,
            ];

            $rowContent = trim(implode('', array_map(fn ($c) => (string) ($c ?? ''), $row)));
            if ($rowContent === '') {
                continue;
            }

            $prodiErrors = [];

            if (empty($kodeProdi)) {
                $prodiErrors[] = 'Kode program studi wajib diisi.';
            } else {
                $prodi = ProgramStudi::where('kode', $kodeProdi)->first();
                if (! $prodi) {
                    $prodiErrors[] = "Kode program studi '{$kodeProdi}' tidak ditemukan.";
                }
            }

            $validator = Validator::make($data, [
                'nim' => ['required', 'string', 'max:20', 'unique:mahasiswa,nim'],
                'nama' => ['required', 'string', 'max:255'],
            ], [
                'nim.required' => 'NIM wajib diisi.',
                'nim.unique' => 'NIM sudah digunakan.',
                'nama.required' => 'Nama mahasiswa wajib diisi.',
            ]);

            if ($validator->fails() || ! empty($prodiErrors)) {
                $messages = array_merge($validator->errors()->all(), $prodiErrors);
                $this->errors[] = [
                    'row' => $index + 1,
                    'data' => $data,
                    'messages' => $messages,
                ];
            } else {
                Mahasiswa::create([
                    'nim' => $data['nim'],
                    'nama' => $data['nama'],
                    'program_studi' => $prodi->nama,
                ]);
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
