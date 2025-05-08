<?php

namespace App\Http\Controllers;

use App\Models\FormateurAnimateur;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FormateurAnimateurController extends Controller
{
    public function index()
    {
        $formateursAnimateurs = FormateurAnimateur::all();
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

    public function update(Request $request, FormateurAnimateur $formateurAnimateur)
    {
        $request->validate([
            'role' => 'required|in:formateurs_animateur',
            'utilisateur_id' => 'required|exists:utilisateurs,id',
        ]);

        $formateurAnimateur->update([
            'role' => $request->role,
            'utilisateur_id' => $request->utilisateur_id,
        ]);

        return response()->json($formateurAnimateur);
    }

    public function destroy(FormateurAnimateur $formateurAnimateur)
    {
        $formateurAnimateur->delete();
        return response()->json(null, 204);
    }
}
