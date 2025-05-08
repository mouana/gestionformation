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
        return $this->belongsTo(User::class);
    }
}



   