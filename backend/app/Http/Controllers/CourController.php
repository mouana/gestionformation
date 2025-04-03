<?php

namespace App\Http\Controllers;

use App\Models\Cour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CourController extends Controller
{
    public function Store(Request $request){
        $validator = Validator::make($request->all(), [
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'dateDebut' => 'required|date',
            'dateFin' => 'required|date|after_or_equal:dateDebut',
            'heure_debut' => 'required',
            'heure_fin' => 'required',
            'statut' => 'required|string',
            'formateur_animateur_id' => 'required|exists:utilisateurs,id',
            'formation_id' => 'required|exists:formations,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Handle file upload
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('cours_photos', 'public');
        }

        $cour = Cour::create([
            'photo' => $photoPath,
            'dateDebut' => $request->dateDebut,
            'dateFin' => $request->dateFin,
            'heure_debut' => $request->heure_debut,
            'heure_fin' => $request->heure_fin,
            'statut' => $request->statut,
            'formateur_animateur_id' => $request->formateur_animateur_id,
            'formation_id' => $request->formation_id,
        ]);

        return response()->json(['message' => 'Cour added successfully', 'cour' => $cour]);
    }

    public function Update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'dateDebut' => 'required|date',
            'dateFin' => 'required|date|after_or_equal:dateDebut',
            'heure_debut' => 'required',
            'heure_fin' => 'required',
            'statut' => 'required|string',
            'formateur_animateur_id' => 'required|exists:utilisateurs,id',
            'formation_id' => 'required|exists:formations,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $cour = Cour::find($id);
        if (!$cour) {
            return response()->json(['message' => 'Cour not found'], 404);
        }

        // Handle file upload
        if ($request->hasFile('photo')) {
            // Delete old photo if it exists
            if ($cour->photo) {
                Storage::disk('public')->delete($cour->photo);
            }
            $cour->photo = $request->file('photo')->store('cours_photos', 'public');
        }

        $cour->update([
            'dateDebut' => $request->dateDebut,
            'dateFin' => $request->dateFin,
            'heure_debut' => $request->heure_debut,
            'heure_fin' => $request->heure_fin,
            'statut' => $request->statut,
            'formateur_animateur_id' => $request->formateur_animateur_id,
            'formation_id' => $request->formation_id,
        ]);

        return response()->json(['message' => 'Cour updated successfully', 'cour' => $cour]);
    }

    public function Delete($id)
    {
        $cour = Cour::find($id);
        if (!$cour) {
            return response()->json(['message' => 'Cour not found'], 404);
        }

        // Delete photo from storage
        if ($cour->photo) {
            Storage::disk('public')->delete($cour->photo);
        }

        $cour->delete();
        return response()->json(['message' => 'Cour deleted successfully']);
    }
}