<?php

namespace App\Helpers;

use App\Models\User;
use App\Services\ApiKeyService;

class ApiKeyHelper
{
    /**
     * Genera una nueva API Key, la hashea y la guarda en el usuario.
     * Retorna la API Key en texto plano (solo se muestra una vez).
     *
     * @param User $user
     * @param ApiKeyService $apiKeyService
     * @return string API Key en texto plano
     */
    public static function assignNewKey(User $user, ApiKeyService $apiKeyService): string
    {
        $plainKey = $apiKeyService->generate();
        $user->api_key = $apiKeyService->hash($plainKey);
        $user->save();

        return $plainKey;
    }

    /**
     * Aprueba un usuario y le genera una API Key.
     * Si ya está aprobado, retorna null como api_key.
     *
     * @param User $user
     * @param ApiKeyService $apiKeyService
     * @return array{user: User, api_key: string|null, already_approved: bool}
     */
    public static function approveAndAssignKey(User $user, ApiKeyService $apiKeyService): array
    {
        if ($user->is_approved) {
            return [
                'user' => $user,
                'api_key' => null,
                'already_approved' => true,
            ];
        }

        $user->is_approved = true;
        $plainKey = self::assignNewKey($user, $apiKeyService);

        return [
            'user' => $user,
            'api_key' => $plainKey,
            'already_approved' => false,
        ];
    }
}
