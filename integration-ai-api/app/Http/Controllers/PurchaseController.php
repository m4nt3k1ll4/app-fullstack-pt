<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreatePurchaseRequest;
use App\Models\User;
use App\Services\PurchaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    public function __construct(
        protected PurchaseService $purchaseService
    ) {}

    /**
     * Crea una nueva compra (usuario autenticado por API Key)
     *
     * POST /api/purchases
     *
     * @param CreatePurchaseRequest $request
     * @return JsonResponse
     */
    public function store(CreatePurchaseRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Find or create user by email
            $user = User::firstOrCreate(
                ['email' => $validated['user_email']],
                [
                    'name' => $validated['user_name'] ?? explode('@', $validated['user_email'])[0],
                    'password' => bcrypt(str()->random(32)), // Random password for OAuth users
                    'type' => 'user',
                ]
            );

            $purchase = $this->purchaseService->create($user, $validated['items']);

            return response()->json([
                'success' => true,
                'message' => 'Compra realizada exitosamente.',
                'data' => $purchase,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al realizar la compra.',
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Lista las compras del usuario autenticado
     *
     * GET /api/purchases/my?user_email=...
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function myPurchases(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'user_email' => 'required|email',
            ]);

            $user = User::where('email', $request->input('user_email'))->first();

            if (!$user) {
                return response()->json([
                    'success' => true,
                    'message' => 'No se encontraron compras para este usuario.',
                    'data' => [],
                    'meta' => [
                        'current_page' => 1,
                        'last_page' => 1,
                        'per_page' => 15,
                        'total' => 0,
                    ],
                ], 200);
            }

            $filters = $request->only(['status', 'per_page', 'page']);
            $purchases = $this->purchaseService->getByUser($user, $filters);

            return response()->json([
                'success' => true,
                'message' => 'Compras obtenidas exitosamente.',
                'data' => $purchases->items(),
                'meta' => [
                    'current_page' => $purchases->currentPage(),
                    'last_page' => $purchases->lastPage(),
                    'per_page' => $purchases->perPage(),
                    'total' => $purchases->total(),
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener compras.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Muestra una compra específica del usuario autenticado
     *
     * GET /api/purchases/my/{id}?user_email=...
     *
     * @param int $id
     * @param Request $request
     * @return JsonResponse
     */
    public function myPurchaseShow(int $id, Request $request): JsonResponse
    {
        try {
            $request->validate([
                'user_email' => 'required|email',
            ]);

            $user = User::where('email', $request->input('user_email'))->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado.',
                    'error' => 'No se encontró un usuario con ese email.',
                ], 404);
            }

            $purchase = $this->purchaseService->findById($id);

            // Verificar que la compra pertenece al usuario
            if ($purchase->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No autorizado para ver esta compra.',
                    'error' => 'Esta compra no pertenece al usuario.',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'message' => 'Compra obtenida exitosamente.',
                'data' => $purchase,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Compra no encontrada.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Lista todas las compras (admin)
     *
     * GET /api/admin/purchases
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['status', 'user_id', 'search', 'per_page', 'page']);
            $purchases = $this->purchaseService->getAll($filters);

            return response()->json([
                'success' => true,
                'message' => 'Ventas obtenidas exitosamente.',
                'data' => $purchases->items(),
                'meta' => [
                    'current_page' => $purchases->currentPage(),
                    'last_page' => $purchases->lastPage(),
                    'per_page' => $purchases->perPage(),
                    'total' => $purchases->total(),
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener ventas.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Muestra una compra específica (admin)
     *
     * GET /api/admin/purchases/{id}
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $purchase = $this->purchaseService->findById($id);

            return response()->json([
                'success' => true,
                'message' => 'Venta obtenida exitosamente.',
                'data' => $purchase,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Venta no encontrada.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
