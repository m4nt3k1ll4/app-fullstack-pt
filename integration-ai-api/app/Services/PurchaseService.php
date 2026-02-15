<?php

namespace App\Services;

use App\Helpers\QueryHelper;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PurchaseService
{
    /**
     * Crea una nueva compra con sus items y descuenta el stock.
     * Todo se ejecuta dentro de una transacción para mantener la consistencia.
     *
     * @param User $user
     * @param array $items [['product_id' => int, 'quantity' => int], ...]
     * @return Purchase
     * @throws \Exception
     */
    public function create(User $user, array $items): Purchase
    {
        return DB::transaction(function () use ($user, $items) {
            $total = 0;
            $purchaseItems = [];

            foreach ($items as $item) {
                $stock = Stock::where('product_id', $item['product_id'])
                    ->lockForUpdate()
                    ->first();

                if (!$stock) {
                    throw new \Exception("El producto ID {$item['product_id']} no tiene stock registrado.");
                }

                if ($stock->stock < $item['quantity']) {
                    $productName = $stock->product->name ?? "ID {$item['product_id']}";
                    throw new \Exception(
                        "Stock insuficiente para '{$productName}'. Disponible: {$stock->stock}, solicitado: {$item['quantity']}."
                    );
                }

                $unitPrice = $stock->sale_value;
                $subtotal = $unitPrice * $item['quantity'];
                $total += $subtotal;

                $purchaseItems[] = [
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                ];

                // Descontar stock
                $stock->stock -= $item['quantity'];
                $stock->total_stock = $stock->stock * $stock->unit_value;
                $stock->save();
            }

            // Crear la compra
            $purchase = Purchase::create([
                'user_id' => $user->id,
                'total' => $total,
                'status' => 'completed',
            ]);

            // Crear los items de la compra
            foreach ($purchaseItems as $pi) {
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    ...$pi,
                ]);
            }

            return $purchase->load(['items.product', 'user']);
        });
    }

    /**
     * Obtiene todas las compras con paginación (para admin)
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Purchase::with(['items.product', 'user'])
            ->orderByDesc('created_at');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->whereHas('user', function ($uq) use ($filters) {
                    QueryHelper::applySearch($uq, $filters['search'], ['name', 'email']);
                })->orWhereHas('items.product', function ($pq) use ($filters) {
                    QueryHelper::applySearch($pq, $filters['search'], ['name']);
                });
            });
        }

        return QueryHelper::paginate($query, $filters);
    }

    /**
     * Obtiene las compras de un usuario específico
     *
     * @param User $user
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getByUser(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = Purchase::with(['items.product'])
            ->where('user_id', $user->id)
            ->orderByDesc('created_at');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return QueryHelper::paginate($query, $filters);
    }

    /**
     * Obtiene una compra por ID
     *
     * @param int $id
     * @return Purchase
     */
    public function findById(int $id): Purchase
    {
        return Purchase::with(['items.product', 'user'])->findOrFail($id);
    }
}
