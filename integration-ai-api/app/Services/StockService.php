<?php

namespace App\Services;

use App\Helpers\QueryHelper;
use App\Models\Stock;
use App\Models\Products;
use Illuminate\Pagination\LengthAwarePaginator;

class StockService
{
    /**
     * Obtiene todos los stocks con paginación
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Stock::with('product')->orderByDesc('id');

        if (!empty($filters['product_id'])) {
            $query->where('product_id', $filters['product_id']);
        }

        if (!empty($filters['search'])) {
            $query->whereHas('product', function ($q) use ($filters) {
                QueryHelper::applySearch($q, $filters['search'], ['name']);
            });
        }

        return QueryHelper::paginate($query, $filters);
    }

    /**
     * Busca un stock por ID
     *
     * @param int $id
     * @return Stock
     */
    public function findById(int $id): Stock
    {
        return Stock::with('product')->findOrFail($id);
    }

    /**
     * Busca un stock por product_id
     *
     * @param int $productId
     * @return Stock|null
     */
    public function findByProductId(int $productId): ?Stock
    {
        return Stock::with('product')->where('product_id', $productId)->first();
    }

    /**
     * Crea un nuevo stock para un producto
     *
     * @param array $data
     * @return Stock
     */
    public function create(array $data): Stock
    {
        // Verificar que el producto existe
        Products::findOrFail($data['product_id']);

        // Calcular total_stock automáticamente
        $stock = Stock::create([
            'product_id' => $data['product_id'],
            'stock' => $data['stock'] ?? 0,
            'unit_value' => $data['unit_value'] ?? 0,
            'sale_value' => $data['sale_value'] ?? 0,
            'total_stock' => ($data['stock'] ?? 0) * ($data['unit_value'] ?? 0),
        ]);

        return $stock->load('product');
    }

    /**
     * Actualiza un stock existente
     *
     * @param int $id
     * @param array $data
     * @return Stock
     */
    public function update(int $id, array $data): Stock
    {
        $stock = Stock::findOrFail($id);

        $newStock = $data['stock'] ?? $stock->stock;
        $newUnitValue = $data['unit_value'] ?? $stock->unit_value;

        $stock->update([
            'stock' => $newStock,
            'unit_value' => $data['unit_value'] ?? $stock->unit_value,
            'sale_value' => $data['sale_value'] ?? $stock->sale_value,
            'total_stock' => $newStock * $newUnitValue,
        ]);

        return $stock->fresh()->load('product');
    }

    /**
     * Elimina un stock
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $stock = Stock::findOrFail($id);
        return $stock->delete();
    }
}
