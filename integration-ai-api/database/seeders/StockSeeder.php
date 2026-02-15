<?php

namespace Database\Seeders;

use App\Models\Products;
use App\Models\Stock;
use Illuminate\Database\Seeder;

class StockSeeder extends Seeder
{
    /**
     * Genera stock para todos los productos existentes.
     */
    public function run(): void
    {
        $products = Products::all();

        foreach ($products as $product) {
            // Generar valores aleatorios realistas
            $stock = rand(5, 200);
            $unitValue = round($product->price * rand(40, 70) / 100, 2); // 40-70% del precio como costo
            $saleValue = (float) $product->price;

            Stock::firstOrCreate(
                ['product_id' => $product->id],
                [
                    'stock' => $stock,
                    'unit_value' => $unitValue,
                    'sale_value' => $saleValue,
                    'total_stock' => round($stock * $unitValue, 2),
                ]
            );
        }
    }
}
