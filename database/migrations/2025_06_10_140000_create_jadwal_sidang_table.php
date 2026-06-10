<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_sidang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sidang_id')->unique()->constrained('sidang')->cascadeOnDelete();
            $table->date('tanggal');
            $table->string('ruangan');
            $table->time('waktu_mulai');
            $table->time('waktu_selesai');
            $table->foreignId('pic_id')->constrained('pic')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_sidang');
    }
};
