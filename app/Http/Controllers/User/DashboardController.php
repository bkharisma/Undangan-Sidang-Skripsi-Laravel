<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Sidang;
use App\Models\Undangan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->user()->id;

        $totalSidang = Sidang::where('user_id', $userId)->count();
        $totalBerjadwal = Sidang::where('user_id', $userId)->whereHas('jadwalSidang')->count();
        $totalUndangan = Undangan::where('user_id', $userId)->count();

        return Inertia::render('User/Dashboard', [
            'stats' => [
                'total_sidang' => $totalSidang,
                'total_berjadwal' => $totalBerjadwal,
                'total_undangan' => $totalUndangan,
            ],
        ]);
    }
}
