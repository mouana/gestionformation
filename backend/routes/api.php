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

    use App\Http\Controllers\RespoFormationController;

Route::post('/login', [BaseAuthController::class, 'login']);

Route::middleware('auth:api')->post('/admin/logout', [AdminSystemAuthController::class, 'logout']);
Route::middleware(['auth:api'])->group(function () {
    Route::post('/admin/add-utilisateur', [UtilisateurController::class, 'store']);
    Route::post('/add-formation', [FormationController::class, 'store']);
    Route::get('/cours', [CourController::class, 'index']);

    Route::post('/add-cour', [CourController::class, 'Store']);
    Route::put('/update-cour/{id}', [CourController::class, 'Update']); // Ajoute {id}
    Route::delete('/delete-cour/{id}', [CourController::class, 'Delete']);
    Route::get('/users', [UtilisateurController::class, 'index']);
    
    // Rapport routes
 Route::get('/rapports', [RapportController::class, 'index']);                    
Route::post('/rapports', [RapportController::class, 'store']);                   
Route::get('/rapports/{rapport}', [RapportController::class, 'show']);         
Route::put('/rapports/{rapport}', [RapportController::class, 'update']);         
Route::delete('/rapports/{rapport}', [RapportController::class, 'destroy']); 
Route::get('/rapports/course/{courseId}', [RapportController::class, 'getByCourse']);


    Route::apiResource('formateurs-animateurs', FormateurAnimateurController::class);
Route::get('/participant', [FormteurParticipantController::class, 'index']);

// Responsable CDC :
Route::resource('responsable-cdc', ResponsableCdcController::class);
Route::get('/formation', [FormationController::class, 'index']);

Route::put('/formation/{id}', [FormationController::class, 'update']);
    Route::delete('/formation/{id}', [FormationController::class, 'destroy']);
    Route::post('/formation', [FormationController::class, 'store']); 


Route::get('/respo-formations', [RespoFormationController::class, 'index']);        
Route::post('/respo-formations', [RespoFormationController::class, 'store']);        
Route::get('/respo-formations/{id}', [RespoFormationController::class, 'show']);     
Route::put('/respo-formations/{id}', [RespoFormationController::class, 'update']);   
Route::delete('/respo-formations/{id}', [RespoFormationController::class, 'destroy']);

});


Route::middleware('auth:api')->group(function () {
    Route::post('/add-logistique', [LogistiqueController::class, 'store']);
    Route::put('/update-logistique/{id}', [LogistiqueController::class, 'update']);
    Route::delete('/delete-logistique/{id}', [LogistiqueController::class, 'destroy']);
});


Route::get('/get-logistiques', [LogistiqueController::class, 'index']);
Route::get('/get-logistique/{id}', [LogistiqueController::class, 'show']);

// Route::middleware(['auth:api'])->group(function () {
//     Route::post('drif/formations', [ResponsableDrifController::class, 'store']);
//     Route::put('drif/formations/{id}/reject', [ResponsableDrifController::class, 'reject']);
//     Route::delete('drif/formations/{id}', [ResponsableDrifController::class, 'destroy']);
//     Route::get('/responsables-drif', [ResponsableDrifController::class, 'getResponsablesDrif']);
// });

Route::middleware(['auth:api'])->group(function () {
    Route::get('drif', [ResponsableDrifController::class, 'index']);
    Route::put('drif/{id}', [ResponsableDrifController::class, 'update']);
    Route::delete('drif/{id}', [ResponsableDrifController::class, 'destroy']);
});

// Formateur Animateur :
