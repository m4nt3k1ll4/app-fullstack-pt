<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Cambia el ID de products de UUID a autoincremental.
     * Recrea la tabla porque PostgreSQL no permite cambiar el tipo de PK directamente.
     */
    public function up(): void
    {
        Schema::dropIfExists('products');

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('features')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->text('ai_description')->nullable();
            $table->json('images')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse: vuelve a UUID
     */
    public function down(): void
    {
        Schema::dropIfExists('products');

        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('features')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->text('ai_description')->nullable();
            $table->json('images')->nullable();
            $table->timestamps();
        });
    }
};
