<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sidang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa')->cascadeOnDelete();
            $table->text('judul_skripsi');
            $table->foreignId('pembimbing1_id')->constrained('dosen')->cascadeOnDelete();
            $table->foreignId('pembimbing2_id')->constrained('dosen')->cascadeOnDelete();
            $table->foreignId('penguji1_id')->constrained('dosen')->cascadeOnDelete();
            $table->foreignId('penguji2_id')->constrained('dosen')->cascadeOnDelete();
            $table->foreignId('pimpinan_sidang_id')->constrained('dosen')->cascadeOnDelete();
            $table->date('tanggal_ujian');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sidang');
    }
};
