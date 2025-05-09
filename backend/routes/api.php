<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourController;
use App\Http\Controllers\RapportController;
use App\Http\Controllers\BaseAuthController;
use App\Http\Controllers\FormationController;
use App\Http\Controllers\LogistiqueController;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\ResponsableCdcController;
use App\Http\Controllers\AdminSystemAuthController;
use App\Http\Controllers\ResponsableDrifController;
use App\Http\Controllers\FormateurAnimateurController;
use App\Http\Controllers\FormteurParticipantController;

Route::post('/login', [BaseAuthController::class, 'login']);

Route::middleware('auth:api')->post('/admin/logout', [AdminSystemAuthController::class, 'logout']);
Route::middleware(['auth:api'])->group(function () {
    Route::post('/admin/utilisateur', [UtilisateurController::class, 'store']);
    Route::put('/users/{id}', [UtilisateurController::class, 'update']);
    Route::delete('/users/{id}', [UtilisateurController::class, 'delete']);
    // Route::post('/admin/utilisateur', [UtilisateurController::class, 'store']);
    Route::post('/add-formation', [FormationController::class, 'store']);
    Route::post('/add-cour', [CourController::class, 'Store']);
    Route::post('/update-cour', [CourController::class, 'Update']);
    Route::post('/delete-cour', [CourController::class, 'Delete']);
    Route::get('/users', [UtilisateurController::class, 'index']);
    
    // Rapport routes
    Route::apiResource('rapports', RapportController::class);
    Route::get('rapports/course/{courseId}', [RapportController::class, 'getByCourse']);
    Route::get('rapports/responsable/{responsableId}', [RapportController::class, 'getByResponsable']);

    Route::apiResource('formateurs-animateurs', FormateurAnimateurController::class);
Route::get('/participant', [FormteurParticipantController::class, 'index']);

// Responsable CDC :
Route::resource('responsable-cdc', ResponsableCdcController::class);
Route::get('/formation', [FormationController::class, 'index']);
Route::put('/formation/{id}', [FormationController::class, 'update']);
    Route::delete('/formation/{id}', [FormationController::class, 'destroy']);
    Route::post('/formation', [FormationController::class, 'store']); 
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