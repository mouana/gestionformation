<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $table = 'utilisateurs';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'motdePasse',
        'matrecule',
        'role'
    ];

    protected $hidden = [
        'motdePasse',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'motdePasse' => 'hashed',
    ];

    public function getAuthPassword()
    {
        return $this->motdePasse;
    }

    public function isAdmin()
    {
        return $this->role === 'admin'; 
    }

    public function ResponsableDrif(){

        return $this->hasMany(ResponsableDrif::class);

    }
    public function formateurAnimateur(){

        return $this->hasMany(FormateurAnimateur::class,'utilisateur_id');

    }
}