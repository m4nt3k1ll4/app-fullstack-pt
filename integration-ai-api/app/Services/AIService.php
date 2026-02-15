<?php

namespace App\Services;

use App\Helpers\ServiceResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIService
{
    /**
     * Procesa una petición a la API de IA
     *
     * @param string $prompt
     * @param array $options
     * @return array
     */
    public function processPrompt(string $prompt, array $options = []): array
    {
        try {
            // Integración con Google Gemini API

            $apiKey = config('services.gemini.key');

            if (!$apiKey) {
                throw new \Exception('API Key de Gemini no configurada');
            }

            $model = $options['model'] ?? 'gemini-2.5-flash';
            $maxTokens = $options['max_tokens'] ?? 1000;
            $temperature = $options['temperature'] ?? 0.7;

            // URL de la API de Gemini
            $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->timeout(60)->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            [
                                'text' => $prompt,
                            ],
                        ],
                    ],
                ],
                'generationConfig' => [
                    'temperature' => $temperature,
                    'maxOutputTokens' => $maxTokens,
                ],
            ]);

            if ($response->failed()) {
                throw new \Exception('Error en la petición a la API de Gemini: ' . $response->body());
            }

            $data = $response->json();

            // Extraer el texto de la respuesta de Gemini
            $responseText = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

            return ServiceResponse::success('Prompt procesado', [
                'response' => $responseText,
                'usage' => $data['usageMetadata'] ?? [],
                'model' => $model,
            ]);

        } catch (\Exception $e) {
            Log::error('Error en AIService: ' . $e->getMessage());

            return ServiceResponse::error($e->getMessage());
        }
    }
}
