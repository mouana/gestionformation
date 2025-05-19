<?php

namespace App\Http\Controllers;

use App\Models\Cour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CourController extends Controller
{
 public function index()
{
    $user = auth()->user();
    
    // Check if user is a formateur_animateur by checking the role_id or role column
    if ($user->role === 'formateur_animateur') { // Adjust this condition based on your role system
        // If formateur, only get their assigned courses
        $cours = Cour::with(['formation', 'formateur_animateur.utilisateur'])
                    ->whereHas('formateur_animateur.utilisateur', function($query) use ($user) {
                        $query->where('id', $user->id);
                    })
                    ->get();
    } else {
        // For all other users, get all courses
        $cours = Cour::with(['formation', 'formateur_animateur.utilisateur'])
                    ->get();
    }

    return response()->json([
        'cours' => $cours
    ]);
}


    public function Store(Request $request)
    {
        $validator = Validator::make($request->all(), [
         
            'support' => 'nullable|mimes:pdf|max:10240', // Ajout de validation pour le PDF
            'titre' => 'required|string',
            'dateDebut' => 'required|date',
            'dateFin' => 'required|date|after_or_equal:dateDebut',
            'heure_debut' => 'required',
            'heure_fin' => 'required',
            'statut' => 'required|string',
            'formateur_animateur_id' => 'required|exists:formateurs_animateurs,id',
            'formation_id' => 'required|exists:formations,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Gérer l'upload des fichiers
  

        $supportPath = null;
        if ($request->hasFile('support')) {
            $supportPath = $request->file('support')->store('cours_supports', 'public'); // Stockage du PDF
        }

        $cour = Cour::create([
        
            'support' => $supportPath, // Ajout du support
            'titre'=>$request->titre,
            'dateDebut' => $request->dateDebut,
            'dateFin' => $request->dateFin,
            'heure_debut' => $request->heure_debut,
            'heure_fin' => $request->heure_fin,
            'statut' => $request->statut,
            'formateur_animateur_id' => $request->formateur_animateur_id,
            'formation_id' => $request->formation_id,
        ]);

        return response()->json(['message' => 'Cour ajouté avec succès', 'cour' => $cour]);
    }

 public function Update(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'support' => 'nullable|mimes:pdf|max:10240',
        'titre' => 'nullable|string',
        'dateDebut' => 'nullable|date',
        'dateFin' => 'nullable|date|after_or_equal:dateDebut',
        'heure_debut' => 'nullable',
        'heure_fin' => 'nullable',
        'statut' => 'nullable|string',
        'formateur_animateur_id' => 'nullable|exists:formateurs_animateurs,id',
        'formation_id' => 'nullable|exists:formations,id',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    $cour = Cour::find($id);
    if (!$cour) {
        return response()->json(['message' => 'Cours non trouvé'], 404);
    }

    if ($request->hasFile('support')) {
        if ($cour->support) {
            Storage::disk('public')->delete($cour->support);
        }
        $cour->support = $request->file('support')->store('cours_supports', 'public');
    }

    
    $cour->fill($request->only([
        'titre',
        'dateDebut',
        'dateFin',
        'heure_debut',
        'heure_fin',
        'statut',
        'formateur_animateur_id',
        'formation_id',
    ]));
     Log::info('Changes detected:', $cour->getDirty());

    $cour->save();

    return response()->json(['message' => 'Cour mis à jour', 'cour' => $cour]);
}


    public function Delete($id)
    {
        $cour = Cour::find($id);
        if (!$cour) {
            return response()->json(['message' => 'Cours non trouvé'], 404);
        }

  

        if ($cour->support) {
            Storage::disk('public')->delete($cour->support); 
        }

        $cour->delete();
        return response()->json(['message' => 'Cours supprimé avec succès']);
    }
}