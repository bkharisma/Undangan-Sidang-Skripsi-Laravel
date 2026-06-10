<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\Pic;
use App\Models\Sidang;
use App\Models\Undangan;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_user' => User::count(),
                'total_dosen' => Dosen::count(),
                'total_mahasiswa' => Mahasiswa::count(),
                'total_pic' => Pic::count(),
                'total_sidang' => Sidang::count(),
                'total_undangan' => Undangan::count(),
            ],
        ]);
    }
}
