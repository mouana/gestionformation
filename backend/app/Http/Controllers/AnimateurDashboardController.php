<?php

namespace App\Http\Controllers;

use App\Models\Cour;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnimateurDashboardController extends Controller
{
   public function animateurDashboard()
{
    $user = Auth::user();
    $animateur = $user->formateurAnimateur()->first();

    if (!$animateur) {
        return response()->json(['error' => 'User is not an animateur'], 403);
    }

    $formations = Formation::where('animateur_id', $animateur->id)->get();
    
    $coursQuery = Cour::where('formateur_animateur_id', $animateur->id);

    $stats = [
        'total_formations' => $formations->count(),
        'total_sessions' => $coursQuery->count(),
        'upcoming_sessions' => (clone $coursQuery)->where('dateDebut', '>=', now())->count(),
        'completed_sessions' => (clone $coursQuery)->where('dateDebut', '<', now())->count(),
    ];

    $formation = $formations->sortByDesc('created_at')->first();

    $sessions = $coursQuery->with(['formation:id,titre'])
        ->orderBy('dateDebut', 'desc')
        ->limit(5)
        ->get()
        ->map(function ($cour) {
            return [
                'id' => $cour->id,
                'titre' => $cour->titre,
                'date' => $cour->dateDebut,
                'formation' => $cour->formation->titre ?? 'N/A',
                'status' => $cour->statut,
            ];
        });

    return response()->json([
        'animateur' => [
            'id' => $animateur->id,
            'name' => $animateur->utilisateur->nom ?? null,
            'email' => $animateur->utilisateur->email ?? null,
            'matricule' => $animateur->utilisateur->matrecule ?? null,
        ],
        'stats' => $stats,
        'formation' => $formation ? [
            'id' => $formation->id,
            'titre' => $formation->titre,
            'description' => $formation->description,
            'start_date' => $formation->date_validation,
            'status' => $formation->statut,
            'participant_count' => $formation->participants()->count(),
'participants' => $formation->participants()
    ->with('utilisateur:id,nom') 
    ->get()
    ->map(function ($participant) {
        return [
            'id' => $participant->id,
            'name' => $participant->utilisateur->nom,
            'ISTA' => $participant->ISTA,
            'region' => $participant->region,
            'ville' => $participant->ville,
        ];
    })

        ] : null,
        'recent_sessions' => $sessions,
    ]);
}

}