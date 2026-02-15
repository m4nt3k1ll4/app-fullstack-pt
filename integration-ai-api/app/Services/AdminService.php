<?php

namespace App\Services;

use App\Helpers\ApiKeyHelper;
use App\Helpers\QueryHelper;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

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
        $query = User::with('roles')->latest();

        if (isset($filters['is_approved'])) {
            $query->where('is_approved', filter_var($filters['is_approved'], FILTER_VALIDATE_BOOLEAN));
        }

        if (!empty($filters['search'])) {
            QueryHelper::applySearch($query, $filters['search'], ['name', 'email']);
        }

        return QueryHelper::paginate($query, $filters);
    }

    /**
     * Obtiene solo usuarios pendientes de aprobación
     *
     * @return Collection
     */
    public function getPendingUsers(array $filters = []): LengthAwarePaginator
    {
        $query = User::with('roles')
            ->where('is_approved', false)
            ->latest();

        return QueryHelper::paginate($query, $filters, 15);
    }

    /**
     * Obtiene un usuario por ID
     *
     * @param int $userId
     * @return User
     */
    public function findUser(int $userId): User
    {
        return User::with('roles')->findOrFail($userId);
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
        $result = ApiKeyHelper::approveAndAssignKey($user, $this->apiKeyService);

        $result['message'] = $result['already_approved']
            ? 'El usuario ya estaba aprobado.'
            : 'Usuario aprobado exitosamente.';

        return $result;
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

        $apiKey = ApiKeyHelper::assignNewKey($user, $this->apiKeyService);

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
        // Una sola query con conteos condicionales en vez de 4 queries separadas
        $stats = User::query()->selectRaw("
            COUNT(*) as total_users,
            SUM(CASE WHEN is_approved = true THEN 1 ELSE 0 END) as approved_users,
            SUM(CASE WHEN is_approved = false THEN 1 ELSE 0 END) as pending_users,
            SUM(CASE WHEN api_key IS NOT NULL THEN 1 ELSE 0 END) as users_with_api_key
        ")->first();

        return [
            'total_users' => (int) $stats->total_users,
            'approved_users' => (int) $stats->approved_users,
            'pending_users' => (int) $stats->pending_users,
            'users_with_api_key' => (int) $stats->users_with_api_key,
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
            // exists() es más eficiente que first() — no carga el modelo completo
            $emailTaken = User::where('email', $data['email'])
                ->where('id', '!=', $userId)
                ->exists();

            if ($emailTaken) {
                throw new \Exception('El email ya está en uso por otro usuario.');
            }

            $user->email = $data['email'];
        }

        $user->save();

        return $user;
    }
}
