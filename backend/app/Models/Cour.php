<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;


class Cour extends Model
{

    protected $fillable =[
        'titre',
        'dateDebut',
        'dateFin',
        'heure_debut',
        'heure_fin',
        'statut',
        'formateur_animateur_id',
        'formation_id',
        'support'
    ];
   
    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }


    public function formateur_animateur()
    {
        return $this->belongsTo(FormateurAnimateur::class, 'formateur_animateur_id');
    }

  
    protected $appends = ['support_url'];

    public function getSupportUrlAttribute()
    {
        return $this->support ? Storage::url($this->support) : null;
    }

  
    public function Logistique()
    {
        return $this->hasMany(Logistique::class);
    }


}