<?php

namespace Database\Seeders;

use App\Models\Dosen;
use Illuminate\Database\Seeder;

class DosenSeeder extends Seeder
{
    public function run(): void
    {
        $dosen = [
            ['nama' => 'Dr. Ahmad Fauzi, M.Kom.', 'inisial' => 'AF'],
            ['nama' => 'Prof. Dr. Siti Nurhaliza, M.T.', 'inisial' => 'SN'],
            ['nama' => 'Budi Santoso, S.Kom., M.Kom.', 'inisial' => 'BS'],
            ['nama' => 'Dr. Rina Wijaya, M.Sc.', 'inisial' => 'RW'],
            ['nama' => 'Drs. Eko Prasetyo, M.T.', 'inisial' => 'EP'],
            ['nama' => 'Dr. Dewi Lestari, M.Kom.', 'inisial' => 'DL'],
            ['nama' => 'Hendra Gunawan, S.T., M.Eng.', 'inisial' => 'HG'],
            ['nama' => 'Prof. Ir. Bambang Hermanto, Ph.D.', 'inisial' => 'BH'],
        ];

        foreach ($dosen as $d) {
            Dosen::firstOrCreate(['inisial' => $d['inisial']], $d);
        }
    }
}
