<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\RespoFormation;
use App\Models\ResponsableCdc;
use App\Models\ResponsableDrif;
use Illuminate\Validation\Rule;
use App\Models\FormateurAnimateur;
use App\Models\FormteurParticipant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UtilisateurController extends Controller
{
    public function store(Request $request)
    {
        
    
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|unique:utilisateurs',
            'motdePasse' => 'required|string|min:6',
            'matrecule' => 'required|string|unique:utilisateurs',
            'role' => 'required|in:responsable_cdc,responsable_drif,responsable_formation,formateur_animateur,formateur_participant,admin',
            'filiere' => 'string|nullable',
            'region' => 'string|nullable',
            'ISTA' => 'string|nullable',
            'ville' => 'string|nullable',
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
    
        $utilisateur = User::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'motdePasse' => Hash::make($request->motdePasse),
            'matrecule' => $request->matrecule,
            'role' => $request->role,
        ]);
    
        $utilisateurId = $utilisateur->id; 
    
        switch ($request->role) {
            case 'responsable_cdc':
                ResponsableCdc::create([
                    'utilisateur_id' => $utilisateurId, 
                    'filiere' => $request->filiere,
                    'region' => $request->region,
                ]);
                break;
            case 'formateur_participant':
                FormteurParticipant::create([

                    'utilisateur_id' => $utilisateurId, 
                    'ISTA' => $request->ISTA,
                    'ville' => $request->ville,
                    'region' => $request->region,
                ]);
                break;
            case 'responsable_drif':
                ResponsableDrif::create([
                    'utilisateur_id' => $utilisateurId, 

                ]);
                break;
            case 'responsable_formation':
                RespoFormation::create([
                    'utilisateur_id' => $utilisateurId,

                ]);
            case 'formateur_animateur':
                FormateurAnimateur::create([

                    'utilisateur_id' => $utilisateurId,  
                ]);
                break;
        }
    
        return response()->json(['message' => 'User added successfully', 'utilisateur' => $utilisateur], 201);
    }
    


    public function update(Request $request, User $utilisateur)
{
    // Retrieve all data from request
    $data = $request->all();

    // Validation rules
    $validator = Validator::make($data, [
        'nom' => 'required|string|max:255',
        'email' => [
            'required',
            'email',
            Rule::unique('utilisateurs')->ignore($utilisateur->id), 
        ],
        'motdePasse' => 'nullable|string|min:6',
        'matrecule' => [
            'required',
            Rule::unique('utilisateurs')->ignore($utilisateur->id), 
        ],
        'role' => 'required|in:responsable_cdc,responsable_drif,responsable_formation,formateur_animateur,formateur_participant,admin',
        'filiere' => 'nullable|string',
        'region' => 'nullable|string',
        'ISTA' => 'nullable|string',
        'ville' => 'nullable|string',
    ]);
    
    

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    // Update the user's main fields
    $utilisateur->fill([
        'nom' => $data['nom'] ?? $utilisateur->nom,
        'email' => $data['email'] ?? $utilisateur->email,
        'matrecule' => $data['matrecule'] ?? $utilisateur->matrecule,
        'role' => $data['role'] ?? $utilisateur->role,
    ]);

    // Hash password if provided
    if (!empty($data['motdePasse'])) {
        $utilisateur->motdePasse = Hash::make($data['motdePasse']);
    }

    // Save the user
    $utilisateur->save();

    // Update the role-specific tables based on the user's role
    match ($utilisateur->role) {
        'responsable_cdc' => ResponsableCdc::updateOrCreate(
            ['utilisateur_id' => $utilisateur->id],
            ['filiere' => $data['filiere'] ?? null, 'region' => $data['region'] ?? null]
        ),
        'formateur_participant' => FormteurParticipant::updateOrCreate(
            ['utilisateur_id' => $utilisateur->id],
            ['ISTA' => $data['ISTA'] ?? null, 'ville' => $data['ville'] ?? null, 'region' => $data['region'] ?? null]
        ),
        'responsable_drif' => ResponsableDrif::updateOrCreate(['utilisateur_id' => $utilisateur->id], []),
        'responsable_formation' => RespoFormation::updateOrCreate(['utilisateur_id' => $utilisateur->id], []),
        'formateur_animateur' => FormateurAnimateur::updateOrCreate(['utilisateur_id' => $utilisateur->id], []),
        default => null,
    };

    return response()->json(['message' => 'Utilisateur mis à jour avec succès', 'utilisateur' => $utilisateur]);
}




public function delete($id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $relatedModels = [
        ResponsableCdc::class,
        FormteurParticipant::class,
        ResponsableDrif::class,
        RespoFormation::class,
        FormateurAnimateur::class,
    ];

    foreach ($relatedModels as $model) {
        $model::where('utilisateur_id', $user->id)->delete();
    }

    $user->delete();

    return response()->json(['message' => 'User deleted'], 200);
}



    public function index(Request $request)
{
    // Ensure only admins can access the user list
    
    $user = Auth::user();

    // Retrieve users with optional pagination
    if (!$user || !in_array($user->role, ['responsable_cdc', 'responsable_drif', 'respancable_formation'])) {
        return response()->json(['error' => 'Access denied. Only authorized personnel can view formations.'], 403);
    }
    $users = User::paginate($request->get('per_page', 10));
    // Attach role-specific data
    $users->map(function ($user) {
        switch ($user->role) {
            case 'responsable_cdc':
                $user->role_details = ResponsableCdc::where('utilisateur_id', $user->id)->first();
                break;
            case 'formateur_participant':
                $user->role_details = FormteurParticipant::where('utilisateur_id', $user->id)->first();
                break;
            case 'responsable_drif':
                $user->role_details = ResponsableDrif::where('utilisateur_id', $user->id)->first();
                break;
            case 'responsable_formation':
                $user->role_details = RespoFormation::where('utilisateur_id', $user->id)->first();
                break;
            case 'formateur_animateur':
                $user->role_details = FormateurAnimateur::where('utilisateur_id', $user->id)->first();
                break;
            default:
                $user->role_details = null;
        }
        return $user;
    });

    return response()->json($users, 200);
}

}