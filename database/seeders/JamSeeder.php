<?php

namespace Database\Seeders;

use App\Models\Jam;
use Illuminate\Database\Seeder;

class JamSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['jam_mulai' => '08:00', 'jam_selesai' => '09:00'],
            ['jam_mulai' => '08:00', 'jam_selesai' => '10:00'],
            ['jam_mulai' => '09:00', 'jam_selesai' => '10:00'],
            ['jam_mulai' => '09:00', 'jam_selesai' => '11:00'],
            ['jam_mulai' => '10:00', 'jam_selesai' => '11:00'],
            ['jam_mulai' => '10:00', 'jam_selesai' => '12:00'],
            ['jam_mulai' => '13:00', 'jam_selesai' => '14:00'],
            ['jam_mulai' => '13:00', 'jam_selesai' => '15:00'],
            ['jam_mulai' => '14:00', 'jam_selesai' => '15:00'],
            ['jam_mulai' => '14:00', 'jam_selesai' => '16:00'],
        ];

        foreach ($data as $item) {
            Jam::firstOrCreate(
                ['jam_mulai' => $item['jam_mulai'], 'jam_selesai' => $item['jam_selesai']],
                $item,
            );
        }
    }
}
