<?php

namespace Database\Seeders;

use App\Models\Mahasiswa;
use Illuminate\Database\Seeder;

class MahasiswaSeeder extends Seeder
{
    public function run(): void
    {
        $mahasiswa = [
            ['nim' => '20010001', 'nama' => 'Andi Pratama', 'program_studi' => 'Divisi Kamar'],
            ['nim' => '20010002', 'nama' => 'Bunga Citra', 'program_studi' => 'Tata Hidang'],
            ['nim' => '20010003', 'nama' => 'Citra Dewi', 'program_studi' => 'Seni Kuliner'],
            ['nim' => '20010004', 'nama' => 'Dimas Ardian', 'program_studi' => 'Pengelolaan Konvensi dan Acara'],
            ['nim' => '20010005', 'nama' => 'Eka Putri', 'program_studi' => 'Divisi Kamar'],
            ['nim' => '20010006', 'nama' => 'Fajar Nugroho', 'program_studi' => 'Seni Kuliner'],
            ['nim' => '20010007', 'nama' => 'Gita Permata', 'program_studi' => 'Pengelolaan Konvensi dan Acara'],
            ['nim' => '20010008', 'nama' => 'Hadi Rahman', 'program_studi' => 'Tata Hidang'],
            ['nim' => '20010009', 'nama' => 'Indah Sari', 'program_studi' => 'Divisi Kamar'],
            ['nim' => '20010010', 'nama' => 'Joko Susilo', 'program_studi' => 'Pengelolaan Konvensi dan Acara'],
        ];

        foreach ($mahasiswa as $m) {
            Mahasiswa::firstOrCreate(['nim' => $m['nim']], $m);
        }
    }
}
