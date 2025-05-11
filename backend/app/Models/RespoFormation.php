<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Rapport;


class RespoFormation extends Model
{

    protected $table ='responsable_formation';
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

public function rapports()
{
    return $this->hasMany(Rapport::class, 'responsable_formation_id');
}
}