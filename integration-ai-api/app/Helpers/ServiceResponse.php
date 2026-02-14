<?php

namespace App\Helpers;

class ServiceResponse
{
    /**
     * Crea un array de respuesta exitosa estandarizado.
     *
     * @param string $message
     * @param array $data Datos adicionales a incluir
     * @return array
     */
    public static function success(string $message, array $data = []): array
    {
        return array_merge([
            'success' => true,
            'message' => $message,
        ], $data);
    }

    /**
     * Crea un array de respuesta de error estandarizado.
     *
     * @param string $message
     * @param array $data Datos adicionales de contexto
     * @return array
     */
    public static function error(string $message, array $data = []): array
    {
        return array_merge([
            'success' => false,
            'error' => $message,
        ], $data);
    }
}
