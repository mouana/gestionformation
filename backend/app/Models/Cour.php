<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cour extends Model
{

    protected $fillable =[
        'photo',
        'dateDebut',
        'dateFin',
        'heure_debut',
        'heure_fin',
        'statut',
        'formateur_animateur_id',
        'formation_id',
    ];
    public function Formation(){
        return $this->hasOne(Formation::class);
    }

    public function Logistique(){
        return $this->hasMany(Logistique::class);
    }

     public function FormateurAnimateur(){
        return $this->hasOne(FormateurAnimateur::class);
    }
}