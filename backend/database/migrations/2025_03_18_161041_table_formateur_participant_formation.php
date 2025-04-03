<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up() {
        Schema::create('formateur_participant_formation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formateur_participant_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->foreignId('formation_id')->constrained('formations')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('formateur_participant_formation');
    }
};