<?php

namespace App\Http\Controllers;

use App\Services\AdminService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct(
        protected AdminService $adminService
    ) {}

    /**
     * Lista todos los usuarios con filtros opcionales
     *
     * GET /api/admin/users?is_approved=false&search=john&per_page=10
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['is_approved', 'search', 'per_page']);
            $users = $this->adminService->getAllUsers($filters);

            return response()->json([
                'success' => true,
                'message' => 'Usuarios obtenidos exitosamente.',
                'data' => $users->items(),
                'meta' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuarios.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtiene usuarios pendientes de aprobación
     *
     * GET /api/admin/users/pending
     *
     * @return JsonResponse
     */
    public function pending(): JsonResponse
    {
        try {
            $users = $this->adminService->getPendingUsers();

            return response()->json([
                'success' => true,
                'message' => 'Usuarios pendientes obtenidos exitosamente.',
                'data' => $users,
                'meta' => [
                    'total' => $users->count(),
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener usuarios pendientes.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Muestra un usuario específico
     *
     * GET /api/admin/users/{id}
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $user = $this->adminService->findUser($id);

            return response()->json([
                'success' => true,
                'message' => 'Usuario obtenido exitosamente.',
                'data' => $user,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Aprueba un usuario y genera su API Key
     *
     * POST /api/admin/users/{id}/approve
     *
     * @param int $id
     * @return JsonResponse
     */
    public function approve(int $id): JsonResponse
    {
        try {
            $result = $this->adminService->approveUser($id);

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => [
                    'user' => $result['user']->only(['id', 'name', 'email', 'is_approved', 'created_at']),
                    'api_key' => $result['api_key'],
                    'already_approved' => $result['already_approved'],
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al aprobar usuario.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Revoca la aprobación de un usuario
     *
     * POST /api/admin/users/{id}/revoke
     *
     * @param int $id
     * @return JsonResponse
     */
    public function revoke(int $id): JsonResponse
    {
        try {
            $user = $this->adminService->revokeApproval($id);

            return response()->json([
                'success' => true,
                'message' => 'Aprobación revocada exitosamente.',
                'data' => $user->only(['id', 'name', 'email', 'is_approved']),
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al revocar aprobación.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Regenera la API Key de un usuario
     *
     * POST /api/admin/users/{id}/regenerate-key
     *
     * @param int $id
     * @return JsonResponse
     */
    public function regenerateKey(int $id): JsonResponse
    {
        try {
            $result = $this->adminService->regenerateApiKey($id);

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => [
                    'user' => $result['user']->only(['id', 'name', 'email', 'is_approved']),
                    'api_key' => $result['api_key'],
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al regenerar API Key.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Actualiza información de un usuario
     *
     * PUT/PATCH /api/admin/users/{id}
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|max:255',
            ]);

            $user = $this->adminService->updateUser($id, $validated);

            return response()->json([
                'success' => true,
                'message' => 'Usuario actualizado exitosamente.',
                'data' => $user->only(['id', 'name', 'email', 'is_approved', 'created_at', 'updated_at']),
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación.',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar usuario.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Elimina un usuario
     *
     * DELETE /api/admin/users/{id}
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->adminService->deleteUser($id);

            return response()->json([
                'success' => true,
                'message' => 'Usuario eliminado exitosamente.',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar usuario.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtiene estadísticas de usuarios
     *
     * GET /api/admin/statistics
     *
     * @return JsonResponse
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = $this->adminService->getStatistics();

            return response()->json([
                'success' => true,
                'message' => 'Estadísticas obtenidas exitosamente.',
                'data' => $stats,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
