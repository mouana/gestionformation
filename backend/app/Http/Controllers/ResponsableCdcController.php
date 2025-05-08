<?php

namespace App\Http\Controllers;

use App\Models\ResponsableCdc;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

class ResponsableCdcController extends Controller
{

    //

    public function index()
    {
        $responsables = ResponsableCdc::all();
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

    public function update(Request $request, ResponsableCdc $responsableCdc)
    {
        $validated = $request->validate([
            'filiere' => 'string|max:255',
            'region' => 'string|max:255',
            'role' => 'in:responsable_cdc',
            'utilisateur_id' => 'exists:utilisateurs,id',
        ]);

        $responsableCdc->update($validated);

        return response()->json($responsableCdc);
    }

    public function destroy(ResponsableCdc $responsableCdc)
    {
        $responsableCdc->delete();
        return response()->json(null, 204);
    }

}