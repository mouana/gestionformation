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

    public function formation()
    {
        return $this->hasMany(Formation::class,'animateur_id');
    }

    public function cours()
    {
        return $this->hasMany(Cour::class, 'formateur_animateur_id');
    }
    
}