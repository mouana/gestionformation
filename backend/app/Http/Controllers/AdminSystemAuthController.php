<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Utilisateur;

class AdminSystemAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'matrecule' => 'required|string',
            'motdePasse' => 'required|string',
        ]);

        if (Auth::attempt(['matrecule' => $request->matrecule, 'password' => $request->motdePasse])) {
            $user = Auth::user();

            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $token = $user->createToken('AdminToken')->accessToken;
            return response()->json(['token' => $token], 200);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->tokens()->delete();
            return response()->json(['message' => 'Logged out successfully'], 200);
        }

        return response()->json(['message' => 'Unauthorized'], 401);
    }
}