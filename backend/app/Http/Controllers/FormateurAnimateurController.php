<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\FormateurAnimateur;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class FormateurAnimateurController extends Controller
{
    public function index()
    {
        $formateursAnimateurs = FormateurAnimateur::with('utilisateur')->get();
        return response()->json($formateursAnimateurs);
    }

    public function store(Request $request)
    {
        $request->validate([
            'role' => 'required|in:formateurs_animateur',
            'utilisateur_id' => 'required|exists:utilisateurs,id',
        ]);

        $formateurAnimateur = FormateurAnimateur::create([
            'role' => $request->role,
            'utilisateur_id' => $request->utilisateur_id,
        ]);

        return response()->json($formateurAnimateur, status: 201);
    }

    public function show(FormateurAnimateur $formateurAnimateur)
    {
        return response()->json($formateurAnimateur);
    }

    public function update(Request $request, $id)
    {
        $utilisateur = User::findOrFail($id);
        
        // On récupère le responsable lié à ce user
        $responsable = FormateurAnimateur::where('utilisateur_id', $id)->firstOrFail();
    
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
            'role' => 'required|in:formateur_animateur',
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

    public function destroy(FormateurAnimateur $formateurAnimateur)
    {
        $formateurAnimateur->delete();
        return response()->json(null, 204);
    }
}