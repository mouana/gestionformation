<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;
    protected $table = 'utilisateurs';

    protected $fillable = ['nom', 'email', 'motdePasse', 'matrecule', 'role'];

    protected $hidden = ['motdePasse'];

    public function getAuthPassword()
    {
        return $this->motdePasse;
    }

    public function isAdmin()
    {
        return $this->role === 'admin'; 
    }
}