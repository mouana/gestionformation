<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Logistique extends Model
{
    protected $fillable=['nom','description','quantite','cour_id'];

    public function Cours(){

        return $this->belongsTo(Cour::class);

    }
}