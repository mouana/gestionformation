<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up() {
        Schema::create('cours', function (Blueprint $table) {
            $table->id();
            $table->string('photo')->nullable();
            $table->date('dateDebut');
            $table->date('dateFin');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->enum('statut', ['planifiée', 'en cours', 'terminée', 'annulée'])->default('planifiée');
            $table->foreignId('formateur_animateur_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('sessions');
    }
};