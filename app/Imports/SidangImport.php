<?php

namespace App\Imports;

use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\Sidang;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;

class SidangImport
{
    private array $errors = [];
    private int $validCount = 0;

    public function __construct(private readonly string $filePath, private readonly int $userId) {}

    public function process(): void
    {
        $spreadsheet = IOFactory::load($this->filePath);
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = $worksheet->toArray();

        foreach ($rows as $index => $row) {
            if ($index === 0) {
                continue;
            }

            $nim = trim((string) ($row[0] ?? ''));
            $judulSkripsi = trim((string) ($row[1] ?? ''));
            $inisialPenguji1 = trim((string) ($row[2] ?? ''));
            $inisialPenguji2 = trim((string) ($row[3] ?? ''));
            $inisialPimpinan = trim((string) ($row[4] ?? ''));
            $tanggalUjian = trim((string) ($row[5] ?? ''));
            $tahunAkademik = trim((string) ($row[6] ?? ''));

            $rowContent = trim(implode('', array_map(fn ($c) => (string) ($c ?? ''), $row)));
            if ($rowContent === '') {
                continue;
            }

            $rowErrors = [];

            $mahasiswa = Mahasiswa::where('nim', $nim)->first();
            if (! $mahasiswa) {
                $rowErrors[] = "NIM '{$nim}' tidak ditemukan.";
            }

            $penguji1 = Dosen::where('inisial', $inisialPenguji1)->first();
            if (! $penguji1) {
                $rowErrors[] = "Inisial Penguji 1 '{$inisialPenguji1}' tidak ditemukan.";
            }

            $penguji2 = Dosen::where('inisial', $inisialPenguji2)->first();
            if (! $penguji2) {
                $rowErrors[] = "Inisial Penguji 2 '{$inisialPenguji2}' tidak ditemukan.";
            }

            $pimpinan = Dosen::where('inisial', $inisialPimpinan)->first();
            if (! $pimpinan) {
                $rowErrors[] = "Inisial Pimpinan Sidang '{$inisialPimpinan}' tidak ditemukan.";
            }

            if ($nim === '') {
                $rowErrors[] = 'NIM wajib diisi.';
            }
            if ($inisialPenguji1 === '') {
                $rowErrors[] = 'Inisial Penguji 1 wajib diisi.';
            }
            if ($inisialPenguji2 === '') {
                $rowErrors[] = 'Inisial Penguji 2 wajib diisi.';
            }
            if ($inisialPimpinan === '') {
                $rowErrors[] = 'Inisial Pimpinan Sidang wajib diisi.';
            }

            $data = [
                'judul_skripsi' => $judulSkripsi,
                'tanggal_ujian' => $tanggalUjian,
                'tahun_akademik' => $tahunAkademik,
            ];

            $validator = Validator::make($data, [
                'judul_skripsi' => ['required', 'string', 'max:500'],
                'tanggal_ujian' => ['required', 'date'],
                'tahun_akademik' => ['required', 'string', 'size:5', 'regex:/^\d{4}[12]$/'],
            ], [
                'judul_skripsi.required' => 'Judul skripsi wajib diisi.',
                'judul_skripsi.max' => 'Judul skripsi maksimal 500 karakter.',
                'tanggal_ujian.required' => 'Tanggal ujian wajib diisi.',
                'tanggal_ujian.date' => 'Format tanggal ujian tidak valid.',
                'tahun_akademik.required' => 'Tahun akademik wajib diisi.',
                'tahun_akademik.size' => 'Tahun akademik harus 5 karakter.',
                'tahun_akademik.regex' => 'Format tahun akademik tidak valid (contoh: 20251).',
            ]);

            if ($validator->fails()) {
                $rowErrors = array_merge($rowErrors, $validator->errors()->all());
            }

            $displayData = [
                'nim' => $nim,
                'judul_skripsi' => $judulSkripsi,
                'inisial_penguji1' => $inisialPenguji1,
                'inisial_penguji2' => $inisialPenguji2,
                'inisial_pimpinan' => $inisialPimpinan,
                'tanggal_ujian' => $tanggalUjian,
                'tahun_akademik' => $tahunAkademik,
            ];

            if (! empty($rowErrors)) {
                $this->errors[] = [
                    'row' => $index + 1,
                    'data' => $displayData,
                    'messages' => $rowErrors,
                ];
            } else {
                Sidang::create([
                    'user_id' => $this->userId,
                    'mahasiswa_id' => $mahasiswa->id,
                    'judul_skripsi' => $judulSkripsi,
                    'penguji1_id' => $penguji1->id,
                    'penguji2_id' => $penguji2->id,
                    'pimpinan_sidang_id' => $pimpinan->id,
                    'tanggal_ujian' => $tanggalUjian,
                    'tahun_akademik' => $tahunAkademik,
                ]);
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
}
