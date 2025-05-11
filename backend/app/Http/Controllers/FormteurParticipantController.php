<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\FormteurParticipant;
use Illuminate\Support\Facades\Validator;

class FormteurParticipantController extends Controller
{
    public function index()
    {
        $formteurParticipant = FormteurParticipant::with('utilisateur')->get();
        return response()->json($formteurParticipant);
    }

    public function update(Request $request, $id)
    {
        $utilisateur = User::findOrFail($id);
        
        // On récupère le responsable lié à ce user
        $responsable = FormteurParticipant::where('utilisateur_id', $id)->firstOrFail();
    
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
            'role' => 'required|in:formateur_participant',
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

    public function destroy(FormteurParticipant $FormteurParticipant)
    {
        $FormteurParticipant->delete();
        return response()->json(null, 204);
    }
}