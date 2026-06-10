<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            $table->string('ttd_nama', 200)->nullable()->after('ttd_image');
            $table->string('ttd_nip', 50)->nullable()->after('ttd_nama');
        });
    }

    public function down(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            $table->dropColumn(['ttd_nip', 'ttd_nama']);
        });
    }
};
