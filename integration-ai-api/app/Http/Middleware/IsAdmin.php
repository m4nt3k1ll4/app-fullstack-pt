<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Maneja una petición entrante
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar que el usuario esté autenticado
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticado.',
                'error' => 'Debe iniciar sesión para acceder a este recurso.',
            ], 401);
        }

        // Verificar que el usuario sea administrador
        if (!$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Acceso denegado.',
                'error' => 'No tiene permisos de administrador para acceder a este recurso.',
            ], 403);
        }

        return $next($request);
    }
}
