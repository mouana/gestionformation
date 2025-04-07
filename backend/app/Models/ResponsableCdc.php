<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResponsableCdc extends Model
{
    protected $table = 'responsable_cdc';

    protected $fillable = [
        'filiere',
        'region',
        'role',
        'utilisateur_id',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(User::class);
    }
}
