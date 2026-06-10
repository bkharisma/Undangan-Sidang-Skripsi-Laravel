<?php

namespace Database\Seeders;

use App\Models\Pic;
use Illuminate\Database\Seeder;

class PicSeeder extends Seeder
{
    public function run(): void
    {
        $pic = [
            ['nama' => 'Surya Darmawan'],
            ['nama' => 'Maya Anggraini'],
            ['nama' => 'Rizki Pratama'],
        ];

        foreach ($pic as $p) {
            Pic::firstOrCreate(['nama' => $p['nama']], $p);
        }
    }
}
