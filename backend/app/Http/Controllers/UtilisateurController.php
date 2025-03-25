<?php
namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
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
            'role' => 'required|in:responcable_cdc,responcable_drif,respancable_formation,formateur_animateur,formateur_participant,admin',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'motdePasse' => Hash::make($request->motdePasse),
            'matrecule' => $request->matrecule,
            'role' => $request->role,
        ]);

        return response()->json(['message' => 'User added successfully', 'utilisateur' => $user], 201);
    }
}