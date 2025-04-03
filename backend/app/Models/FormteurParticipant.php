<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormteurParticipant extends Model
{

    protected $table = 'formateurs_participants';
    protected $fillable = [
        'nom',
        'email',
        'motdePasse',
        'matrecule',
        'role',
        'ISTA', 
        'region', 
        'ville', 
    ];
}