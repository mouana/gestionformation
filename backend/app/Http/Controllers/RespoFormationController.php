<?php

namespace App\Http\Controllers;

use App\Models\RespoFormation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;




class RespoFormationController extends Controller
{
    /**
     * Liste tous les responsables de formation.
     */
    public function index(): JsonResponse
    {
        $respos = RespoFormation::with('utilisateur')->get();
        return response()->json($respos);
    }

    /**
     * Ajouter un responsable de formation.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string',
            'email' => 'required|email|unique:utilisateurs,email',
            'matrecule' => 'required|string|unique:utilisateurs,matrecule',
            'motdePasse' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Créer l'utilisateur associé
        $utilisateur = User::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'matrecule' => $request->matrecule,
            'role' => 'responsable_formation',
            'motdePasse' => Hash::make($request->motdePasse),
        ]);

        // Créer le responsable lié à cet utilisateur
        $respo = RespoFormation::create([
            'utilisateur_id' => $utilisateur->id,
            'role' => 'responsable_formation',
        ]);

        return response()->json($respo->load('utilisateur'), 201);
    }

    /**
     * Afficher un responsable de formation spécifique.
     */
    public function show($id): JsonResponse
    {
        $respo = RespoFormation::with('utilisateur')->findOrFail($id);
        return response()->json($respo);
    }

    /**
     * Mettre à jour les infos du responsable.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $respo = RespoFormation::findOrFail($id);
        $utilisateur = $respo->utilisateur;

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string',
            'email' => 'sometimes|email|unique:utilisateurs,email,' . $utilisateur->id,
            'matrecule' => 'sometimes|string|unique:utilisateurs,matrecule,' . $utilisateur->id,
            'motdePasse' => 'nullable|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        if (isset($data['motdePasse'])) {
            $data['motdePasse'] = Hash::make($data['motdePasse']);
        }

        $utilisateur->update($data);
        return response()->json($respo->load('utilisateur'));
    }

    /**
     * Supprimer un responsable de formation.
     */
    public function destroy($id): JsonResponse
    {
        $respo = RespoFormation::findOrFail($id);
        $respo->utilisateur->delete(); // Supprime aussi l'utilisateur
        $respo->delete();
        return response()->json(null, 204);
    }
}