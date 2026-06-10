<?php

namespace Database\Seeders;

use App\Models\ProgramStudi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProgramStudiSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $data = [
            ['kode' => 'PKA', 'nama' => 'Pengelolaan Konvensi dan Acara'],
            ['kode' => 'DIK', 'nama' => 'Divisi Kamar'],
            ['kode' => 'SKU', 'nama' => 'Seni Kuliner'],
            ['kode' => 'TAH', 'nama' => 'Tata Hidang'],
        ];

        foreach ($data as $item) {
            ProgramStudi::firstOrCreate(['kode' => $item['kode']], $item);
        }
    }
}
