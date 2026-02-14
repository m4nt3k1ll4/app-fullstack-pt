<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Elimina tablas que no se usan en el flujo actual:
     * - api_keys: reemplazada por users.api_key (SHA-256 hash)
     * - clients: reemplazada por users con roles
     * - personal_access_tokens: se conserva porque Sanctum la usa para tokens admin
     */
    public function up(): void
    {
        // api_keys depende de clients, eliminar primero
        Schema::dropIfExists('api_keys');
        Schema::dropIfExists('clients');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->enum('status', ['allowed', 'unauthorized'])->default('active');
            $table->timestamps();
        });

        Schema::create('api_keys', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('client_id');
            $table->string('key')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();

            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
            $table->index('client_id');
        });
    }
};
