<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BaseAuthController;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\AdminSystemAuthController;

Route::post('/login', [BaseAuthController::class, 'login']);

Route::middleware('auth:api')->post('/admin/logout', [AdminSystemAuthController::class, 'logout']);
Route::middleware(['auth:api'])->group(function () {
    Route::post('/admin/add-utilisateur', [UtilisateurController::class, 'store']);
});