<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

use App\Models\ResponsableCdc;
use App\Http\Controllers\Controller;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class ResponsableCdcController extends Controller
{

    //

    public function index()
    {
        $responsables = ResponsableCdc::with('utilisateur')->get();
        return response()->json($responsables);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'filiere' => 'required|string|max:255',
            'region' => 'required|string|max:255',
            'role' => 'required|in:responsable_cdc',
            'utilisateur_id' => 'required|exists:utilisateurs,id',
        ]);

        $responsable = ResponsableCdc::create($validated);

        return response()->json($responsable, 201);
    }

    public function show(ResponsableCdc $responsableCdc)
    {
        return response()->json($responsableCdc);
    }

    public function update(Request $request, $id)
    {
        $utilisateur = User::findOrFail($id);
        
        // On récupère le responsable lié à ce user
        $responsable = ResponsableCdc::where('utilisateur_id', $id)->firstOrFail();
    
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
            'role' => 'required|in:responsable_cdc',
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

    public function destroy(ResponsableCdc $responsableCdc)
    {
        $responsableCdc->delete();
        return response()->json(null, 204);
    }

}