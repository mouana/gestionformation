<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FormationController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'statut' => 'required|string|min:6',
            'animateur_id' => 'required|integer|exists:formateurs_animateurs,id',
            'participants' => 'required|array|min:1',
           'participants.*' => 'integer|exists:formateurs_participants,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        DB::beginTransaction();

        try {
            // Create the formation
            $formation = Formation::create([
                'titre' => $request->titre,
                'description' => $request->description,
                'statut' => $request->statut,
                'animateur_id' => $request->animateur_id
            ]);

            // Insert into pivot table
            $pivotData = [];
            foreach ($request->participants as $participantId) {
                $pivotData[] = [
                    'formation_id' => $formation->id,
                    'formateur_participant_id' => $participantId,
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }

            DB::table('formateur_participant_formation')->insert($pivotData);

            DB::commit();

            return response()->json([
                'message' => 'Formation and participants added successfully',
                'formation' => $formation->load('participants', 'animateur'),
                'pivot_inserts' => count($pivotData) // Debug info
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create formation',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString() // Detailed error for debugging
            ], 500);
        }
    }

    public function index()
    {
        $formations = Formation::with(['animateur.utilisateur', 'participants'])->get();

        return response()->json([
            'message' => 'Formations retrieved successfully',
            'formations' => $formations
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $formation = Formation::find($id);

        if (!$formation) {
            return response()->json(['error' => 'Formation not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'statut' => 'required|string|min:6',
            'animateur_id' => 'required|integer|exists:formateurs_animateurs,id',
            'participants' => 'sometimes|array',
           'participants.*' => 'integer|exists:formateurs_participants,id'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        DB::beginTransaction();

        try {
            $formation->update([
                'titre' => $request->titre,
                'description' => $request->description,
                'statut' => $request->statut,
                'animateur_id' => $request->animateur_id
            ]);

            if ($request->has('participants')) {
                // Delete existing relations
                DB::table('formateur_participant_formation')
                    ->where('formation_id', $formation->id)
                    ->delete();

                // Insert new relations
                $pivotData = [];
                foreach ($request->participants as $participantId) {
                    $pivotData[] = [
                        'formation_id' => $formation->id,
                        'formateur_participant_id' => $participantId,
                        'created_at' => now(),
                        'updated_at' => now()
                    ];
                }

                DB::table('formateur_participant_formation')->insert($pivotData);
            }

            DB::commit();

            return response()->json([
                'message' => 'Formation updated successfully',
                'formation' => $formation->load('participants', 'animateur')
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update formation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $user = Auth::user();

        // if (!$user || !in_array($user->role, ['responsable_cdc', 'responsable_drif', 'respancable_formation'])) {
        //     return response()->json(['error' => 'Unauthorized'], 403);
        // }

        $formation = Formation::find($id);

        if (!$formation) {
            return response()->json(['error' => 'Formation not found'], 404);
        }

        DB::beginTransaction();

        try {
            // Delete from pivot table first
            DB::table('formateur_participant_formation')
                ->where('formation_id', $formation->id)
                ->delete();

            // Then delete the formation
            $formation->delete();

            DB::commit();

            return response()->json([
                'message' => 'Formation deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete formation',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}