<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('undangan', function (Blueprint $table) {
            if (Schema::hasColumn('undangan', 'sidang_id')) {
                $table->dropForeign(['sidang_id']);
                $table->dropColumn('sidang_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('undangan', function (Blueprint $table) {
            $table->foreignId('sidang_id')->nullable()->constrained('sidang')->cascadeOnDelete();
        });
    }
};
