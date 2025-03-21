<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up() {
        Schema::create('rapports', function (Blueprint $table) {
            $table->id();
            $table->text('contenu');
            $table->date('dateCreation');
            $table->tinyInteger('note')->nullable(); 
            $table->foreignId('cour_id')->constrained('cours')->onDelete('cascade');
            $table->foreignId('responsable_formation_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('rapports');
    }
};