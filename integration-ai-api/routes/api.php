<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\AdminController;

// ============================================
// Rutas Públicas (No requieren autenticación)
// ============================================

// Autenticación
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
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

    // Endpoints de Productos (CRUD completo)
    Route::prefix('products')->group(function () {
        Route::get('/', [ProductsController::class, 'index']);
        Route::post('/', [ProductsController::class, 'store']);
        Route::get('/search/{term}', [ProductsController::class, 'search']);
        Route::get('/{id}', [ProductsController::class, 'show']);
        Route::put('/{id}', [ProductsController::class, 'update']);
        Route::patch('/{id}', [ProductsController::class, 'update']);
        Route::delete('/{id}', [ProductsController::class, 'destroy']);
        Route::post('/{id}/generate-description', [ProductsController::class, 'generateDescription']);
    });

    // ============================================
    // Endpoints Administrativos (Solo Administradores)
    // ============================================
    Route::middleware('is.admin')->prefix('admin')->group(function () {

        // Estadísticas
        Route::get('/statistics', [AdminController::class, 'statistics']);

        // Gestión de Usuarios
        Route::prefix('users')->group(function () {
            Route::get('/', [AdminController::class, 'index']);
            Route::get('/pending', [AdminController::class, 'pending']);
            Route::get('/{id}', [AdminController::class, 'show']);
            Route::put('/{id}', [AdminController::class, 'update']);
            Route::patch('/{id}', [AdminController::class, 'update']);
            Route::delete('/{id}', [AdminController::class, 'destroy']);

            // Acciones específicas
            Route::post('/{id}/approve', [AdminController::class, 'approve']);
            Route::post('/{id}/revoke', [AdminController::class, 'revoke']);
            Route::post('/{id}/regenerate-key', [AdminController::class, 'regenerateKey']);
        });
    });

});



