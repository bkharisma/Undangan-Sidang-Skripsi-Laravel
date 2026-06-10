<?php

namespace Database\Seeders;

use App\Models\Ruangan;
use Illuminate\Database\Seeder;

class RuanganSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['nama' => 'Ruang Rapat Mawar'],
            ['nama' => 'Ruang Rapat Anggrek'],
            ['nama' => 'Ruang Rapat Melati'],
            ['nama' => 'Ruang Rapat Kenanga'],
            ['nama' => 'Ruang Rapat Dahlia'],
        ];

        foreach ($data as $item) {
            Ruangan::firstOrCreate(['nama' => $item['nama']], $item);
        }
    }
}
