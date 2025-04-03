<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResponsableDrif extends Model
{
    protected $table ='responsable_drif';
    protected $fillable = [
        'nom',
        'email',
        'motdePasse',
        'matrecule',
        'role',
        'utilisateur_id',
    ];
}