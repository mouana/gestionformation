<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResponsableDrif extends Model
{
    use HasFactory;
    protected $table ='responsable_drif';

    protected $fillable = [ 'role','utilisateur_id'];

    public function utilisateur()
    {
        return $this->belongsTo(User::class);
    }

    public function formations()
{
    return $this->hasMany(Formation::class, 'responsable_dr_id');
}
  
}

   