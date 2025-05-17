<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;


class Cour extends Model
{

    protected $fillable = [
    'support',
    'titre',
    'dateDebut',
    'dateFin',
    'heure_debut',
    'heure_fin',
    'statut',
    'formateur_animateur_id',
    'formation_id',
];

    // Relation avec Formation
    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }

    // Relation avec FormateurAnimateur
    public function formateur_animateur()
    {
        return $this->belongsTo(FormateurAnimateur::class, 'formateur_animateur_id');
    }

    // Ajout de l'URL du support
    protected $appends = ['support_url'];

    public function getSupportUrlAttribute()
    {
        return $this->support ? Storage::url($this->support) : null;
    }

    // Relation avec Logistique
    public function Logistique()
    {
        return $this->hasMany(Logistique::class);
    }

        public function rapports()
    {
        return $this->hasMany(Rapport::class, 'cour_id');
    }


}