<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
    return new class extends Migration {
        public function up() {
            Schema::create('compte_utilisateurs', function (Blueprint $table) {
                $table->id();
                $table->string('matrecule')->unique();
                $table->string('password'); 
                $table->enum('role', [
                    'administrateur',
                    'formateur_animateur',
                    'formateur_participant',
                    'responsable_formation',
                    'responsable_cdc',
                    'responsable_drif'
                ]);
                $table->foreignId('utilisateur_id')->constrained('utilisateurs')->onDelete('cascade');
                $table->timestamps();
            });
        }
    
        public function down() {
            Schema::dropIfExists('compte_utilisateurs');
        }
    };
    