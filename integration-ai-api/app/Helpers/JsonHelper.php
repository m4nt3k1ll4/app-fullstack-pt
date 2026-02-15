<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;

class JsonHelper
{
    /**
     * Decodifica un string JSON de forma segura.
     * Si falla, retorna null sin lanzar excepción.
     *
     * @param string $json
     * @param bool $assoc Retornar array asociativo
     * @return array|null
     */
    public static function safeDecode(string $json, bool $assoc = true): ?array
    {
        $decoded = json_decode($json, $assoc);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::warning('JsonHelper::safeDecode falló: ' . json_last_error_msg(), [
                'input' => substr($json, 0, 200),
            ]);
            return null;
        }

        return $decoded;
    }

    /**
     * Extrae un campo de un string JSON.
     * Si el parsing falla o el campo no existe, retorna el fallback.
     *
     * @param string $json
     * @param string $key Campo a extraer
     * @param string|null $fallback Valor por defecto si falla
     * @return string|null
     */
    public static function extractOrFallback(string $json, string $key, ?string $fallback = null): ?string
    {
        $decoded = self::safeDecode($json);

        return $decoded[$key] ?? ($fallback ?? $json);
    }

    /**
     * Limpia una respuesta de IA eliminando bloques de código markdown,
     * intentando extraer JSON, o devolviendo el texto limpio.
     *
     * @param string $response
     * @return string
     */
    public static function cleanAIResponse(string $response): string
    {
        $cleaned = $response;

        // Eliminar bloques de código markdown (```json ... ``` o ``` ... ```)
        if (preg_match('/```(?:json)?\s*(.+?)\s*```/s', $cleaned, $matches)) {
            $cleaned = $matches[1];
        }

        // Si parece JSON, intentar extraer el campo 'description'
        $trimmed = trim($cleaned);
        if (str_starts_with($trimmed, '{')) {
            $decoded = self::safeDecode($trimmed);
            if ($decoded && isset($decoded['description'])) {
                return trim($decoded['description']);
            }
        }

        // Devolver texto limpio
        return trim($cleaned);
    }
}
