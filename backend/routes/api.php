<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\AdminSystemAuthController;
use App\Http\Controllers\FormateurAnimateurController;
use App\Http\Controllers\ResponsableCdcController;

Route::post('/admin/login', [AdminSystemAuthController::class, 'login']);

Route::middleware('auth:api')->post('/admin/logout', [AdminSystemAuthController::class, 'logout']);
Route::middleware(['auth:api'])->group(function () {
    Route::post('/admin/add-utilisateur', [UtilisateurController::class, 'store']);
});

// Formateur Animateur :
Route::apiResource('formateurs-animateurs', FormateurAnimateurController::class);

// Responsable CDC :
Route::resource('responsable-cdc', ResponsableCdcController::class);
