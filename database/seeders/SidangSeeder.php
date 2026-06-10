<?php

namespace Database\Seeders;

use App\Models\Dosen;
use App\Models\Jam;
use App\Models\Mahasiswa;
use App\Models\Pic;
use App\Models\Ruangan;
use App\Models\Sidang;
use App\Models\User;
use Illuminate\Database\Seeder;

class SidangSeeder extends Seeder
{
    public function run(): void
    {
        $userIds = User::pluck('id')->toArray();
        $mahasiswaIds = Mahasiswa::pluck('id')->toArray();
        $dosenIds = Dosen::pluck('id')->toArray();
        $picIds = Pic::pluck('id')->toArray();
        $ruanganIds = Ruangan::pluck('id')->toArray();
        $jamIds = Jam::pluck('id')->toArray();

        if (count($userIds) < 1 || count($mahasiswaIds) < 4 || count($dosenIds) < 3 || count($picIds) < 1 || count($ruanganIds) < 2 || count($jamIds) < 2) {
            return;
        }

        $sidangData = [];
        for ($i = 0; $i < min(10, count($mahasiswaIds)); $i++) {
            $mhsId = $mahasiswaIds[$i % count($mahasiswaIds)];
            $userIdx = $i >= 7 ? 0 : (count($userIds) > 1 ? 1 : 0);

            $d3 = $dosenIds[($i + 2) % count($dosenIds)];
            $d4 = $dosenIds[($i + 3) % count($dosenIds)];
            $d5 = $dosenIds[($i + 4) % count($dosenIds)];

            $sidangData[] = [
                'user_id' => $userIds[$userIdx],
                'mahasiswa_id' => $mhsId,
                'judul_skripsi' => 'Judul Skripsi Seeder #' . ($i + 1),
                'penguji1_id' => $d3,
                'penguji2_id' => $d4,
                'pimpinan_sidang_id' => $d5,
                'tanggal_ujian' => date('Y-m-d', strtotime('+' . ($i + 1) . ' week')),
                'tahun_akademik' => date('Y') . '1',
            ];
        }

        $jadwalRuanganIds = [];
        $jadwalJamIds = [];
        $jadwalPicIds = [];
        for ($i = 0; $i < count($sidangData); $i++) {
            $jadwalRuanganIds[] = $ruanganIds[$i % count($ruanganIds)];
            $jadwalJamIds[] = $jamIds[$i % count($jamIds)];
            $jadwalPicIds[] = $picIds[$i % count($picIds)];
        }

        foreach ($sidangData as $index => $data) {
            $sidang = Sidang::firstOrCreate(
                ['user_id' => $data['user_id'], 'mahasiswa_id' => $data['mahasiswa_id']],
                $data,
            );

            $sidang->jadwalSidang()->firstOrCreate(
                ['sidang_id' => $sidang->id],
                [
                    'tanggal' => $data['tanggal_ujian'],
                    'ruangan_id' => $jadwalRuanganIds[$index],
                    'jam_id' => $jadwalJamIds[$index],
                    'pic_id' => $jadwalPicIds[$index],
                ],
            );
        }
    }
}
