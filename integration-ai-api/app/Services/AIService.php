<?php

namespace App\Services;

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
            // Aquí integrarías con tu servicio de IA (OpenAI, Anthropic, etc.)
            // Ejemplo con OpenAI:
            
            $apiKey = config('services.openai.key');
            
            if (!$apiKey) {
                throw new \Exception('API Key de OpenAI no configurada');
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(60)->post('https://api.openai.com/v1/chat/completions', [
                'model' => $options['model'] ?? 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
                'max_tokens' => $options['max_tokens'] ?? 1000,
                'temperature' => $options['temperature'] ?? 0.7,
            ]);

            if ($response->failed()) {
                throw new \Exception('Error en la petición a la API de IA: ' . $response->body());
            }

            $data = $response->json();

            return [
                'success' => true,
                'response' => $data['choices'][0]['message']['content'] ?? '',
                'usage' => $data['usage'] ?? [],
                'model' => $data['model'] ?? '',
            ];

        } catch (\Exception $e) {
            Log::error('Error en AIService: ' . $e->getMessage());
            
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Procesa múltiples prompts en lote
     * 
     * @param array $prompts
     * @param array $options
     * @return array
     */
    public function processBatch(array $prompts, array $options = []): array
    {
        $results = [];

        foreach ($prompts as $index => $prompt) {
            $results[$index] = $this->processPrompt($prompt, $options);
        }

        return $results;
    }
}
