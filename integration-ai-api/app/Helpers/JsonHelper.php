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
}
