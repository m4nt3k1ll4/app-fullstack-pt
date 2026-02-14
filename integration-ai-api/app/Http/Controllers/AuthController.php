<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * Registra un nuevo usuario
     * 
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->register($request->validated());

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => [
                    'user' => $result['user']->only(['id', 'name', 'email', 'is_approved']),
                ],
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar usuario.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Inicia sesión y genera API Key
     * 
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login($request->validated());

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => [
                    'user' => $result['user'],
                    'api_key' => $result['api_key'],
                ],
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación.',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al iniciar sesión.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Aprueba un usuario (solo admin)
     * 
     * @param int $userId
     * @return JsonResponse
     */
    public function approve(int $userId): JsonResponse
    {
        try {
            $result = $this->authService->approveUser($userId);

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => [
                    'user' => $result['user'],
                    'api_key' => $result['api_key'] ?? null,
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
}
