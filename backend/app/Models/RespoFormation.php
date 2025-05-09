<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}