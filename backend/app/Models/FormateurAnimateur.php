<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormateurAnimateur extends Model
{
    protected $table ='formateurs_animateurs';
    protected $fillable = [
        'nom',
        'email',
        'motdePasse',
        'matrecule',
        'role',
        'utilisateur_id',
    ];
    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
    }

    // Relation avec Formation
    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }

    // Relation avec Cours
    public function cours()
    {
        return $this->hasMany(Cour::class, 'formateur_animateur_id');
    }
    
}



   