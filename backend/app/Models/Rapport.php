<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rapport extends Model
{
    protected $fillable = [
        'contenu',
        'dateCreation',
        'note',
        'cour_id',
        'responsable_formation_id'
    ];

    protected $casts = [
        'dateCreation' => 'date',
        'note' => 'integer'
    ];

    /**
     * Get the course that owns the rapport.
     */
    public function cour(): BelongsTo
    {
        return $this->belongsTo(Cour::class);
    }

    /**
     * Get the responsable formation that owns the rapport.
     */
    public function responsableFormation(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responsable_formation_id');
    }
}
