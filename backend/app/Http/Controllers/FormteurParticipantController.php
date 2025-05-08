<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FormteurParticipant;

class FormteurParticipantController extends Controller
{
    public function index()
    {
        $formteurParticipant = FormteurParticipant::with('utilisateur')->get();
        return response()->json($formteurParticipant);
    }
}