<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DosenController;
use App\Http\Controllers\Admin\JamController;
use App\Http\Controllers\Admin\MahasiswaController;
use App\Http\Controllers\Admin\PicController;
use App\Http\Controllers\Admin\ProgramStudiController;
use App\Http\Controllers\Admin\RuanganController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\SidangController as AdminSidangController;
use App\Http\Controllers\Admin\TahunAkademikController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;
use App\Http\Controllers\User\JadwalSidangController;
use App\Http\Controllers\User\TemplateController;
use App\Http\Controllers\User\SidangController as UserSidangController;
use App\Http\Controllers\User\UndanganController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $user = auth()->user();
    if (! $user) {
        return redirect()->route('login');
    }

    return $user->role === 'admin'
        ? redirect()->route('admin.dashboard')
        : redirect()->route('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');

    Route::resource('sidang', UserSidangController::class);
    Route::get('/sidang/export', [UserSidangController::class, 'export'])
        ->name('sidang.export');

    Route::post('/sidang/{sidang}/jadwal', [JadwalSidangController::class, 'store'])
        ->name('sidang.jadwal.store');
    Route::put('/sidang/{sidang}/jadwal', [JadwalSidangController::class, 'update'])
        ->name('sidang.jadwal.update');

    Route::get('/undangan/dosen-schedules', [UndanganController::class, 'dosenSchedules'])
        ->name('undangan.dosen-schedules');
    Route::resource('undangan', UndanganController::class);
    Route::get('/undangan/{undangan}/preview', [UndanganController::class, 'preview'])
        ->name('undangan.preview');
    Route::get('/undangan/{undangan}/download', [UndanganController::class, 'download'])
        ->name('undangan.download');

    Route::get('/template', [TemplateController::class, 'edit'])->name('template.edit');
    Route::put('/template', [TemplateController::class, 'update'])->name('template.update');
    Route::get('/template/preview', [TemplateController::class, 'preview'])->name('template.preview');
});

// Admin Routes
Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])
            ->name('dashboard');

        Route::resource('users', UserController::class)
            ->except(['show']);
        Route::resource('dosen', DosenController::class)
            ->except(['show']);
        Route::get('/dosen/bulk', [DosenController::class, 'bulkCreate'])
            ->name('dosen.bulk.create');
        Route::post('/dosen/bulk', [DosenController::class, 'bulkStore'])
            ->name('dosen.bulk.store');
        Route::get('/dosen/bulk/template', [DosenController::class, 'downloadTemplate'])
            ->name('dosen.bulk.template');

        Route::resource('mahasiswa', MahasiswaController::class)
            ->except(['show']);
        Route::get('/mahasiswa/bulk', [MahasiswaController::class, 'bulkCreate'])
            ->name('mahasiswa.bulk.create');
        Route::post('/mahasiswa/bulk', [MahasiswaController::class, 'bulkStore'])
            ->name('mahasiswa.bulk.store');
        Route::get('/mahasiswa/bulk/template', [MahasiswaController::class, 'downloadTemplate'])
            ->name('mahasiswa.bulk.template');

        Route::resource('pic', PicController::class)
            ->except(['show']);
        Route::get('/pic/bulk', [PicController::class, 'bulkCreate'])
            ->name('pic.bulk.create');
        Route::post('/pic/bulk', [PicController::class, 'bulkStore'])
            ->name('pic.bulk.store');
        Route::get('/pic/bulk/template', [PicController::class, 'downloadTemplate'])
            ->name('pic.bulk.template');

        Route::resource('program-studi', ProgramStudiController::class)
            ->except(['show']);
        Route::get('/program-studi/bulk', [ProgramStudiController::class, 'bulkCreate'])
            ->name('program-studi.bulk.create');
        Route::post('/program-studi/bulk', [ProgramStudiController::class, 'bulkStore'])
            ->name('program-studi.bulk.store');
        Route::get('/program-studi/bulk/template', [ProgramStudiController::class, 'downloadTemplate'])
            ->name('program-studi.bulk.template');

        Route::resource('ruangan', RuanganController::class)
            ->except(['show']);
        Route::get('/ruangan/bulk', [RuanganController::class, 'bulkCreate'])
            ->name('ruangan.bulk.create');
        Route::post('/ruangan/bulk', [RuanganController::class, 'bulkStore'])
            ->name('ruangan.bulk.store');
        Route::get('/ruangan/bulk/template', [RuanganController::class, 'downloadTemplate'])
            ->name('ruangan.bulk.template');

        Route::resource('jam', JamController::class)
            ->except(['show']);
        Route::get('/jam/bulk', [JamController::class, 'bulkCreate'])
            ->name('jam.bulk.create');
        Route::post('/jam/bulk', [JamController::class, 'bulkStore'])
            ->name('jam.bulk.store');
        Route::get('/jam/bulk/template', [JamController::class, 'downloadTemplate'])
            ->name('jam.bulk.template');

        Route::get('/sidang', [AdminSidangController::class, 'index'])
            ->name('sidang.index');
        Route::get('/sidang/export', [AdminSidangController::class, 'export'])
            ->name('sidang.export');
        Route::get('/sidang/bulk', [AdminSidangController::class, 'bulkCreate'])
            ->name('sidang.bulk.create');
        Route::post('/sidang/bulk', [AdminSidangController::class, 'bulkStore'])
            ->name('sidang.bulk.store');
        Route::get('/sidang/bulk/template', [AdminSidangController::class, 'downloadTemplate'])
            ->name('sidang.bulk.template');
        Route::get('/sidang/{sidang}', [AdminSidangController::class, 'show'])
            ->name('sidang.show');
        Route::put('/sidang/{sidang}/jadwal', [AdminSidangController::class, 'updateJadwal'])
            ->name('sidang.jadwal.update');

        Route::get('/setting', [SettingController::class, 'edit'])
            ->name('setting.edit');
        Route::put('/setting', [SettingController::class, 'update'])
            ->name('setting.update');

        Route::resource('tahun-akademik', TahunAkademikController::class)
            ->except(['show']);
        Route::patch('/tahun-akademik/{tahunAkademik}/toggle-active', [TahunAkademikController::class, 'toggleActive'])
            ->name('tahun-akademik.toggle-active');
    });

require __DIR__.'/auth.php';
