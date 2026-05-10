<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NoteController;
use Illuminate\Support\Facades\Route;

// ── Routes publiques ─────────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ── Routes protégées par Sanctum ─────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Authentification & profil
    Route::post('/logout',       [AuthController::class, 'logout']);
    Route::get('/user',          [AuthController::class, 'me']);
    Route::put('/user/password', [AuthController::class, 'changePassword']);
    Route::delete('/user',       [AuthController::class, 'deleteAccount']);
    Route::get('/tags',          [AuthController::class, 'tags']);

    // Notes CRUD + actions
    Route::apiResource('notes', NoteController::class);
    Route::patch('/notes/{id}/pin', [NoteController::class, 'togglePin']);
    Route::get('/stats',            [NoteController::class, 'stats']);
});
