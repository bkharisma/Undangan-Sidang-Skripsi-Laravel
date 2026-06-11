<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('app_logo', 500)->nullable();
            $table->string('app_name')->nullable();
            $table->text('app_deskripsi')->nullable();
            $table->string('favicon', 500)->nullable();
            $table->string('tahun_ajaran_aktif', 5)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
