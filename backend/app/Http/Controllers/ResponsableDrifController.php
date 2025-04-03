<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use Illuminate\Http\Request;

class ResponsableDrifController extends Controller
{

    public function store(Request $request)
    {
       
        $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'responsable_cdc_id' => 'required|exists:utilisateurs,id',
        ]);

     
        $formation = Formation::create([
            'titre' => $request->titre,
            'description' => $request->description,
            'statut' => 'en attente', 
            'responsable_cdc_id' => $request->responsable_cdc_id,
            'responsable_dr_id' => auth()->id(), 
            'date_validation' => now(),
        ]);

       
        return response()->json([
            'message' => 'Formation ajoutée avec succès',
            'formation' => $formation
        ], 201);
    }

  
    public function reject($id)
    {
    
        $formation = Formation::find($id);

        
        if (!$formation) {
            return response()->json(['message' => 'Formation non trouvée'], 404);
        }

       
        $formation->statut = 'rejetée';
        $formation->date_validation = now();
        $formation->save();

        
        return response()->json([
            'message' => 'Formation rejetée avec succès',
            'formation' => $formation
        ], 200);
    }


    public function destroy($id)
    {
       
        $formation = Formation::find($id);

       
        if (!$formation) {
            return response()->json(['message' => 'Formation non trouvée'], 404);
        }

        $formation->delete();

    
        return response()->json(['message' => 'Formation supprimée avec succès'], 200);
    }
}
