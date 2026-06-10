<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jadwal_sidang', function (Blueprint $table) {
            $table->dropColumn(['ruangan', 'waktu_mulai', 'waktu_selesai']);
            $table->foreignId('ruangan_id')->after('tanggal')->constrained('ruangan')->cascadeOnDelete();
            $table->foreignId('jam_id')->after('ruangan_id')->constrained('jam')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('jadwal_sidang', function (Blueprint $table) {
            $table->dropForeign(['ruangan_id']);
            $table->dropForeign(['jam_id']);
            $table->dropColumn(['ruangan_id', 'jam_id']);
            $table->string('ruangan')->after('tanggal');
            $table->time('waktu_mulai')->after('ruangan');
            $table->time('waktu_selesai')->after('waktu_mulai');
        });
    }
};
