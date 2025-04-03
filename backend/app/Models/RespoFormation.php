<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RespoFormation extends Model
{

    protected $table ='resposable_formation';
    protected $fillable = [
        'nom',
        'email',
        'motdePasse',
        'matrecule',
        'role',
        'utilisateur_id',
    ];
}