<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AIController;

// ============================================
// Rutas Públicas (No requieren autenticación)
// ============================================

// Autenticación
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Ruta de aprobación (deberías protegerla con un middleware de admin)
    Route::post('/approve/{userId}', [AuthController::class, 'approve']);
});

// ============================================
// Rutas Protegidas por API Key
// ============================================

Route::middleware('api.key')->group(function () {

    // Información del usuario autenticado
    Route::get('/me', [AIController::class, 'me']);

    // Endpoints de IA
    Route::prefix('ai')->group(function () {
        Route::post('/prompt', [AIController::class, 'processPrompt']);
        Route::post('/batch', [AIController::class, 'processBatch']);
    });

});

