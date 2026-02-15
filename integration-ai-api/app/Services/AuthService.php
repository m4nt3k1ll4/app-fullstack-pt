<?php

namespace App\Services;

use App\Helpers\ApiKeyHelper;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        protected ApiKeyService $apiKeyService
    ) {}

    /**
     * Registra un nuevo usuario
     *
     * @param array $data
     * @return array
     */
    public function register(array $data): array
    {
        // Crear usuario con estado pendiente de aprobación
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'is_approved' => false,
            'api_key' => null,
        ]);

        // Asignar rol 'client' por defecto (los admins se asignan manualmente en BD)
        $role = Role::where('name', 'client')->first();

        if ($role) {
            $user->roles()->attach($role->id);
        }

        return [
            'user' => $user,
            'message' => 'Usuario registrado exitosamente. Pendiente de aprobación por administrador.',
        ];
    }

    /**
     * Autentica un usuario y genera API Key
     *
     * @param array $credentials
     * @return array
     * @throws ValidationException
     */
    public function login(array $credentials): array
    {
        // Buscar usuario por email
        $user = User::where('email', $credentials['email'])->first();

        // Verificar que existe y la contraseña es correcta
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        // Verificar que el usuario esté aprobado
        if (!$user->is_approved) {
            throw ValidationException::withMessages([
                'email' => ['Tu cuenta está pendiente de aprobación por un administrador.'],
            ]);
        }

        // Generar nueva API Key (siempre se regenera al hacer login)
        $apiKey = ApiKeyHelper::assignNewKey($user, $this->apiKeyService);

        $response = [
            'user' => $user->only(['id', 'name', 'email']),
            'api_key' => $apiKey,
            'message' => 'Inicio de sesión exitoso.',
        ];

        // Si es admin o interviewer, generar también token Sanctum para el panel administrativo
        if ($user->hasAdminAccess()) {
            $user->tokens()->delete();
            $token = $user->createToken('admin-session', ['admin']);
            $response['admin_token'] = $token->plainTextToken;
            $response['admin_token_expires_in'] = (int) config('sanctum.expiration', 5);
        }

        return $response;
    }

    /**
     * Aprueba un usuario y genera su API Key.
     * Delega la lógica compartida a ApiKeyHelper.
     *
     * @param int $userId
     * @return array
     */
    public function approveUser(int $userId): array
    {
        $user = User::findOrFail($userId);
        $result = ApiKeyHelper::approveAndAssignKey($user, $this->apiKeyService);

        return [
            'user' => $result['user']->only(['id', 'name', 'email', 'is_approved']),
            'api_key' => $result['api_key'],
            'message' => $result['already_approved']
                ? 'El usuario ya estaba aprobado.'
                : 'Usuario aprobado exitosamente.',
        ];
    }

    /**
     * Autentica un administrador y genera un token Sanctum con expiración.
     *
     * @param array $credentials
     * @return array
     * @throws ValidationException
     */
    public function adminLogin(array $credentials): array
    {
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        if (!$user->hasAdminAccess()) {
            throw ValidationException::withMessages([
                'email' => ['No tiene permisos de administrador.'],
            ]);
        }

        // Revocar tokens anteriores para mantener una sola sesión activa
        $user->tokens()->delete();

        // Crear token Sanctum con habilidades de admin
        $token = $user->createToken('admin-session', ['admin']);

        return [
            'user' => $user->only(['id', 'name', 'email']),
            'token' => $token->plainTextToken,
            'expires_in' => (int) config('sanctum.expiration', 5),
            'message' => 'Sesión de administrador iniciada exitosamente.',
        ];
    }

    /**
     * Cierra la sesión del administrador revocando el token actual.
     *
     * @param User $user
     * @return array
     */
    public function adminLogout(User $user): array
    {
        // Revocar solo el token actual
        $user->currentAccessToken()->delete();

        return [
            'message' => 'Sesión de administrador cerrada exitosamente.',
        ];
    }

    /**
     * Valida una API Key y retorna el usuario
     *
     * @param string $apiKey
     * @return User|null
     */
    public function validateApiKey(string $apiKey): ?User
    {
        // Validar formato
        if (!$this->apiKeyService->validate($apiKey)) {
            return null;
        }

        // Hash de la key para buscar en BD
        $hashedKey = $this->apiKeyService->hash($apiKey);

        // Buscar usuario aprobado con esa API Key
        return User::where('api_key', $hashedKey)
            ->where('is_approved', true)
            ->first();
    }
}
