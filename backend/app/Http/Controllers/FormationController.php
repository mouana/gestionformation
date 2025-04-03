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
        // Get the authenticated user
        $user = Auth::user();

        // Check if the user has one of the allowed roles
        if (!$user || !in_array($user->role, ['responsable_cdc', 'responsable_drif', 'respancable_formation'])) {
            return response()->json(['error' => 'Access denied. Only authorized personnel can add a formation.'], 403);
        }

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'statut' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Create the formation
        $formation = Formation::create([
            'titre' => $request->titre,
            'description' => $request->description,
            'statut' => $request->statut,
        ]);

        return response()->json([
            'message' => 'Formation added successfully',
            'formation' => $formation
        ], 201);
    }
}