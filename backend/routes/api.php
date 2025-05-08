<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourController;
use App\Http\Controllers\BaseAuthController;
use App\Http\Controllers\FormationController;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\AdminSystemAuthController;

use App\Http\Controllers\LogistiqueController;
use App\Http\Controllers\ResponsableDrifController;
<<<<<<< HEAD
use App\Http\Controllers\FormateurAnimateurController;
use App\Http\Controllers\ResponsableCdcController;

=======
use App\Http\Controllers\RapportController;
>>>>>>> a434633b3bbc225ad1fb1b5d3568db7055767c85

Route::post('/login', [BaseAuthController::class, 'login']);

Route::middleware('auth:api')->post('/admin/logout', [AdminSystemAuthController::class, 'logout']);
Route::middleware(['auth:api'])->group(function () {
    Route::post('/admin/add-utilisateur', [UtilisateurController::class, 'store']);
    Route::post('/add-formation', [FormationController::class, 'store']);
    Route::post('/add-cour', [CourController::class, 'Store']);
    Route::post('/update-cour', [CourController::class, 'Update']);
    Route::post('/delete-cour', [CourController::class, 'Delete']);
    Route::get('/users', [UtilisateurController::class, 'index']);
    Route::get('/formation', [FormationController::class, 'index']);

    // Rapport routes
    Route::apiResource('rapports', RapportController::class);
    Route::get('rapports/course/{courseId}', [RapportController::class, 'getByCourse']);
    Route::get('rapports/responsable/{responsableId}', [RapportController::class, 'getByResponsable']);
});
    

Route::middleware('auth:api')->group(function () {
    Route::post('/add-logistique', [LogistiqueController::class, 'store']);
    Route::put('/update-logistique/{id}', [LogistiqueController::class, 'update']);
    Route::delete('/delete-logistique/{id}', [LogistiqueController::class, 'destroy']);
});


Route::get('/get-logistiques', [LogistiqueController::class, 'index']);
Route::get('/get-logistique/{id}', [LogistiqueController::class, 'show']);

Route::middleware(['auth:api'])->group(function () {
    Route::post('drif/formations', [ResponsableDrifController::class, 'store']);
    Route::put('drif/formations/{id}/reject', [ResponsableDrifController::class, 'reject']);
    Route::delete('drif/formations/{id}', [ResponsableDrifController::class, 'destroy']);
});

// Formateur Animateur :
Route::apiResource('formateurs-animateurs', FormateurAnimateurController::class);

// Responsable CDC :
Route::resource('responsable-cdc', ResponsableCdcController::class);