<?php

namespace App\Http\Controllers;

use App\Models\Logistique;
use Illuminate\Http\Request;

class LogistiqueController extends Controller
{
  
    public function index()
    {
        return response()->json(Logistique::with('cours')->get());
    }

 
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantite' => 'required|integer|min:1',
            'cour_id' => 'required|exists:cours,id'
        ]);

        $logistique = Logistique::create($request->all());

        return response()->json($logistique, 201);
    }

   
    public function show($id)
    {
        return response()->json(Logistique::findOrFail($id));
    }

    
    public function update(Request $request, $id)
    {
        $logistique = Logistique::findOrFail($id);
        $logistique->update($request->all());

        return response()->json($logistique);
    }

  
    public function destroy($id)
    {
        Logistique::destroy($id);

        return response()->json(['message' => 'Logistique supprimée']);
    }
}
