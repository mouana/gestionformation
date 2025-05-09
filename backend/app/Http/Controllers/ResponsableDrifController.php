<?php

namespace App\Http\Controllers;

use App\Models\ResponsableDrif;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ResponsableDrifController extends Controller
{
    public function index()
    {
        $responsables = ResponsableDrif::with('utilisateur')->get();
        return response()->json($responsables);
    }

    public function show($id)
    {
        $responsable = ResponsableDrif::with('utilisateur')->findOrFail($id);
        return response()->json($responsable);
    }

    public function store(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'nom' => 'required|string|max:255',
            'email' => 'required|email|unique:utilisateurs,email',
            'matrecule' => 'required|string|unique:utilisateurs,matrecule',
            'role' => 'required|in:responsable_drif',
            'region' => 'nullable|string',
            'ISTA' => 'nullable|string',
            'ville' => 'nullable|string',
            'motdePasse' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Créer l'utilisateur lié
        $utilisateur = User::create([
            'nom' => $data['nom'],
            'email' => $data['email'],
            'matrecule' => $data['matrecule'],
            'motdePasse' => bcrypt($data['motdePasse']),
            'role' => 'responsable_drif',
        ]);

        // Créer le responsable
        $responsable = ResponsableDrif::create([
            'utilisateur_id' => $utilisateur->id,
        ]);

        return response()->json([
            'message' => 'Responsable créé avec succès',
            'responsable' => $responsable->load('utilisateur')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        // Ici, $id est l'ID du user (utilisateurs.id)
        $utilisateur = User::findOrFail($id);
        
        // On récupère le responsable lié à ce user
        $responsable = ResponsableDrif::where('utilisateur_id', $id)->firstOrFail();
    
        $data = $request->all();
    
        $validator = Validator::make($data, [
            'nom' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('utilisateurs', 'email')->ignore($utilisateur->id),
            ],
            'matrecule' => [
                'required',
                Rule::unique('utilisateurs', 'matrecule')->ignore($utilisateur->id),
            ],
            'motdePasse' => 'nullable|string|min:6',
            'role' => 'required|in:responsable_drif',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        $utilisateur->update([
            'nom' => $data['nom'],
            'email' => $data['email'],
            'matrecule' => $data['matrecule'],
            'role' => $data['role'],
            'motdePasse' => !empty($data['motdePasse']) ? bcrypt($data['motdePasse']) : $utilisateur->motdePasse,
        ]);
    
        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'utilisateur' => $utilisateur
        ]);
    }

    public function destroy($id)
    {
        $responsable = ResponsableDrif::findOrFail($id);
        $utilisateur = $responsable->utilisateur;

        $responsable->delete();
        $utilisateur->delete();

        return response()->json(['message' => 'Responsable supprimé avec succès.']);
    }
}