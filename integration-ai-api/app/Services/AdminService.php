<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class AdminService
{
    public function __construct(
        protected ApiKeyService $apiKeyService
    ) {}

    /**
     * Obtiene todos los usuarios con filtros opcionales
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getAllUsers(array $filters = []): LengthAwarePaginator
    {
        $query = User::query()->latest();

        // Filtro por estado de aprobación
        if (isset($filters['is_approved'])) {
            $query->where('is_approved', filter_var($filters['is_approved'], FILTER_VALIDATE_BOOLEAN));
        }

        // Filtro por búsqueda (nombre o email)
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('email', 'like', '%' . $filters['search'] . '%');
            });
        }

        $perPage = $filters['per_page'] ?? 15;

        return $query->paginate($perPage);
    }

    /**
     * Obtiene solo usuarios pendientes de aprobación
     *
     * @return Collection
     */
    public function getPendingUsers(): Collection
    {
        return User::where('is_approved', false)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Obtiene un usuario por ID
     *
     * @param int $userId
     * @return User
     */
    public function findUser(int $userId): User
    {
        return User::findOrFail($userId);
    }

    /**
     * Aprueba un usuario y genera su API Key
     *
     * @param int $userId
     * @return array
     */
    public function approveUser(int $userId): array
    {
        $user = $this->findUser($userId);

        if ($user->is_approved) {
            return [
                'user' => $user,
                'api_key' => null,
                'message' => 'El usuario ya estaba aprobado.',
                'already_approved' => true,
            ];
        }

        // Aprobar usuario y generar API Key
        $apiKey = $this->apiKeyService->generate();
        $user->is_approved = true;
        $user->api_key = $this->apiKeyService->hash($apiKey);
        $user->save();

        return [
            'user' => $user,
            'api_key' => $apiKey,
            'message' => 'Usuario aprobado exitosamente.',
            'already_approved' => false,
        ];
    }

    /**
     * Rechaza/Revoca la aprobación de un usuario
     *
     * @param int $userId
     * @return User
     */
    public function revokeApproval(int $userId): User
    {
        $user = $this->findUser($userId);

        $user->is_approved = false;
        $user->api_key = null;
        $user->save();

        return $user;
    }

    /**
     * Regenera la API Key de un usuario aprobado
     *
     * @param int $userId
     * @return array
     */
    public function regenerateApiKey(int $userId): array
    {
        $user = $this->findUser($userId);

        if (!$user->is_approved) {
            throw new \Exception('El usuario debe estar aprobado para regenerar su API Key.');
        }

        $apiKey = $this->apiKeyService->generate();
        $user->api_key = $this->apiKeyService->hash($apiKey);
        $user->save();

        return [
            'user' => $user,
            'api_key' => $apiKey,
            'message' => 'API Key regenerada exitosamente.',
        ];
    }

    /**
     * Elimina un usuario
     *
     * @param int $userId
     * @return bool
     */
    public function deleteUser(int $userId): bool
    {
        $user = $this->findUser($userId);
        return $user->delete();
    }

    /**
     * Obtiene estadísticas de usuarios
     *
     * @return array
     */
    public function getStatistics(): array
    {
        return [
            'total_users' => User::count(),
            'approved_users' => User::where('is_approved', true)->count(),
            'pending_users' => User::where('is_approved', false)->count(),
            'users_with_api_key' => User::whereNotNull('api_key')->count(),
        ];
    }

    /**
     * Actualiza información de un usuario
     *
     * @param int $userId
     * @param array $data
     * @return User
     */
    public function updateUser(int $userId, array $data): User
    {
        $user = $this->findUser($userId);

        if (isset($data['name'])) {
            $user->name = $data['name'];
        }

        if (isset($data['email'])) {
            // Verificar que el email no esté en uso por otro usuario
            $existingUser = User::where('email', $data['email'])
                ->where('id', '!=', $userId)
                ->first();

            if ($existingUser) {
                throw new \Exception('El email ya está en uso por otro usuario.');
            }

            $user->email = $data['email'];
        }

        $user->save();

        return $user;
    }
}
