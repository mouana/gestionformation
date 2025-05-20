<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Formation;
use App\Models\Cour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;

class ParticipantController extends Controller
{
    public function participantDashboard()
    {
        $user = Auth::user();
        
        $formations = Formation::whereHas('participants', function($query) use ($user) {
            $query->where('formateurs_participants.utilisateur_id', $user->id);
        })
        ->with(['Cour', 'animateur.utilisateur'])
        ->get();

        $formations = $formations ?? collect();

        return response()->json([
            'participant' => [
                'id' => $user->id,
                'name' => $user->nom,
                'email' => $user->email,
                'role' => $user->role
            ],
            'formations' => $formations->map(function ($formation) use ($user) {
                $cours = $formation->Cour ?? collect(); 
                
                return [
                    'id' => $formation->id,
                    'titre' => $formation->titre,
                    'description' => $formation->description,
                    'statut' => $formation->statut,
                    'date_debut' => $formation->dateDebut,
                    'date_fin' => $formation->dateFin,
                    'animateur' => [
    'nom' => optional($formation->animateur->utilisateur)->nom ?? 'N/A',
    'email' => optional($formation->animateur->utilisateur)->email ?? 'N/A',
],
                    'courses' => $cours->map(function ($cour) {
                        return [
                            'id' => $cour->id,
                            'titre' => $cour->titre,
                            'description' => $cour->description,
                            'date_debut' => $cour->dateDebut,
                            'date_fin' => $cour->dateFin,
                            'support' => $cour->support ? [
                                'name' => basename($cour->support),
                                'url' => route('participant.download.course', $cour->id),
                                'size' => Storage::exists('public/' . $cour->support) 
                                    ? round(Storage::size('public/' . $cour->support) / 1024) . ' KB' 
                                    : null
                            ] : null
                        ];
                    }),
                    'progress' => $this->calculateFormationProgress($formation, $user)
                ];
            })
        ]);
    }

   protected function calculateFormationProgress($formation, $user)
{
    $courses = $formation->Cour ?? $formation->Cour()->get();
    
    $totalCourses = $courses->count();
    if ($totalCourses === 0) {
        return 0;
    }
    
    $completedCourses = $courses->where('status', 'terminée')->count();
            
    return round(($completedCourses / $totalCourses) * 100);
}

    public function downloadCourse($courseId)
    {
        $user = Auth::user();
        $course = Cour::findOrFail($courseId);

        $hasAccess = Formation::whereHas('participants', function($query) use ($user) {
                $query->where('formateurs_participants.utilisateur_id', $user->id);
            })
            ->whereHas('Cour', function($query) use ($courseId) { // Using 'Cour' here
                $query->where('id', $courseId);
            })
            ->exists();

        if (!$hasAccess) {
            return response()->json([
                'error' => 'Unauthorized - You are not enrolled in this course',
                'course_id' => $courseId
            ], 403);
        }

        if (empty($course->support)) {
            return response()->json([
                'error' => 'Course material not available',
                'course' => $course->only(['id', 'titre'])
            ], 404);
        }

        $filePath = storage_path('app/public/' . $course->support);
        
        if (!file_exists($filePath)) {
            return response()->json([
                'error' => 'File not found on server',
                'path' => $filePath
            ], 404);
        }

        return response()->download($filePath, basename($course->support));
    }

    public function getFormationDetails($formationId)
    {
        $user = Auth::user();

        $formation = Formation::whereHas('participants', function($query) use ($user) {
                $query->where('formateurs_participants.utilisateur_id', $user->id);
            })
            ->with(['Cour', 'animateur.utilisateur']) 
            ->findOrFail($formationId);

        return response()->json([
            'formation' => $formation,
            'participant_count' => $formation->participants()->count()
        ]);
    }
}