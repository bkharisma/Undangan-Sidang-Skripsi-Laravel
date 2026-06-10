<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sidang', function (Blueprint $table) {
            $table->dropForeign(['pembimbing1_id']);
            $table->dropForeign(['pembimbing2_id']);
            $table->dropColumn(['pembimbing1_id', 'pembimbing2_id']);
        });
    }

    public function down(): void
    {
        Schema::table('sidang', function (Blueprint $table) {
            $table->foreignId('pembimbing1_id')->constrained('dosen')->cascadeOnDelete();
            $table->foreignId('pembimbing2_id')->constrained('dosen')->cascadeOnDelete();
        });
    }
};
