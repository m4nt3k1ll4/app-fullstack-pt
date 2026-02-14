<?php

namespace App\Services;

use Illuminate\Support\Str;

class ApiKeyService
{
    /**
     * Genera una API Key segura en Base64
     * 
     * @return string
     */
    public function generate(): string
    {
        // Generar 32 bytes aleatorios seguros y codificar en Base64
        $randomBytes = random_bytes(32);
        $apiKey = base64_encode($randomBytes);
        
        // Reemplazar caracteres problemáticos para URLs
        $apiKey = str_replace(['+', '/', '='], ['-', '_', ''], $apiKey);
        
        return 'sk_' . $apiKey;
    }

    /**
     * Valida el formato de una API Key
     * 
     * @param string $apiKey
     * @return bool
     */
    public function validate(string $apiKey): bool
    {
        // Verificar que comience con 'sk_' y tenga longitud apropiada
        if (!str_starts_with($apiKey, 'sk_')) {
            return false;
        }

        $key = substr($apiKey, 3);
        
        // Verificar longitud aproximada (Base64 de 32 bytes = ~43 caracteres)
        return strlen($key) >= 40 && strlen($key) <= 45;
    }

    /**
     * Hash de la API Key para almacenar en BD
     * 
     * @param string $apiKey
     * @return string
     */
    public function hash(string $apiKey): string
    {
        return hash('sha256', $apiKey);
    }
}
