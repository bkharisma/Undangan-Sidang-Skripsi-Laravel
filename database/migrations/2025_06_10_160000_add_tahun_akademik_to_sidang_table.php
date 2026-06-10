<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sidang', function (Blueprint $table) {
            $table->string('tahun_akademik', 5)->after('tanggal_ujian');
        });
    }

    public function down(): void
    {
        Schema::table('sidang', function (Blueprint $table) {
            $table->dropColumn('tahun_akademik');
        });
    }
};
