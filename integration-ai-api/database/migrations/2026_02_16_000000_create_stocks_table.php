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
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->integer('stock')->default(0)->comment('Cantidad en stock');
            $table->decimal('unit_value', 10, 2)->default(0)->comment('Valor unitario de compra');
            $table->decimal('sale_value', 10, 2)->default(0)->comment('Valor de venta');
            $table->decimal('total_stock', 12, 2)->default(0)->comment('Valor total del stock (stock * unit_value)');
            $table->timestamps();

            $table->foreign('product_id')
                ->references('id')
                ->on('products')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
