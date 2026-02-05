<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\UserController;

// Auth routes (public)
Route::post('/auth/login', [AdminController::class, 'login']);
Route::post('/auth/register', [AdminController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AdminController::class, 'logout']);
    Route::get('/auth/me', [AdminController::class, 'me']);
    
    // Cars API
    Route::prefix('cars')->group(function () {
        Route::get('/', [CarController::class, 'index']);
        Route::post('/', [CarController::class, 'store']);
        Route::get('/{id}', [CarController::class, 'show']);
        Route::put('/{id}', [CarController::class, 'update']);
        Route::delete('/{id}', [CarController::class, 'destroy']);
        Route::post('/upload', [CarController::class, 'upload']);
    });

    // Users API
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });
});

// Public car endpoints (for frontend)
Route::prefix('cars')->group(function () {
    Route::get('/', [CarController::class, 'index']);
    Route::get('/{id}', [CarController::class, 'show']);
});
