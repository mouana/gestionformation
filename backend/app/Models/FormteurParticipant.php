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
        'utilisateur_id', 
    ];

    public function utilisateur()
    {
        return $this->belongsTo(User::class,'utilisateur_id');
    }

    public function formations()
{
    return $this->belongsToMany(Formation::class, 'formateur_participant_formation',
              'formateur_participant_id', 'formation_id')
              ->withTimestamps();
}
}