<?php

namespace App\Services;

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
            'role' => $data['role'] ?? 'client', // Por defecto 'client'
            'is_approved' => false,
            'api_key' => null,
        ]);

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

        // Generar nueva API Key si no tiene una
        if (!$user->api_key) {
            $apiKey = $this->apiKeyService->generate();
            $user->api_key = $this->apiKeyService->hash($apiKey);
            $user->save();
        } else {
            // Si ya tiene una, regenerar una nueva
            $apiKey = $this->apiKeyService->generate();
            $user->api_key = $this->apiKeyService->hash($apiKey);
            $user->save();
        }

        return [
            'user' => $user->only(['id', 'name', 'email']),
            'api_key' => $apiKey,
            'message' => 'Inicio de sesión exitoso.',
        ];
    }

    /**
     * Aprueba un usuario y genera su API Key
     * 
     * @param int $userId
     * @return array
     */
    public function approveUser(int $userId): array
    {
        $user = User::findOrFail($userId);

        if ($user->is_approved) {
            return [
                'user' => $user,
                'message' => 'El usuario ya estaba aprobado.',
            ];
        }

        // Aprobar usuario y generar API Key
        $apiKey = $this->apiKeyService->generate();
        $user->is_approved = true;
        $user->api_key = $this->apiKeyService->hash($apiKey);
        $user->save();

        return [
            'user' => $user->only(['id', 'name', 'email', 'is_approved']),
            'api_key' => $apiKey,
            'message' => 'Usuario aprobado exitosamente.',
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
