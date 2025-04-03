<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourController;
use App\Http\Controllers\BaseAuthController;
use App\Http\Controllers\FormationController;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\AdminSystemAuthController;

Route::post('/login', [BaseAuthController::class, 'login']);

Route::middleware('auth:api')->post('/admin/logout', [AdminSystemAuthController::class, 'logout']);
Route::middleware(['auth:api'])->group(function () {
    Route::post('/admin/add-utilisateur', [UtilisateurController::class, 'store']);
    Route::post('/add-formation', [FormationController::class, 'store']);
    Route::post('/add-cour', [CourController::class, 'Store']);
    Route::post('/update-cour', [CourController::class, 'Update']);
    Route::post('/delete-cour', [CourController::class, 'Delete']);
});