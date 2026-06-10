<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('header_logo', 500)->nullable();
            $table->string('ttd_image', 500)->nullable();
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });

        DB::table('templates')->insert([
            'header_logo' => null,
            'ttd_image' => null,
            'deskripsi' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
