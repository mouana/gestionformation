<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class FormationController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || !in_array($user->role, ['responsable_cdc', 'responsable_drif', 'respancable_formation'])) {
            return response()->json(['error' => 'Access denied. Only authorized personnel can add a formation.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'statut' => 'required|string|min:6',
            'animateur_id' => 'required|integer|exists:formateurs_animateurs,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Create the formation
        $formation = Formation::create([
            'titre' => $request->titre,
            'description' => $request->description,
            'statut' => $request->statut,
            'animateur_id' => $request->animateur_id
        ]);

        return response()->json([
            'message' => 'Formation added successfully',
            'formation' => $formation
        ], 201);
    }
    public function index()
{
    // Get the authenticated user
    $user = Auth::user();

    // if (!$user || !in_array($user->role, ['responsable_cdc', 'responsable_drif', 'respancable_formation'])) {
    //     return response()->json(['error' => 'Access denied. Only authorized personnel can view formations.'], 403);
    // }

    $formations = Formation::with('animateur.utilisateur')->get();

    return response()->json([
        'message' => 'Formations retrieved successfully',
        'formations' => $formations
    ], 200);
}
public function update(Request $request, $id)
{
    $user = Auth::user();

    if (!$user || !in_array($user->role, ['responsable_cdc', 'responsable_drif', 'respancable_formation'])) {
        return response()->json(['error' => 'Access denied. Only authorized personnel can update a formation.'], 403);
    }

    $formation = Formation::find($id);

    if (!$formation) {
        return response()->json(['error' => 'Formation not found.'], 404);
    }

    $validator = Validator::make($request->all(), [
        'titre' => 'required|string|max:255',
        'description' => 'required|string',
        'statut' => 'required|string|min:6',
        'animateur_id' => 'required|integer|exists:formateurs_animateurs,id',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 400);
    }

    $formation->update([
        'titre' => $request->titre,
        'description' => $request->description,
        'statut' => $request->statut,
        'animateur_id' => $request->animateur_id,
    ]);

    return response()->json([
        'message' => 'Formation updated successfully',
        'formation' => $formation
    ], 200);
}
public function destroy($id)
{
    $user = Auth::user();

    if (!$user || !in_array($user->role, ['responsable_cdc', 'responsable_drif', 'respancable_formation'])) {
        return response()->json(['error' => 'Access denied. Only authorized personnel can delete a formation.'], 403);
    }

    $formation = Formation::find($id);

    if (!$formation) {
        return response()->json(['error' => 'Formation not found.'], 404);
    }

    $formation->delete();

    return response()->json([
        'message' => 'Formation deleted successfully'
    ], 200);
}


}