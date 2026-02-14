<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\AuthService;

class ValidateApiKey
{
    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * Maneja una petición entrante
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Obtener API Key del header Authorization
        $apiKey = $request->bearerToken();

        // Si no hay API Key en Bearer, intentar en header X-API-Key
        if (!$apiKey) {
            $apiKey = $request->header('X-API-Key');
        }

        // Verificar que exista la API Key
        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'API Key no proporcionada.',
                'error' => 'Debe incluir la API Key en el header Authorization (Bearer token) o X-API-Key.',
            ], 401);
        }

        // Validar la API Key
        $user = $this->authService->validateApiKey($apiKey);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'API Key inválida o usuario no autorizado.',
                'error' => 'La API Key proporcionada no es válida o el usuario no está aprobado.',
            ], 401);
        }

        // Adjuntar usuario a la request
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        return $next($request);
    }
}
