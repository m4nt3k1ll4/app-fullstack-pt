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
        Schema::table('users', function (Blueprint $table) {
            // Índice en is_approved: usado en filtros de admin (getAllUsers, getPendingUsers, getStatistics)
            $table->index('is_approved');

            // Índice compuesto: búsqueda de usuarios aprobados con API key (ValidateApiKey middleware)
            $table->index(['api_key', 'is_approved']);

            // Índice en created_at: usado en orderBy('created_at', 'desc') en listados
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['is_approved']);
            $table->dropIndex(['api_key', 'is_approved']);
            $table->dropIndex(['created_at']);
        });
    }
};
