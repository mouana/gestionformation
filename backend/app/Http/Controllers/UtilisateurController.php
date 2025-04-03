<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\RespoFormation;
use App\Models\ResponsableCdc;
use App\Models\ResponsableDrif;
use App\Models\FormateurAnimateur;
use App\Models\FormteurParticipant;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UtilisateurController extends Controller
{
    public function store(Request $request)
    {
        if (auth()->user()->role !== 'admin') {
            return response()->json(['error' => 'Only admins can add users.'], 403);
        }
    
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|unique:utilisateurs',
            'motdePasse' => 'required|string|min:6',
            'matrecule' => 'required|string|unique:utilisateurs',
            'role' => 'required|in:responsable_cdc,responsable_drif,responsable_formation,formateur_animateur,formateur_participant,admin',
            'filiere' => 'string|nullable',
            'region' => 'string|nullable',
            'ISTA' => 'integer|nullable',
            'ville' => 'string|nullable',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
    
        // ✅ Étape 1 : Créer l'utilisateur et récupérer son ID
        $utilisateur = User::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'motdePasse' => Hash::make($request->motdePasse),
            'matrecule' => $request->matrecule,
            'role' => $request->role,
        ]);
    
        $utilisateurId = $utilisateur->id; // ✅ Stocker l'ID utilisateur
    
        // ✅ Étape 2 : Ajouter les données spécifiques dans l'autre table
        switch ($request->role) {
            case 'responsable_cdc':
                ResponsableCdc::create([
                    'utilisateur_id' => $utilisateurId, // ✅ Passer l'ID utilisateur
                    'filiere' => $request->filiere,
                    'region' => $request->region,
                ]);
                break;
            case 'formateur_participant':
                FormteurParticipant::create([
                    'utilisateur_id' => $utilisateurId, // ✅ Passer l'ID utilisateur
                    'ISTA' => $request->ISTA,
                    'ville' => $request->ville,
                    'region' => $request->region,
                ]);
                break;
            case 'responsable_drif':
                ResponsableDrif::create([
                    'utilisateur_id' => $utilisateurId, // ✅ Passer l'ID utilisateur
                ]);
                break;
            case 'responsable_formation':
                RespoFormation::create([
                    'utilisateur_id' => $utilisateurId, // ✅ Passer l'ID utilisateur
                ]);
                break;
            case 'formateur_animateur':
                FormateurAnimateur::create([
                    'utilisateur_id' => $utilisateurId, // ✅ Passer l'ID utilisateur
                ]);
                break;
        }
    
        return response()->json(['message' => 'User added successfully', 'utilisateur' => $utilisateur], 201);
    }
    


    public function update(Request $request, User $utilisateur)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->id !== $utilisateur->id) {
            return response()->json(['error' => 'Unauthorized to update this user.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'string|max:255',
            'email' => 'string|email|unique:utilisateurs,email,' . $utilisateur->id,
            'motdePasse' => 'nullable|string|min:6',
            'matrecule' => 'string|unique:utilisateurs,matrecule,' . $utilisateur->id,
            'role' => 'in:responsable_cdc,responsable_drif,responsable_formation,formateur_animateur,formateur_participant,admin',
            'filiere' => 'nullable|string',
            'region' => 'nullable|string',
            'ISTA' => 'nullable|integer',
            'ville' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Mise à jour de l'utilisateur principal
        $utilisateur->update([
            'nom' => $request->nom ?? $utilisateur->nom,
            'email' => $request->email ?? $utilisateur->email,
            'matrecule' => $request->matrecule ?? $utilisateur->matrecule,
            'role' => $request->role ?? $utilisateur->role,
        ]);

        if ($request->filled('motdePasse')) {
            $utilisateur->update(['motdePasse' => Hash::make($request->motdePasse)]);
        }

        // Mise à jour des tables secondaires
        switch ($utilisateur->role) {
            case 'responsable_cdc':
                ResponsableCdc::where('utilisateur_id', $utilisateur->id)->update([
                    'filiere' => $request->filiere,
                    'region' => $request->region,
                ]);
                break;
            case 'formateur_participant':
                FormteurParticipant::where('utilisateur_id', $utilisateur->id)->update([
                    'ISTA' => $request->ISTA,
                    'ville' => $request->ville,
                    'region' => $request->region,
                ]);
                break;
            case 'responsable_drif':
                ResponsableDrif::where('utilisateur_id', $utilisateur->id)->update([]);
                break;
            case 'responsable_formation':
                RespoFormation::where('utilisateur_id', $utilisateur->id)->update([]);
                break;
            case 'formateur_animateur':
                FormateurAnimateur::where('utilisateur_id', $utilisateur->id)->update([]);
                break;
        }

        return response()->json(['message' => 'User updated successfully', 'utilisateur' => $utilisateur]);
    }

    public function delete(User $utilisateur)
    {
        $user = User::find($utilisateur->id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Suppression des entrées associées dans les autres tables
        ResponsableCdc::where('utilisateur_id', $user->id)->delete();
        FormteurParticipant::where('utilisateur_id', $user->id)->delete();
        ResponsableDrif::where('utilisateur_id', $user->id)->delete();
        RespoFormation::where('utilisateur_id', $user->id)->delete();
        FormateurAnimateur::where('utilisateur_id', $user->id)->delete();

        // Suppression de l'utilisateur principal
        $user->delete();

        return response()->json(['message' => 'User deleted'], 200);
    }
}