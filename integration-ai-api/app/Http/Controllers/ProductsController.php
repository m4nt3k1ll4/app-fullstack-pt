<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Services\ProductService;
use App\Services\AIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductsController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    /**
     * Lista todos los productos con filtros opcionales
     * 
     * GET /api/products?search=laptop&min_price=100&max_price=1000&per_page=10
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['search', 'min_price', 'max_price', 'per_page']);
            $products = $this->productService->getAll($filters);

            return response()->json([
                'success' => true,
                'message' => 'Productos obtenidos exitosamente.',
                'data' => $products->items(),
                'meta' => [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener productos.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Muestra un producto específico
     * 
     * GET /api/products/{id}
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $product = $this->productService->findById($id);

            return response()->json([
                'success' => true,
                'message' => 'Producto obtenido exitosamente.',
                'data' => $product,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Producto no encontrado.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Crea un nuevo producto
     * 
     * POST /api/products
     * 
     * @param CreateProductRequest $request
     * @return JsonResponse
     */
    public function store(CreateProductRequest $request): JsonResponse
    {
        try {
            $product = $this->productService->create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Producto creado exitosamente.',
                'data' => $product,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear producto.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualiza un producto existente
     * 
     * PUT/PATCH /api/products/{id}
     * 
     * @param UpdateProductRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateProductRequest $request, int $id): JsonResponse
    {
        try {
            $product = $this->productService->update($id, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado exitosamente.',
                'data' => $product,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar producto.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Elimina un producto
     * 
     * DELETE /api/products/{id}
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->productService->delete($id);

            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado exitosamente.',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar producto.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Busca productos por término
     * 
     * GET /api/products/search/{term}
     * 
     * @param string $term
     * @return JsonResponse
     */
    public function search(string $term): JsonResponse
    {
        try {
            $products = $this->productService->search($term);

            return response()->json([
                'success' => true,
                'message' => 'Búsqueda completada.',
                'data' => $products,
                'meta' => [
                    'total' => $products->count(),
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la búsqueda.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Genera descripción con IA para un producto
     * 
     * POST /api/products/{id}/generate-description
     * 
     * @param int $id
     * @param AIService $aiService
     * @return JsonResponse
     */
    public function generateDescription(int $id, AIService $aiService): JsonResponse
    {
        try {
            $product = $this->productService->generateAIDescription($id, $aiService);

            return response()->json([
                'success' => true,
                'message' => 'Descripción generada exitosamente.',
                'data' => $product,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar descripción.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
