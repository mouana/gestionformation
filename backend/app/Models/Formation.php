<?php

namespace App\Models;

use App\Models\ResponsableDrif;
use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{

    protected $fillable = [
        'titre',
        'description',
        'statut',
        'date_validation',
    ];

    protected $casts = [
        'date_validation' => 'datetime',
    ];

    protected $table ='formations';


    public function Cour(){
        return $this->hasMany(Cour::class);
    }


    public function ResponsableDrif(){

        return $this->belongsTo(ResponsableDrif::class);

    }
}