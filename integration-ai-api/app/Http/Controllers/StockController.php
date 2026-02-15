<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateStockRequest;
use App\Http\Requests\UpdateStockRequest;
use App\Services\StockService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function __construct(
        protected StockService $stockService
    ) {}

    /**
     * Lista todos los stocks con paginación
     *
     * GET /api/stocks?search=laptop&product_id=1&per_page=10
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['search', 'product_id', 'per_page']);
            $stocks = $this->stockService->getAll($filters);

            return response()->json([
                'success' => true,
                'message' => 'Stocks obtenidos exitosamente.',
                'data' => $stocks->items(),
                'meta' => [
                    'current_page' => $stocks->currentPage(),
                    'last_page' => $stocks->lastPage(),
                    'per_page' => $stocks->perPage(),
                    'total' => $stocks->total(),
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener stocks.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Muestra un stock específico
     *
     * GET /api/stocks/{id}
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $stock = $this->stockService->findById($id);

            return response()->json([
                'success' => true,
                'message' => 'Stock obtenido exitosamente.',
                'data' => $stock,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Stock no encontrado.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Muestra el stock de un producto específico
     *
     * GET /api/stocks/product/{productId}
     *
     * @param int $productId
     * @return JsonResponse
     */
    public function showByProduct(int $productId): JsonResponse
    {
        try {
            $stock = $this->stockService->findByProductId($productId);

            if (!$stock) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este producto no tiene stock registrado.',
                    'error' => 'Stock no encontrado para el producto especificado.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Stock del producto obtenido exitosamente.',
                'data' => $stock,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener stock del producto.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Crea un nuevo stock
     *
     * POST /api/stocks
     *
     * @param CreateStockRequest $request
     * @return JsonResponse
     */
    public function store(CreateStockRequest $request): JsonResponse
    {
        try {
            $stock = $this->stockService->create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Stock creado exitosamente.',
                'data' => $stock,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear stock.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualiza un stock existente
     *
     * PUT/PATCH /api/stocks/{id}
     *
     * @param UpdateStockRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateStockRequest $request, int $id): JsonResponse
    {
        try {
            $stock = $this->stockService->update($id, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Stock actualizado exitosamente.',
                'data' => $stock,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar stock.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Elimina un stock
     *
     * DELETE /api/stocks/{id}
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->stockService->delete($id);

            return response()->json([
                'success' => true,
                'message' => 'Stock eliminado exitosamente.',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar stock.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
