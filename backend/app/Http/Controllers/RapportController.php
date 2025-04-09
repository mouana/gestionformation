<?php

namespace App\Http\Controllers;

use App\Models\Rapport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class RapportController extends Controller
{
    /**
     * Display a listing of the rapports.
     */
    public function index(): JsonResponse
    {
        $rapports = Rapport::with(['cour', 'responsableFormation'])->get();
        return response()->json($rapports);
    }

    /**
     * Store a newly created rapport in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'contenu' => 'required|string',
            'dateCreation' => 'required|date',
            'note' => 'nullable|integer|min:0|max:20',
            'cour_id' => 'required|exists:cours,id',
            'responsable_formation_id' => 'required|exists:utilisateurs,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $rapport = Rapport::create($validator->validated());
        return response()->json($rapport, 201);
    }

    /**
     * Display the specified rapport.
     */
    public function show(Rapport $rapport): JsonResponse
    {
        $rapport->load(['cour', 'responsableFormation']);
        return response()->json($rapport);
    }

    /**
     * Update the specified rapport in storage.
     */
    public function update(Request $request, Rapport $rapport): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'contenu' => 'sometimes|required|string',
            'dateCreation' => 'sometimes|required|date',
            'note' => 'nullable|integer|min:0|max:20',
            'cour_id' => 'sometimes|required|exists:cours,id',
            'responsable_formation_id' => 'sometimes|required|exists:utilisateurs,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $rapport->update($validator->validated());
        return response()->json($rapport);
    }

    /**
     * Remove the specified rapport from storage.
     */
    public function destroy(Rapport $rapport): JsonResponse
    {
        $rapport->delete();
        return response()->json(null, 204);
    }

    /**
     * Get rapports by course.
     */
    public function getByCourse($courseId): JsonResponse
    {
        $rapports = Rapport::where('cour_id', $courseId)
            ->with(['responsableFormation'])
            ->get();
        return response()->json($rapports);
    }

    /**
     * Get rapports by responsable formation.
     */
    public function getByResponsable($responsableId): JsonResponse
    {
        $rapports = Rapport::where('responsable_formation_id', $responsableId)
            ->with(['cour'])
            ->get();
        return response()->json($rapports);
    }
}
