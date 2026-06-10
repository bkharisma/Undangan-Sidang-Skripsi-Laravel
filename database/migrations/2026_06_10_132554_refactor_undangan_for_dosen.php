<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('undangan', function (Blueprint $table) {
            if (Schema::hasColumn('undangan', 'header_logo')) {
                $table->dropColumn('header_logo');
            }
            if (Schema::hasColumn('undangan', 'ttd_image')) {
                $table->dropColumn('ttd_image');
            }
            if (Schema::hasColumn('undangan', 'deskripsi')) {
                $table->dropColumn('deskripsi');
            }
            if (! Schema::hasColumn('undangan', 'nomor_surat')) {
                $table->string('nomor_surat', 100)->nullable()->after('dosen_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('undangan', function (Blueprint $table) {
            if (Schema::hasColumn('undangan', 'nomor_surat')) {
                $table->dropColumn('nomor_surat');
            }
            if (! Schema::hasColumn('undangan', 'header_logo')) {
                $table->string('header_logo', 500)->nullable()->after('dosen_id');
            }
            if (! Schema::hasColumn('undangan', 'ttd_image')) {
                $table->string('ttd_image', 500)->nullable()->after('header_logo');
            }
            if (! Schema::hasColumn('undangan', 'deskripsi')) {
                $table->text('deskripsi')->nullable()->after('ttd_image');
            }
        });
    }
};
