<?php

namespace App\Http\Controllers;

use App\Models\Cour;
use App\Models\Formation;
use App\Models\FormateurAnimateur;
use App\Models\ResponsableCdc;
use App\Models\ResponsableDrif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function adminDashboard()
    {
        // Ensure only admin/authorized roles can access
        $user = Auth::user();
        // if (!$user || !in_array($user->role, ['responsable_drif', 'responsable_cdc'])) {
        //     return response()->json(['error' => 'Unauthorized access'], 403);
        // }

        // Get statistics
        $totalFormations = Formation::count();
        $totalAnimateurs = FormateurAnimateur::count();
        $totalCdc = ResponsableCdc::count();
        $totalDrif = ResponsableDrif::count();

        $formations = Formation::withCount('Cour')->get();
        return response()->json([
            'total_formations' => $totalFormations,
            'total_animateurs' => $totalAnimateurs,
            'total_cdc' => $totalCdc,
            'total_drif' => $totalDrif,
            'formations' => $formations->map(function ($formation) {
                return [
                    'id' => $formation->id,
                    'titre' => $formation->titre,
                    'course_count' => $formation->cour_count,
                    'animateur' => $formation->animateur->utilisateur->nom ?? 'N/A',
                    'status' => $formation->statut,

                ];
            })
        ]);
    }
}