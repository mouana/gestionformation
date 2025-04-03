<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    protected  $fillable =[
        'titre',
        'description',
        'statut',
    ];

    protected $table ='formations';


    public function Cour(){
        return $this->hasMany(Cour::class);
    }
}