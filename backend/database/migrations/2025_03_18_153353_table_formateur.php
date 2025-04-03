<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up() {
        Schema::create('formateurs_participants', function (Blueprint $table) {
            $table->id();
            $table->string('ISTA');
            $table->string('region');
            $table->string('ville');
            $table->enum('role', ['formateur_participant'])->default('formateur_participant');
            $table->foreignId('utilisateur_id')->constrained('utilisateurs')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('formateurs_participants');
    }
};