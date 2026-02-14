<?php

namespace App\Http\Controllers;

use App\Http\Requests\AIPromptRequest;
use App\Services\AIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AIController extends Controller
{
    public function __construct(
        protected AIService $aiService
    ) {}

    /**
     * Procesa un prompt con IA
     *
     * @param AIPromptRequest $request
     * @return JsonResponse
     */
    public function processPrompt(AIPromptRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Extraer opciones
            $options = [
                'model' => $validated['model'] ?? 'gemini-pro',
                'max_tokens' => $validated['max_tokens'] ?? 1000,
                'temperature' => $validated['temperature'] ?? 0.7,
            ];

            $result = $this->aiService->processPrompt($validated['prompt'], $options);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al procesar el prompt.',
                    'error' => $result['error'],
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Prompt procesado exitosamente.',
                'data' => [
                    'response' => $result['response'],
                    'model' => $result['model'],
                    'usage' => $result['usage'],
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el prompt.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Procesa múltiples prompts en lote
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function processBatch(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'prompts' => 'required|array|min:1|max:10',
                'prompts.*' => 'required|string|max:4000',
                'model' => 'nullable|string|in:gemini-pro,gemini-pro-vision',
            ]);

            $options = [
                'model' => $request->input('model', 'gemini-pro'),
            ];

            $results = $this->aiService->processBatch($request->input('prompts'), $options);

            return response()->json([
                'success' => true,
                'message' => 'Prompts procesados exitosamente.',
                'data' => [
                    'results' => $results,
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar los prompts.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtiene información del usuario autenticado
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $request->user()->only(['id', 'name', 'email', 'is_approved']),
            ],
        ], 200);
    }
}
